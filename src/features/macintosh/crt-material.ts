import * as THREE from 'three';
import { MODEL } from './constants';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uPower;
  uniform float uTime;
  uniform vec4 uRaster;
  varying vec2 vUv;

  void main() {
    // glTF UVs start at the top-left; the canvas texture starts at the bottom-left.
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec2 raster = (uv - uRaster.xy) / (uRaster.zw - uRaster.xy);
    vec2 centered = raster - 0.5;
    float inside = step(0.0, raster.x) * step(raster.x, 1.0) * step(0.0, raster.y) * step(raster.y, 1.0);

    // Power-on: a bright line that opens into the full raster.
    float widthOpen = mix(0.015, 0.5, smoothstep(0.0, 0.3, uPower));
    float heightOpen = mix(0.003, 0.5, smoothstep(0.3, 0.75, uPower));
    float beam = step(abs(centered.x), widthOpen) * step(abs(centered.y), heightOpen);
    float flash = (1.0 - smoothstep(0.55, 1.0, uPower)) * beam;

    float lum = texture2D(uMap, clamp(raster, 0.0, 1.0)).r;
    vec3 phosphor = mix(vec3(0.018, 0.022, 0.028), vec3(0.84, 0.9, 0.98), lum);
    // Scanlines fade out once they get thinner than a screen pixel, avoiding moire.
    float lines = raster.y * 342.0;
    float resolvable = clamp(1.6 - fwidth(lines) * 2.0, 0.0, 1.0);
    float scan = 1.0 - 0.07 * resolvable * (0.5 - 0.5 * cos(lines * 6.2831));
    float vignette = smoothstep(0.82, 0.3, length(centered * vec2(1.0, 1.15)));
    float flicker = 0.985 + 0.015 * sin(uTime * 53.0);
    vec3 color = phosphor * scan * mix(0.68, 1.0, vignette) * flicker * beam * inside * smoothstep(0.3, 0.8, uPower);
    color += vec3(0.75, 0.82, 1.0) * flash * inside * 0.9;

    // Dark tube glass around the raster, with a faint glow when it is on.
    float halo = exp(-length(max(abs(centered) - 0.5, 0.0)) * 18.0) * 0.05 * uPower;
    color += (1.0 - inside) * (vec3(0.03, 0.035, 0.04) + vec3(0.55, 0.65, 0.8) * halo);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createCrtMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uPower: { value: 0 },
      uTime: { value: 0 },
      uRaster: { value: new THREE.Vector4(...MODEL.raster) },
    },
    vertexShader,
    fragmentShader,
    toneMapped: false,
  });
}
