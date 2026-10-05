import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';
import { CASE_FRONT_Z, DESK_Y, KEYBOARD } from './constants';
import { KEY_UNIT, keys, keysForChar, RETURN_KEY } from './keyboard-layout';
import type { MacMaterials } from './materials';
import { Part } from './part';

export interface KeyboardHandle {
  type: (char: string) => void;
}

interface KeyboardProps {
  materials: MacMaterials;
  /** Read every frame: 0..1 amount the keycaps float away. */
  explode: { value: number };
}

const KEYCAP_HEIGHT = 0.085;
const TRAVEL = 0.04;

/** Coiled cord from the back of the keyboard into the front of the case. */
class CoilCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private readonly from: THREE.Vector3, private readonly to: THREE.Vector3, private readonly turns: number) {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    target.lerpVectors(this.from, this.to, t);
    const sag = Math.sin(t * Math.PI) * 0.05;
    const angle = t * this.turns * Math.PI * 2;
    target.x += Math.cos(angle) * 0.03;
    target.y += Math.sin(angle) * 0.03 - sag;
    return target;
  }
}

export const Keyboard = forwardRef<KeyboardHandle, KeyboardProps>(function Keyboard({ materials, explode }, ref) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const pressed = useMemo(() => new Float32Array(keys.length), []);
  const seeds = useMemo(() => keys.map((_, index) => {
    const random = (n: number) => (Math.sin(index * 91.7 + n * 47.3) * 0.5 + 0.5);
    return { lift: random(1), tiltX: random(2) - 0.5, tiltZ: random(3) - 0.5, delay: random(4) };
  }), []);
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.16), []);
  const cord = useMemo(() => {
    const from = new THREE.Vector3(0, 0.02, -KEYBOARD.depth / 2);
    const to = new THREE.Vector3(0, DESK_Y + 0.12 - KEYBOARD.position[1], CASE_FRONT_Z - KEYBOARD.position[2] + 0.01);
    return new THREE.TubeGeometry(new CoilCurve(from, to, 22), 220, 0.012, 5, false);
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    cord.dispose();
  }, [geometry, cord]);

  useEffect(() => {
    const instance = mesh.current;
    if (!instance) return;
    const color = new THREE.Color();
    keys.forEach((key, index) => instance.setColorAt(index, color.setScalar(key.modifier ? 0.9 : 1)));
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true;
  }, []);

  useImperativeHandle(ref, () => ({
    type(char: string) {
      const indices = char === '\n' ? [RETURN_KEY] : keysForChar(char);
      indices.forEach((index) => { pressed[index] = 1; });
    },
  }), [pressed]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const instance = mesh.current;
    if (!instance) return;
    const decay = Math.exp(-Math.min(delta, 0.05) * 14);
    const amount = explode.value;
    keys.forEach((key, index) => {
      pressed[index] *= decay;
      // Keys peel off from the front row first, like a wave.
      const wave = Math.min(1, Math.max(0, amount * 1.6 - seeds[index].delay * 0.6));
      const spread = 1 + wave * 0.18;
      dummy.position.set(
        key.x * spread,
        KEYBOARD.height / 2 + KEYCAP_HEIGHT / 2 - pressed[index] * TRAVEL + wave * (0.35 + seeds[index].lift * 0.9),
        key.z * spread - wave * 0.15,
      );
      dummy.rotation.set(wave * seeds[index].tiltX * 1.2, 0, wave * seeds[index].tiltZ * 1.2);
      dummy.scale.set(key.width, KEYCAP_HEIGHT, KEY_UNIT * 0.86);
      dummy.updateMatrix();
      instance.setMatrixAt(index, dummy.matrix);
    });
    instance.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={KEYBOARD.position as unknown as [number, number, number]} rotation={[0.05, 0, 0]}>
      <Part size={[KEYBOARD.width, KEYBOARD.height, KEYBOARD.depth]} radius={0.05} material={materials.plastic} edges={materials.edges} />
      <Part size={[KEYBOARD.width - 0.12, 0.02, 15 / 3 * KEY_UNIT + 0.06]} radius={0.01} position={[0, KEYBOARD.height / 2, 0]} material={materials.slot} />
      <instancedMesh ref={mesh} args={[geometry, materials.keycap, keys.length]} frustumCulled={false} />
      <mesh geometry={cord} material={materials.shade} />
    </group>
  );
});
