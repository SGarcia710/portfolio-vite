import * as THREE from 'three';
import { COLORS } from './constants';

interface Tracked {
  material: THREE.MeshStandardMaterial;
  base: THREE.Color;
}

/**
 * Blends the model's materials towards a dark blueprint tone and fades in
 * accent edge lines, so the product shot can turn into a technical drawing
 * without swapping meshes.
 */
export function createBlueprint(meshes: THREE.Mesh[]) {
  const tracked = new Map<THREE.Material, Tracked>();
  const edges = new THREE.LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const lines: THREE.LineSegments[] = [];

  meshes.forEach((mesh) => {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial) || tracked.has(material)) return;
      material.polygonOffset = true;
      material.polygonOffsetFactor = 1;
      material.polygonOffsetUnits = 1;
      tracked.set(material, { material, base: material.color.clone() });
    });
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), edges);
    line.visible = false;
    line.raycast = () => {};
    mesh.add(line);
    lines.push(line);
  });

  const blueprint = new THREE.Color(COLORS.blueprint);
  const accent = new THREE.Color(COLORS.accent);
  let current = -1;

  return {
    set(amount: number) {
      if (Math.abs(amount - current) < 0.001) return;
      current = amount;
      tracked.forEach(({ material, base }) => {
        material.color.copy(base).lerp(blueprint, amount);
        material.emissive.copy(accent).multiplyScalar(amount * 0.05);
      });
      edges.opacity = amount;
      lines.forEach((line) => { line.visible = amount > 0.01; });
    },
    dispose() {
      lines.forEach((line) => {
        line.removeFromParent();
        line.geometry.dispose();
      });
      tracked.forEach(({ material, base }) => {
        material.color.copy(base);
        material.emissive.setScalar(0);
      });
      edges.dispose();
    },
  };
}
