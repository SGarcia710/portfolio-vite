import * as THREE from 'three';

// Coordinates are shared with the launch shader (a 600 × 1287 display).
export const launchIcon = { x: 190, y: 350, size: 94 };

export function createHomeTexture(icon: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 1287;
  const ctx = canvas.getContext('2d')!;
  const wallpaper = ctx.createLinearGradient(0, 0, 600, 1287);
  wallpaper.addColorStop(0, '#303841');
  wallpaper.addColorStop(0.55, '#151b23');
  wallpaper.addColorStop(1, '#080d14');
  ctx.fillStyle = wallpaper;
  ctx.fillRect(0, 0, 600, 1287);
  ctx.strokeStyle = '#ffffff0e';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 600; x += 48) {
    for (let y = 0; y <= 1287; y += 48) {
      ctx.strokeRect(x, y, 48, 48);
    }
  }
  // A few softly lit squares echo the project's grid wallpaper.
  for (const [x, y] of [[48, 720], [96, 768], [432, 864], [384, 912], [144, 1008]]) {
    ctx.fillStyle = '#ffffff08';
    ctx.fillRect(x, y, 48, 48);
  }
  function rounded(x: number, y: number, w: number, h: number, r: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }
  ctx.fillStyle = '#eef0f2';
  ctx.font = '600 26px system-ui';
  ctx.fillText('9:41', 48, 62);
  for (let i = 0; i < 4; i++) rounded(465 + i * 9, 57 - i * 5, 6, 10 + i * 5, 2, '#eef0f2');
  rounded(516, 37, 37, 21, 5, '#eef0f2');
  rounded(555, 43, 3, 9, 1, '#aeb4ba');
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 52 + col * 138;
      const y = 170 + row * 180;
      rounded(x, y, 94, 94, 23, '#ffffff0a');
      rounded(x + 1, y + 1, 92, 92, 22, row === 3 ? '#636970' : '#777d83');
      if (row === 1 && col === 1) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, 94, 94, 23);
        ctx.clip();
        ctx.drawImage(icon, x, y, 94, 94);
        ctx.restore();
        ctx.fillStyle = '#f2f3f5';
        ctx.font = '500 21px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('KTCodex', x + 47, y + 125);
      }
    }
  }
  rounded(22, 1098, 556, 144, 42, '#ffffff26');
  for (let col = 0; col < 4; col++) rounded(52 + col * 138, 1122, 94, 94, 23, '#95999e');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
