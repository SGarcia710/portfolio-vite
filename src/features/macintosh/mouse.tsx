import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CASE, CASE_FRONT_Z, DESK_Y, MOUSE, SCREEN } from './constants';
import type { MacMaterials } from './materials';
import { Part } from './part';
import type { ScreenRenderer } from './screen-renderer';

interface MouseProps {
  materials: MacMaterials;
  screen: ScreenRenderer;
}

const PORT = new THREE.Vector3(0.75, DESK_Y + 0.25, CASE_FRONT_Z - CASE.depth - 0.02);

/** The one-button mouse follows the on-screen cursor, so scrolling the page drags it across the desk. */
export function Mouse({ materials, screen }: MouseProps) {
  const body = useRef<THREE.Group>(null);
  const button = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Mesh>(null);
  const lastCable = useRef(new THREE.Vector3(Infinity, 0, 0));
  const points = useMemo(() => Array.from({ length: 5 }, () => new THREE.Vector3()), []);

  useEffect(() => () => cable.current?.geometry.dispose(), []);

  useFrame(() => {
    const group = body.current;
    if (!group) return;
    const u = screen.cursor.x / SCREEN.pixels.width - 0.5;
    const v = screen.cursor.y / SCREEN.pixels.height - 0.5;
    group.position.set(MOUSE.position[0] + u * MOUSE.travel.x, MOUSE.position[1], MOUSE.position[2] + v * MOUSE.travel.z);
    group.rotation.y = -u * 0.12;
    if (button.current) {
      const target = screen.dragging ? -0.018 : 0;
      button.current.position.y += (MOUSE.height / 2 + 0.005 + target - button.current.position.y) * 0.35;
    }

    // Rebuild the cable only when the mouse actually moved.
    if (cable.current && group.position.distanceToSquared(lastCable.current) > 0.0004) {
      lastCable.current.copy(group.position);
      const start = group.position.clone().add(new THREE.Vector3(0, -0.06, -MOUSE.depth / 2));
      points[0].copy(start);
      points[1].set(start.x, DESK_Y + 0.02, start.z - 0.35);
      points[2].set((start.x + PORT.x) / 2 + 0.6, DESK_Y + 0.02, (start.z + PORT.z) / 2);
      points[3].set(PORT.x + 0.5, DESK_Y + 0.02, PORT.z - 0.25);
      points[4].copy(PORT);
      cable.current.geometry.dispose();
      cable.current.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, 0.016, 5, false);
    }
  });

  return (
    <group>
      <group ref={body}>
        <Part size={[MOUSE.width, MOUSE.height, MOUSE.depth]} radius={0.11} material={materials.plastic} edges={materials.edges} />
        <group ref={button} position={[0, MOUSE.height / 2 + 0.005, MOUSE.depth / 2 - 0.22]}>
          <Part size={[MOUSE.width - 0.1, 0.03, 0.36]} radius={0.012} material={materials.shade} edges={materials.edges} />
        </group>
      </group>
      <mesh ref={cable} material={materials.shade} />
    </group>
  );
}
