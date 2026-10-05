import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useIntroStarted } from '../../lib/boot';
import { gsap } from '../../lib/gsap';
import { getSectionIds, scrollState } from '../../lib/section-tracker';
import { DESK_Y, MODEL, RIG } from './constants';
import { MacintoshModel, type MacintoshModelHandle } from './macintosh-model';
import { compactPoses, desktopPoses, frameFromRect, poseAt, type Frame, type ResolvedPose } from './poses';
import { ScreenRenderer, type ScreenContent } from './screen-renderer';

interface MacintoshRigProps {
  content: ScreenContent;
  compact: boolean;
  reduced: boolean;
  shadows: boolean;
  onReady: () => void;
}

const DAMPING = 4.2;

function damp(current: number, target: number, delta: number, lambda = DAMPING) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
}

/** The hero's reserved box for the Mac, in canvas pixels. */
function measureAnchor(canvas: HTMLCanvasElement, width: number, height: number): Frame | null {
  const anchor = document.querySelector<HTMLElement>('[data-mac-anchor]');
  if (!anchor) return null;
  const box = anchor.getBoundingClientRect();
  if (!box.height) return null;
  const origin = canvas.getBoundingClientRect();
  return frameFromRect({ left: box.left - origin.left, top: box.top - origin.top, width: box.width, height: box.height }, width, height);
}

export function MacintoshRig({ content, compact, reduced, shadows, onReady }: MacintoshRigProps) {
  const rig = useRef<THREE.Group>(null);
  const model = useRef<MacintoshModelHandle>(null);
  const screen = useMemo(() => new ScreenRenderer((char) => model.current?.type(char)), []);
  const power = useMemo(() => ({ value: 0 }), []);
  const explode = useMemo(() => ({ value: 0 }), []);
  const xray = useMemo(() => ({ value: 0 }), []);
  const entrance = useMemo(() => ({ value: 0 }), []);
  const target = useMemo(() => ({}) as ResolvedPose, []);
  const current = useRef<ResolvedPose | null>(null);
  const ready = useRef(false);
  const shownOpacity = useRef(1);
  const introStarted = useIntroStarted();

  useEffect(() => () => screen.dispose(), [screen]);

  useEffect(() => {
    document.fonts.load('12px "Geist Pixel"').then(() => screen.invalidate());
  }, [screen]);

  useEffect(() => screen.show(content), [screen, content]);

  useEffect(() => {
    if (!introStarted) return undefined;
    const timeline = gsap.timeline()
      .to(entrance, { value: 1, duration: reduced ? 0.01 : 2.2, ease: 'expo.out' })
      .call(() => screen.boot(), [], reduced ? 0 : 0.7)
      .to(power, { value: 1, duration: reduced ? 0.01 : 1.2, ease: 'power2.inOut' }, '<');
    return () => { timeline.kill(); };
  }, [introStarted, reduced, entrance, power, screen]);

  useFrame((state, rawDelta) => {
    const group = rig.current;
    if (!group) return;
    const delta = Math.min(rawDelta, 1 / 20);

    const ids = getSectionIds();
    const poses = compact ? compactPoses : desktopPoses;
    const anchor = compact ? measureAnchor(state.gl.domElement, state.size.width, state.size.height) : null;
    if (reduced || !ids.length) poseAt(['top'], poses, 0, 0, target, anchor);
    else poseAt(ids, poses, scrollState.float, scrollState.hold, target, anchor);

    if (!current.current) current.current = { ...target };
    const pose = current.current;
    (Object.keys(target) as (keyof ResolvedPose)[]).forEach((key) => {
      pose[key] = reduced ? target[key] : damp(pose[key], target[key], delta);
    });

    const viewport = state.viewport.getCurrentViewport(state.camera, new THREE.Vector3(0, 0, 0));
    const scale = Math.min((pose.size * viewport.height) / RIG.height, (pose.maxWidth * viewport.width) / RIG.width);
    const enter = entrance.value;
    const time = state.clock.elapsedTime;
    const pointer = compact || reduced ? { x: 0, y: 0 } : state.pointer;
    const bob = compact ? 0 : Math.sin(time * 0.8) * 0.04 * scale;

    group.position.set(
      pose.x * viewport.width,
      pose.y * viewport.height + bob - (1 - enter) * viewport.height * 0.35,
      0,
    );
    group.rotation.set(
      pose.rx - pointer.y * 0.05,
      pose.ry + pointer.x * 0.12 - (1 - enter) * 1.4,
      pose.rz,
    );
    group.scale.setScalar(scale * (0.85 + enter * 0.15));

    xray.value = pose.xray;
    explode.value = pose.explode;
    const opacity = Math.round(pose.opacity * 100) / 100;
    if (opacity !== shownOpacity.current) {
      shownOpacity.current = opacity;
      state.gl.domElement.style.opacity = String(opacity);
    }
    screen.scroll(scrollState.progress, Math.abs(scrollState.velocity) > 0.35);
    screen.update(delta);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <group ref={rig}>
      <group position={[-RIG.center[0], -RIG.center[1], -RIG.center[2]]}>
        <group position={[0, DESK_Y, 0]} scale={MODEL.scale}>
          <MacintoshModel ref={model} screen={screen} power={power} explode={explode} xray={xray} />
        </group>
        {shadows && (
          <ContactShadows position={[RIG.center[0], DESK_Y - 0.01, RIG.center[2]]} scale={[18, 16]} resolution={512} blur={3} opacity={0.5} far={1.6} color="#000000" />
        )}
      </group>
    </group>
  );
}
