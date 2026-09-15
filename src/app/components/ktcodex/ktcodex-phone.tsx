import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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

function PhoneModel({ screenSrc, reduced }: { screenSrc: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const screen = useTexture(screenSrc);
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
    uAspect: { value: screen.image.height / screen.image.width },
  }), [screen]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const amount = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, reduced ? 0.04 : 0.04 - state.pointer.y * 0.1, amount);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, reduced ? -0.32 : -0.32 + state.pointer.x * 0.18, amount);
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
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return (
    <div className="ktc-phone-canvas" role="img" aria-label={alt}>
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
          <PhoneModel screenSrc={screenSrc} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
