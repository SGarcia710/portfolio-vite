import { Suspense, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { cn } from '../../lib/cn';
import { DESKTOP, useMediaQuery, usePrefersReducedMotion } from '../../lib/media';
import { useActiveSection } from '../../lib/section-tracker';
import { COLORS } from './constants';
import { MacintoshRig } from './macintosh-rig';

/**
 * Fixed WebGL layer behind the home page. On large screens the Macintosh
 * roams beside the content; on small screens it sits above the hero copy and
 * then settles as a dimmed, still backdrop.
 */
export default function MacintoshScene({ onReady }: { onReady: () => void }) {
  const desktop = useMediaQuery(DESKTOP);
  const reduced = usePrefersReducedMotion();
  const active = useActiveSection() ?? 'top';
  const { t, i18n } = useTranslation('common');

  const content = useMemo(() => ({
    id: active,
    file: t(`screen.${active}.file`),
    title: t(`screen.${active}.title`),
    line: t(`screen.${active}.line`),
  }), [active, t, i18n.resolvedLanguage]);

  // Without WebGL the page works as-is; just release the preloader.
  useEffect(() => {
    if (!supportsWebGL) onReady();
  }, [onReady]);

  if (!supportsWebGL) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none inset-x-0 top-0 z-[var(--z-scene)] h-[100lvh]',
        reduced ? 'absolute' : 'fixed',
      )}
    >
      <Canvas
        dpr={desktop ? [1, 2] : [1, 1.5]}
        camera={{ fov: 26, position: [0, 0.8, 18], near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 7]} intensity={1.9} color="#fff6ec" />
        <directionalLight position={[-7, 3, -5]} intensity={1.6} color={COLORS.accent} />
        <directionalLight position={[7, 1.5, -6]} intensity={0.6} color={COLORS.brand} />
        <Suspense fallback={null}>
          <Environment resolution={desktop ? 256 : 64} frames={1}>
            <Lightformer position={[0, 5, 6]} scale={[10, 4, 1]} intensity={1.4} />
            <Lightformer position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} intensity={0.6} color={COLORS.accent} />
            <Lightformer position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 6, 1]} intensity={0.5} color={COLORS.brand} />
          </Environment>
        </Suspense>
        <Suspense fallback={null}>
          <MacintoshRig content={content} compact={!desktop} reduced={reduced} shadows={desktop} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const supportsWebGL = (() => {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
})();
