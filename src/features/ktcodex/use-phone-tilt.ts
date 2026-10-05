import { useEffect, useRef, useState } from 'react';

type OrientationAPI = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export interface PhoneTilt {
  touch: boolean;
  x: number;
  y: number;
}

export function usePhoneTilt(reduced: boolean) {
  const tilt = useRef<PhoneTilt>({ touch: false, x: 0, y: 0 });
  const [permission, setPermission] = useState<'hidden' | 'ready' | 'pending' | 'granted' | 'denied'>('hidden');
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const update = () => {
      tilt.current.touch = media.matches;
      tilt.current.x = tilt.current.y = 0;
      const available = media.matches && !reduced && window.isSecureContext && 'DeviceOrientationEvent' in window;
      const api = window.DeviceOrientationEvent as OrientationAPI | undefined;
      setPermission(available && api?.requestPermission && !granted ? 'ready' : 'hidden');
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [reduced, granted]);

  useEffect(() => {
    const api = window.DeviceOrientationEvent as OrientationAPI | undefined;
    if (reduced || !window.isSecureContext || !api || (api.requestPermission && !granted)) return;
    let baseline: { beta: number; gamma: number; angle: number } | null = null;
    const reset = () => {
      baseline = null;
      tilt.current.x = tilt.current.y = 0;
    };
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (document.hidden || !tilt.current.touch) return;
      const { beta, gamma } = event;
      if (beta === null || gamma === null || !Number.isFinite(beta) || !Number.isFinite(gamma)) return;
      const angle = window.screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0;
      // Start from the visitor's natural grip; recalibrate after rotating the screen.
      if (!baseline || baseline.angle !== angle) baseline = { beta, gamma, angle };
      const pitch = ((beta - baseline.beta + 540) % 360) - 180;
      const roll = ((gamma - baseline.gamma + 540) % 360) - 180;
      const radians = angle * Math.PI / 180;
      const clamp = (value: number) => Math.max(-1, Math.min(1, value / 25));
      tilt.current.x = clamp(roll * Math.cos(radians) + pitch * Math.sin(radians));
      tilt.current.y = clamp(pitch * Math.cos(radians) - roll * Math.sin(radians));
    };
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    document.addEventListener('visibilitychange', reset);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      document.removeEventListener('visibilitychange', reset);
      reset();
    };
  }, [reduced, granted]);

  const requestPermission = async () => {
    const api = window.DeviceOrientationEvent as OrientationAPI | undefined;
    if (!api?.requestPermission || permission === 'pending') return;
    setPermission('pending');
    try {
      // Safari requires this call directly inside a visitor's tap handler.
      const result = await api.requestPermission();
      setPermission(result);
      setGranted(result === 'granted');
    } catch {
      setPermission('denied');
    }
  };

  return { tilt, permission, requestPermission };
}
