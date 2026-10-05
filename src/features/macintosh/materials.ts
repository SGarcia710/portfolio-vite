import * as THREE from 'three';
import { COLORS } from './constants';

interface Blendable {
  material: THREE.MeshStandardMaterial;
  base: THREE.Color;
}

/**
 * Shared materials for the rig. `setBlueprint` blends every surface towards a
 * dark blueprint tone and fades the edge lines in, so the model can switch
 * between product shot and technical drawing without swapping meshes.
 */
export function createMacMaterials() {
  const make = (color: string, params: THREE.MeshStandardMaterialParameters = {}) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, ...params });
    return { material, base: new THREE.Color(color) } satisfies Blendable;
  };

  const surfaces = {
    plastic: make(COLORS.plastic, { roughness: 0.58 }),
    shade: make(COLORS.plasticShade, { roughness: 0.66 }),
    keycap: make(COLORS.keycap, { roughness: 0.5 }),
    keycapMod: make(COLORS.keycapMod, { roughness: 0.5 }),
    slot: make(COLORS.slot, { roughness: 0.8 }),
    glass: make(COLORS.glass, { roughness: 0.18, metalness: 0.2 }),
  };

  const edges = new THREE.LineBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const blueprint = new THREE.Color(COLORS.blueprint);
  const accent = new THREE.Color(COLORS.accent);
  let current = -1;

  return {
    ...Object.fromEntries(Object.entries(surfaces).map(([key, value]) => [key, value.material])) as Record<keyof typeof surfaces, THREE.MeshStandardMaterial>,
    edges,
    setBlueprint(amount: number) {
      if (Math.abs(amount - current) < 0.001) return;
      current = amount;
      Object.values(surfaces).forEach(({ material, base }) => {
        material.color.copy(base).lerp(blueprint, amount);
        material.emissive.copy(accent).multiplyScalar(amount * 0.05);
      });
      edges.opacity = amount;
      edges.visible = amount > 0.01;
    },
    dispose() {
      Object.values(surfaces).forEach(({ material }) => material.dispose());
      edges.dispose();
    },
  };
}

export type MacMaterials = ReturnType<typeof createMacMaterials>;
