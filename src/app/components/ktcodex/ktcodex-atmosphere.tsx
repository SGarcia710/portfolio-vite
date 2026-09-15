import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import skullTextureUrl from '../../../assets/ktcodex/skull.svg';

const TRAIL_LENGTH = 10;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uSkull;
  uniform vec2 uTrail[${TRAIL_LENGTH}];
  uniform float uTime;
  uniform float uAspect;
  uniform float uPresence;

  void main() {
    float reveal = 0.0;
    float ripple = 0.0;

    for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
      vec2 delta = vUv - uTrail[i];
      delta.x *= uAspect;
      float distanceToTrail = length(delta);
      float age = 1.0 - float(i) / float(${TRAIL_LENGTH});
      reveal += (1.0 - smoothstep(0.0, 0.18 * age, distanceToTrail)) * age;
      ripple += sin(distanceToTrail * 75.0 - uTime * 3.2 - float(i))
        * (1.0 - smoothstep(0.0, 0.16 * age, distanceToTrail)) * 0.08;
    }

    // One square emblem, centered just beyond the right viewport edge.
    // No fract/repeat: only the left half of the oversized skull is visible.
    vec2 iconUv = vec2((vUv.x - 1.02) * uAspect, vUv.y - 0.5) / 1.12 + 0.5;
    iconUv += vec2(ripple * 0.015, ripple * 0.008) * uPresence;
    float bounds = step(0.0, iconUv.x) * step(iconUv.x, 1.0)
      * step(0.0, iconUv.y) * step(iconUv.y, 1.0);
    float skull = texture2D(uSkull, clamp(iconUv, 0.0, 1.0)).a * bounds;
    float proximity = smoothstep(0.55, 0.9, uTrail[0].x);
    float alpha = skull * clamp(0.12 * proximity + reveal * 0.24 + ripple, 0.0, 0.42) * uPresence;
    vec3 color = mix(vec3(0.72, 0.2, 0.015), vec3(1.0, 0.48, 0.08), clamp(ripple * 5.0, 0.0, 1.0));

    gl_FragColor = vec4(color, alpha);
  }
`;

function ReactiveField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Vector2(-2, -2));
  const lastMove = useRef(-10000);
  const skull = useTexture(skullTextureUrl);
  const trail = useMemo(
    () => Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(-2, -2)),
    [],
  );
  const uniforms = useMemo(() => ({
    uSkull: { value: skull },
    uTrail: { value: trail },
    uTime: { value: 0 },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uPresence: { value: 0 },
  }), [skull, trail]);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const handlePointer = (event: PointerEvent) => {
      if (!media.matches) return;
      target.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
      lastMove.current = performance.now();
    };
    const handleLeave = () => target.current.set(-2, -2);
    const handleResize = () => {
      uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [uniforms]);

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPresence.value = THREE.MathUtils.lerp(
      uniforms.uPresence.value,
      performance.now() - lastMove.current < 180 ? 1 : 0,
      1 - Math.exp(-Math.min(delta, 0.05) * 3),
    );

    trail[0].lerp(target.current, 1 - Math.exp(-delta * 13));
    for (let index = 1; index < trail.length; index += 1) {
      trail[index].lerp(trail[index - 1], 1 - Math.exp(-delta * (10 - index * 0.45)));
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function KTCodexAtmosphere() {
  return (
    <div className="ktc-atmosphere" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[0.75, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <ReactiveField />
      </Canvas>
    </div>
  );
}
