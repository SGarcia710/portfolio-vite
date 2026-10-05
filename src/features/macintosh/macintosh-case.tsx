import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { logoPaths } from '../../components/logo';
import { CASE, CASE_FRONT_Z, COLORS, SCREEN } from './constants';
import type { MacMaterials } from './materials';
import { Part } from './part';

const BEVEL = 0.035;

function roundedRect<T extends THREE.Path>(shape: T, width: number, height: number, radius: number, y = 0): T {
  const x = -width / 2;
  const top = y + height / 2;
  const bottom = y - height / 2;
  shape.moveTo(x + radius, bottom);
  shape.lineTo(x + width - radius, bottom);
  shape.quadraticCurveTo(x + width, bottom, x + width, bottom + radius);
  shape.lineTo(x + width, top - radius);
  shape.quadraticCurveTo(x + width, top, x + width - radius, top);
  shape.lineTo(x + radius, top);
  shape.quadraticCurveTo(x, top, x, top - radius);
  shape.lineTo(x, bottom + radius);
  shape.quadraticCurveTo(x, bottom, x + radius, bottom);
  return shape;
}

/** Front shell: the full case outline with the screen opening cut through it. */
function useFrontGeometry() {
  return useMemo(() => {
    const shape = roundedRect(new THREE.Shape(), CASE.width - BEVEL * 2, CASE.height - BEVEL * 2, CASE.radius);
    const hole = roundedRect(new THREE.Path(), SCREEN.outer.width + BEVEL * 2, SCREEN.outer.height + BEVEL * 2, 0.06, SCREEN.outer.y);
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, {
      depth: CASE.frontDepth - BEVEL * 2,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 4,
      curveSegments: 10,
    });
  }, []);
}

/** Sloped walls between the bezel opening and the tube. */
function useRecessGeometry() {
  return useMemo(() => {
    const { outer, inner, depth } = SCREEN;
    const o = [outer.width / 2, outer.height / 2];
    const i = [inner.width / 2, inner.height / 2];
    const quad = (a: number[], b: number[], c: number[], d: number[]) => [...a, ...b, ...c, ...a, ...c, ...d];
    const front = (x: number, y: number) => [x, y, 0];
    const back = (x: number, y: number) => [x, y, -depth];
    const positions = [
      ...quad(front(-o[0], o[1]), back(-i[0], i[1]), back(i[0], i[1]), front(o[0], o[1])),
      ...quad(front(o[0], -o[1]), back(i[0], -i[1]), back(-i[0], -i[1]), front(-o[0], -o[1])),
      ...quad(front(-o[0], -o[1]), back(-i[0], -i[1]), back(-i[0], i[1]), front(-o[0], o[1])),
      ...quad(front(o[0], o[1]), back(i[0], i[1]), back(i[0], -i[1]), front(o[0], -o[1])),
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

/** Display plane with a gentle CRT bulge. */
function useTubeGeometry() {
  return useMemo(() => {
    const { width, height } = SCREEN.display;
    const geometry = new THREE.PlaneGeometry(width, height, 24, 16);
    const position = geometry.attributes.position;
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index) / (width / 2);
      const y = position.getY(index) / (height / 2);
      position.setZ(index, 0.045 * (1 - x * x * 0.6) * (1 - y * y * 0.6));
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

const tubeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const tubeFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uPower;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    // Power-on: a bright line that opens into the full raster.
    float widthOpen = mix(0.015, 0.5, smoothstep(0.0, 0.3, uPower));
    float heightOpen = mix(0.003, 0.5, smoothstep(0.3, 0.75, uPower));
    float raster = step(abs(centered.x), widthOpen) * step(abs(centered.y), heightOpen);
    float flash = (1.0 - smoothstep(0.55, 1.0, uPower)) * raster;

    float lum = texture2D(uMap, vUv).r;
    vec3 phosphor = mix(vec3(0.018, 0.022, 0.028), vec3(0.84, 0.9, 0.98), lum);
    float scan = 0.955 + 0.045 * sin(vUv.y * 342.0 * 6.2831);
    float vignette = smoothstep(0.82, 0.3, length(centered * vec2(1.0, 1.15)));
    float flicker = 0.985 + 0.015 * sin(uTime * 53.0);
    vec3 color = phosphor * scan * mix(0.68, 1.0, vignette) * flicker * raster * smoothstep(0.3, 0.8, uPower);
    color += vec3(0.75, 0.82, 1.0) * flash * 0.9;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 212;
  canvas.height = 260;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = COLORS.brand;
  logoPaths.brand.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.fillStyle = '#3a3631';
  logoPaths.ink.forEach((d) => ctx.fill(new Path2D(d)));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

interface MacintoshCaseProps {
  materials: MacMaterials;
  screen: THREE.Texture;
  power: { value: number };
}

export function MacintoshCase({ materials, screen, power }: MacintoshCaseProps) {
  const front = useFrontGeometry();
  const recess = useRecessGeometry();
  const tube = useTubeGeometry();
  const frontEdges = useMemo(() => new THREE.EdgesGeometry(front, 20), [front]);
  const logo = useMemo(createLogoTexture, []);
  const uniforms = useMemo(() => ({ uMap: { value: screen }, uPower: { value: 0 }, uTime: { value: 0 } }), [screen]);

  useEffect(() => () => {
    [front, recess, tube, frontEdges].forEach((geometry) => geometry.dispose());
    logo.dispose();
  }, [front, recess, tube, frontEdges, logo]);

  useFrame((state) => {
    uniforms.uPower.value = power.value;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  const rearDepth = CASE.depth - CASE.frontDepth + 0.05;
  const rearZ = CASE_FRONT_Z - CASE.frontDepth - rearDepth / 2 + 0.05;
  const rearTop = (CASE.height - 0.12) / 2 - 0.02;
  const frontZ = CASE_FRONT_Z - CASE.frontDepth + BEVEL;
  const screenZ = CASE_FRONT_Z - SCREEN.depth;

  return (
    <group>
      <mesh geometry={front} material={materials.plastic} position={[0, 0, frontZ]} />
      <lineSegments geometry={frontEdges} material={materials.edges} position={[0, 0, frontZ]} />

      <Part size={[CASE.width - 0.1, CASE.height - 0.12, rearDepth]} radius={0.12} position={[0, -0.02, rearZ]} material={materials.plastic} edges={materials.edges} />
      {/* Seam between the front bezel and the rear housing. */}
      <Part size={[CASE.width - 0.12, CASE.height - 0.14, 0.03]} radius={0.05} position={[0, -0.02, CASE_FRONT_Z - CASE.frontDepth - 0.01]} material={materials.slot} />

      <mesh geometry={recess} material={materials.shade} position={[0, SCREEN.outer.y, CASE_FRONT_Z]} />
      <mesh position={[0, SCREEN.outer.y, screenZ + 0.002]} material={materials.glass}>
        <planeGeometry args={[SCREEN.inner.width + 0.02, SCREEN.inner.height + 0.02]} />
      </mesh>
      <mesh geometry={tube} position={[0, SCREEN.outer.y, screenZ + 0.006]}>
        <shaderMaterial uniforms={uniforms} vertexShader={tubeVertex} fragmentShader={tubeFragment} toneMapped={false} />
      </mesh>

      {/* SG badge where the Apple logo used to be. */}
      <mesh position={[-0.82, -0.64, CASE_FRONT_Z + 0.002]}>
        <planeGeometry args={[0.14, 0.172]} />
        <meshStandardMaterial map={logo} transparent roughness={0.4} />
      </mesh>

      {/* Floppy drive. */}
      <Part size={[1.02, 0.2, 0.02]} radius={0.01} position={[0.42, -0.66, CASE_FRONT_Z - 0.004]} material={materials.shade} />
      <Part size={[0.8, 0.055, 0.02]} radius={0.01} position={[0.42, -0.66, CASE_FRONT_Z + 0.004]} material={materials.slot} />
      <mesh position={[0.92, -0.66, CASE_FRONT_Z + 0.004]} material={materials.slot}>
        <circleGeometry args={[0.012, 12]} />
      </mesh>

      {/* Chin groove and base. */}
      <Part size={[CASE.width - 0.16, 0.02, 0.02]} radius={0.005} position={[0, -1.39, CASE_FRONT_Z + 0.002]} material={materials.slot} />
      <Part size={[CASE.width - 0.3, 0.1, CASE.depth - 0.35]} radius={0.03} position={[0, -CASE.height / 2 - 0.035, -0.05]} material={materials.shade} edges={materials.edges} />

      {/* Cooling vents and handle recess on the top of the rear housing. */}
      {Array.from({ length: 12 }, (_, index) => (
        <Part key={index} size={[0.035, 0.012, 0.55]} radius={0.004} position={[-0.6 + index * 0.11, rearTop + 0.002, rearZ + 0.15]} material={materials.slot} />
      ))}
      <Part size={[1.25, 0.012, 0.2]} radius={0.004} position={[0, rearTop + 0.002, rearZ - rearDepth / 2 + 0.22]} material={materials.slot} />

      {/* Rear ports. */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((x) => (
        <Part key={x} size={[0.22, 0.09, 0.02]} radius={0.01} position={[x, -1.25, rearZ - rearDepth / 2 - 0.004]} material={materials.slot} />
      ))}
    </group>
  );
}
