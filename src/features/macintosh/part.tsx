import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { ThreeElements } from '@react-three/fiber';

type Vec3 = [number, number, number];

interface PartProps extends Omit<ThreeElements['group'], 'args'> {
  size: Vec3;
  radius?: number;
  material: THREE.Material;
  /** Edge lines drawn in blueprint mode. */
  edges?: THREE.LineBasicMaterial;
  segments?: number;
}

/** Rounded box with optional blueprint edges. Geometry is cached per size. */
export function Part({ size, radius = 0.02, material, edges, segments = 3, ...group }: PartProps) {
  const [width, height, depth] = size;
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, segments, Math.min(radius, width / 2, height / 2, depth / 2)),
    [width, height, depth, radius, segments],
  );
  const edgeGeometry = useMemo(() => (edges ? new THREE.EdgesGeometry(geometry, 20) : null), [geometry, edges]);

  useEffect(() => () => {
    geometry.dispose();
    edgeGeometry?.dispose();
  }, [geometry, edgeGeometry]);

  return (
    <group {...group}>
      <mesh geometry={geometry} material={material} />
      {edgeGeometry && edges && <lineSegments geometry={edgeGeometry} material={edges} />}
    </group>
  );
}
