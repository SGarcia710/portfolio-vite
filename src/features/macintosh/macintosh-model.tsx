import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { createBlueprint } from './blueprint';
import { MODEL, SCREEN } from './constants';
import { createCrtMaterial } from './crt-material';
import { keysForChar } from './keyboard-layout';
import type { ScreenRenderer } from './screen-renderer';

export interface MacintoshModelHandle {
  type: (char: string) => void;
}

interface MacintoshModelProps {
  screen: ScreenRenderer;
  /** Each is read every frame: CRT power 0..1, keycap explosion 0..1, blueprint 0..1. */
  power: { value: number };
  explode: { value: number };
  xray: { value: number };
}

interface Keycap {
  node: THREE.Object3D;
  rest: THREE.Vector3;
  pressed: number;
  lift: number;
  tiltX: number;
  tiltZ: number;
  delay: number;
}

const CABLE_REACH = 0.14;

/** Rigs the loaded scene: CRT material, keycaps, mouse and the cable that follows it. */
function rigModel(scene: THREE.Group, screenTexture: THREE.Texture) {
  // Node matrices are only composed on the first render; the rig needs them now.
  scene.updateMatrixWorld(true);
  const meshes: THREE.Mesh[] = [];
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) meshes.push(object);
  });

  const screenMesh = scene.getObjectByName('screen') as THREE.Mesh;
  const crt = createCrtMaterial(screenTexture);
  screenMesh.material = crt;

  const keyboard = scene.getObjectByName('keyboard')!;
  const keyCenter = new THREE.Vector3();
  const keycaps = new Map<string, Keycap>();
  keyboard.children.forEach((node, index) => {
    if (!node.name.startsWith('key_')) return;
    const random = (n: number) => Math.sin(index * 91.7 + n * 47.3) * 0.5 + 0.5;
    keycaps.set(node.name, { node, rest: node.position.clone(), pressed: 0, lift: random(1), tiltX: random(2) - 0.5, tiltZ: random(3) - 0.5, delay: random(4) });
    keyCenter.add(node.position);
  });
  keyCenter.divideScalar(Math.max(1, keycaps.size));

  const mouse = scene.getObjectByName('mouse')!;
  const mouseRest = mouse.position.clone();
  const button = scene.getObjectByName('mouse_button')!;
  const buttonRest = button.position.clone();

  // The cable end near the mouse is weighted so it bends as the mouse moves.
  const cable = scene.getObjectByName('mouse_cable') as THREE.Mesh;
  cable.geometry = cable.geometry.clone();
  const position = cable.geometry.attributes.position as THREE.BufferAttribute;
  const original = new Float32Array(position.count * 3);
  const weights = new Float32Array(position.count);
  const local = new THREE.Vector3();
  const tip = mouseRest.clone();
  let nearest = Infinity;
  for (let i = 0; i < position.count; i += 1) {
    local.fromBufferAttribute(position, i);
    original.set([local.x, local.y, local.z], i * 3);
    const world = local.clone().applyMatrix4(cable.matrix);
    const distance = world.distanceTo(mouseRest);
    if (distance < nearest) {
      nearest = distance;
      tip.copy(world);
    }
  }
  for (let i = 0; i < position.count; i += 1) {
    local.fromArray(original, i * 3).applyMatrix4(cable.matrix);
    const t = Math.max(0, 1 - local.distanceTo(tip) / CABLE_REACH);
    weights[i] = t * t * (3 - 2 * t);
  }
  const cableInverse = new THREE.Matrix3().setFromMatrix4(cable.matrix).invert();

  const blueprint = createBlueprint(meshes.filter((mesh) => mesh !== screenMesh && mesh !== cable));

  return { crt, keycaps, keyCenter, mouse, mouseRest, button, buttonRest, cable, position, original, weights, cableInverse, blueprint };
}

export const MacintoshModel = forwardRef<MacintoshModelHandle, MacintoshModelProps>(function MacintoshModel(
  { screen, power, explode, xray },
  ref,
) {
  const { scene } = useGLTF(MODEL.url);
  const rig = useMemo(() => rigModel(scene, screen.texture), [scene, screen]);

  useEffect(() => () => {
    rig.blueprint.dispose();
    rig.crt.dispose();
  }, [rig]);

  useImperativeHandle(ref, () => ({
    type(char: string) {
      keysForChar(char).forEach((name) => {
        const key = rig.keycaps.get(name);
        if (key) key.pressed = 1;
      });
    },
  }), [rig]);

  const delta = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    rig.crt.uniforms.uPower.value = power.value;
    rig.crt.uniforms.uTime.value = state.clock.elapsedTime;
    rig.blueprint.set(xray.value);

    // Keycaps: press travel, then peel off from the front row in a wave.
    const decay = Math.exp(-dt * 14);
    const amount = explode.value;
    rig.keycaps.forEach((key) => {
      key.pressed *= decay;
      const wave = Math.min(1, Math.max(0, amount * 1.6 - key.delay * 0.6));
      key.node.position.copy(key.rest).sub(rig.keyCenter).multiplyScalar(1 + wave * 0.18).add(rig.keyCenter);
      key.node.position.y += -key.pressed * MODEL.keyTravel + wave * (0.03 + key.lift * 0.07);
      key.node.rotation.set(wave * key.tiltX * 1.2, 0, wave * key.tiltZ * 1.2);
    });

    // The mouse mirrors the on-screen cursor; scrolling drags it across the desk.
    const u = screen.cursor.x / SCREEN.pixels.width - 0.5;
    const v = screen.cursor.y / SCREEN.pixels.height - 0.5;
    delta.set(u * MODEL.mouseTravel.x, 0, v * MODEL.mouseTravel.z);
    rig.mouse.position.copy(rig.mouseRest).add(delta);
    rig.button.position.y = rig.buttonRest.y - (screen.dragging ? 0.0012 : 0);

    const { position, original, weights, cableInverse } = rig;
    for (let i = 0; i < position.count; i += 1) {
      offset.copy(delta).multiplyScalar(weights[i]).applyMatrix3(cableInverse);
      position.setXYZ(i, original[i * 3] + offset.x, original[i * 3 + 1] + offset.y, original[i * 3 + 2] + offset.z);
    }
    position.needsUpdate = true;
  });

  return <primitive object={scene} />;
});

useGLTF.preload(MODEL.url);
