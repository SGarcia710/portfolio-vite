import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhoneTilt, type PhoneTilt } from './use-phone-tilt';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import appIcon from '../../../assets/ktcodex/app-icon.png';
import appMark from '../../../assets/ktcodex/app-icon-mark.png';
import { createHomeTexture, launchIcon } from './phone-home-texture';

gsap.registerPlugin(ScrollTrigger);

interface ProjectPhoneProps {
  alt: string;
  screenSrc: string;
}

// Front corner radius is independent of the thin extrusion depth.
function silhouette(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function Shell({ width, height, radius, depth, z, color, metalness = 0.8 }: {
  width: number; height: number; radius: number; depth: number;
  z: number; color: string; metalness?: number;
}) {
  const shape = useMemo(() => silhouette(width, height, radius), [width, height, radius]);
  return (
    <mesh position={[0, 0, z]}>
      <extrudeGeometry args={[shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 24 }]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={0.26} />
    </mesh>
  );
}

function PhoneModel({ screenSrc, reduced, progress, tilt }: { screenSrc: string; reduced: boolean; progress: { value: number }; tilt: MutableRefObject<PhoneTilt> }) {
  const group = useRef<THREE.Group>(null);
  const [screen, icon, mark] = useTexture([screenSrc, appIcon, appMark]);
  const home = useMemo(() => createHomeTexture(icon.image), [icon]);
  useEffect(() => () => home.dispose(), [home]);
  icon.colorSpace = mark.colorSpace = THREE.SRGBColorSpace;
  const island = useMemo(() => silhouette(0.72, 0.19, 0.095), []);
  const screenGeometry = useMemo(() => {
    const geometry = new THREE.ShapeGeometry(silhouette(2.55, 5.47, 0.36), 32);
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < position.count; i++) {
      uv.setXY(i, position.getX(i) / 2.55 + 0.5, position.getY(i) / 5.47 + 0.5);
    }
    return geometry;
  }, []);
  useEffect(() => () => screenGeometry.dispose(), [screenGeometry]);
  screen.colorSpace = THREE.SRGBColorSpace;
  const uniforms = useMemo(() => ({
    uScreen: { value: screen },
    uHome: { value: home },
    uIcon: { value: icon },
    uMark: { value: mark },
    uProgress: { value: reduced ? 1 : 0 },
    uIconCenter: { value: new THREE.Vector2((launchIcon.x + launchIcon.size / 2) / 600, 1 - (launchIcon.y + launchIcon.size / 2) / 1287) },
    uAspect: { value: screen.image.height / screen.image.width },
  }), [screen, home, icon, mark, reduced]);

  useFrame((state, delta) => {
    uniforms.uProgress.value = reduced ? 1 : progress.value;
    if (!group.current) return;
    const amount = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
    const inputX = tilt.current.touch ? tilt.current.x : state.pointer.x;
    const inputY = tilt.current.touch ? tilt.current.y : state.pointer.y;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, reduced ? 0.04 : 0.04 - inputY * 0.1, amount);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, reduced ? -0.32 : -0.32 + inputX * 0.18, amount);
  });

  return (
    <group ref={group} rotation={[0.04, -0.32, -0.025]}>
      <Shell width={2.78} height={5.7} radius={0.49} depth={0.23} z={-0.16} color="#7b7d80" />
      <Shell width={2.75} height={5.67} radius={0.48} depth={0.018} z={0.083} color="#c3c6ca" />
      <Shell width={2.70} height={5.62} radius={0.45} depth={0.018} z={0.115} color="#080b0f" metalness={0.25} />
      <mesh geometry={screenGeometry} position={[0, 0, 0.155]}>
        <shaderMaterial toneMapped={false} uniforms={uniforms}
          vertexShader={'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }'}
          fragmentShader={`
            uniform sampler2D uScreen;
            uniform sampler2D uHome;
            uniform sampler2D uIcon;
            uniform sampler2D uMark;
            uniform float uProgress;
            uniform vec2 uIconCenter;
            uniform float uAspect;
            varying vec2 vUv;
            void main() {
              // Reserve space for the island; crop instead of stretching the app.
              float y = (vUv.y - 0.035) / 0.88;
              vec3 color = vec3(0.004, 0.005, 0.007);
              if (y >= 0.0 && y <= 1.0) {
                float visibleHeight = min(1.0, (5.47 * 0.88 / 2.55) / uAspect);
                color = texture2D(uScreen, vec2(vUv.x, 1.0 - (1.0-y)*visibleHeight)).rgb;
              }
              // Expand a rounded app window from the exact home icon bounds.
              float opening = smoothstep(0.12, 0.49, uProgress);
              vec2 center = mix(uIconCenter, vec2(0.5), opening);
              vec2 size = mix(vec2(94.0 / 600.0, 94.0 / 1287.0), vec2(1.0), opening);
              vec2 physicalSize = size * vec2(600.0, 1287.0);
              float radius = mix(23.0, 0.0, opening);
              vec2 q = abs((vUv - center) * vec2(600.0, 1287.0)) - physicalSize * 0.5 + radius;
              float distanceToWindow = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
              float windowMask = 1.0 - smoothstep(-0.8, 0.8, distanceToWindow);
              vec3 homeColor = texture2D(uHome, vUv).rgb * (1.0 - opening * 0.3);
              // The window and its artwork have independent bounds. Only the
              // background becomes rectangular; both logo textures stay square.
              float splashBlend = smoothstep(0.06, 0.12, uProgress);
              vec3 launch = mix(vec3(0.7913, 0.7454, 0.62396), vec3(0.00304, 0.00439, 0.00651), splashBlend);
              float artworkSize = mix(94.0, 117.0, opening);
              vec2 artworkUv = (vUv - center) * vec2(600.0, 1287.0) / artworkSize + 0.5;
              if (min(artworkUv.x, artworkUv.y) >= 0.0 && max(artworkUv.x, artworkUv.y) <= 1.0) {
                vec4 logo = texture2D(uMark, artworkUv);
                vec3 splashArtwork = mix(launch, logo.rgb, logo.a);
                launch = mix(texture2D(uIcon, artworkUv).rgb, splashArtwork, splashBlend);
              }
              launch = mix(launch, color, smoothstep(0.68, 0.87, uProgress));
              color = mix(homeColor, launch, windowMask);
              float reflection = smoothstep(0.68, 0.70, vUv.x * 0.7 + vUv.y * 0.5) * 0.008;
              gl_FragColor = vec4(color + reflection, 1.0);
              #include <colorspace_fragment>
            }
          `}
        />
      </mesh>
      <mesh position={[0, 2.50, 0.17]}>
        <shapeGeometry args={[island, 24]} />
        <meshBasicMaterial color="#020305" />
      </mesh>
      <mesh position={[0.235, 2.50, 0.18]}>
        <circleGeometry args={[0.042, 24]} />
        <meshStandardMaterial color="#182332" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, -2.61, 0.18]} scale={[0.72, 0.028, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#c6c9cd" />
      </mesh>
      {[-0.18, 0.50, 1.25].map((y, index) => (
        <mesh key={y} position={[-1.407, y, -0.04]}>
          <boxGeometry args={[0.045, index === 2 ? 0.23 : 0.48, 0.11]} />
          <meshStandardMaterial color="#919599" metalness={0.85} roughness={0.23} />
        </mesh>
      ))}
      <mesh position={[1.407, 0.65, -0.04]}>
        <boxGeometry args={[0.045, 0.65, 0.11]} />
        <meshStandardMaterial color="#919599" metalness={0.85} roughness={0.23} />
      </mesh>
    </group>
  );
}

export function KTCodexPhone({ alt, screenSrc }: ProjectPhoneProps) {
  const { t } = useTranslation('ktcodex');
  const root = useRef<HTMLDivElement>(null);
  const progress = useMemo(() => ({ value: 0 }), []);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { tilt, permission, requestPermission } = usePhoneTilt(reduced);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reduced || !root.current) return;
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 768px) and (min-height: 600px)', mobile: '(max-width: 767px), (max-height: 599px)' }, context => {
      const desktop = context.conditions?.desktop;
      const target = root.current?.closest(desktop ? '.ktc-hero' : '.ktc-hero-phone');
      if (!target) return;
      gsap.fromTo(progress, { value: 0 }, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: target,
          refreshPriority: 1,
          start: desktop ? 'top 100px' : 'top 90px',
          end: () => `+=${desktop ? 850 : Math.min(700, Math.max(420, window.innerHeight))}`,
          pin: true,
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
      // This lazy component can mount after the story below it. Refresh all
      // pins in document order so the story includes this pin's spacer.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => media.revert();
  }, [reduced, progress]);
  return (
    <div ref={root} className="ktc-phone-canvas">
      <div className="ktc-phone-render" role="img" aria-label={alt}>
      <Canvas dpr={[1, 2]} camera={{ fov: 38, position: [0, 0, 9.6] }}
        frameloop={reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true }}
        fallback={<img src={screenSrc} alt={alt} className="ktc-phone-fallback" />}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 6]} intensity={2.5} />
        <Suspense fallback={null}>
          <Environment resolution={128}>
            <Lightformer position={[-4, 2, 3]} scale={[3, 9, 1]} intensity={3} />
            <Lightformer position={[4, -1, 4]} scale={[2, 7, 1]} intensity={2} />
          </Environment>
          <PhoneModel screenSrc={screenSrc} reduced={reduced} progress={progress} tilt={tilt} />
        </Suspense>
      </Canvas>
      </div>
      {!reduced && (permission === 'ready' || permission === 'pending') && (
        <button type="button" className="ktc-tilt-control" onClick={requestPermission} disabled={permission === 'pending'}>
          {t(permission === 'pending' ? 'tilt.pending' : 'tilt.enable')}
        </button>
      )}
      {!reduced && permission === 'denied' && <p className="ktc-tilt-control" role="status">{t('tilt.denied')}</p>}
    </div>
  );
}
