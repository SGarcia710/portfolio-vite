import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useIntroStarted } from '../../lib/boot';
import { gsap } from '../../lib/gsap';
import { getSectionIds, scrollState } from '../../lib/section-tracker';
import { DESK_Y, RIG } from './constants';
import { Keyboard, type KeyboardHandle } from './keyboard';
import { MacintoshCase } from './macintosh-case';
import { createMacMaterials } from './materials';
import { Mouse } from './mouse';
import { compactPoses, desktopPoses, dockBox, poseAt, type ResolvedPose } from './poses';
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

export function MacintoshRig({ content, compact, reduced, shadows, onReady }: MacintoshRigProps) {
  const rig = useRef<THREE.Group>(null);
  const keyboard = useRef<KeyboardHandle>(null);
  const materials = useMemo(createMacMaterials, []);
  const screen = useMemo(() => new ScreenRenderer((char) => keyboard.current?.type(char)), []);
  const power = useMemo(() => ({ value: 0 }), []);
  const explode = useMemo(() => ({ value: 0 }), []);
  const entrance = useMemo(() => ({ value: 0 }), []);
  const target = useMemo(() => ({}) as ResolvedPose, []);
  const current = useRef<ResolvedPose | null>(null);
  const ready = useRef(false);
  const introStarted = useIntroStarted();

  useEffect(() => () => {
    materials.dispose();
    screen.dispose();
  }, [materials, screen]);

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
    const dock = compact ? dockBox(state.size.width, state.size.height) : null;
    if (reduced || !ids.length) poseAt(['top'], poses, 0, 0, target);
    else poseAt(ids, poses, scrollState.float, scrollState.hold, target, dock);

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

    group.position.set(
      pose.x * viewport.width,
      pose.y * viewport.height + Math.sin(time * 0.8) * 0.04 * scale - (1 - enter) * viewport.height * 0.35,
      0,
    );
    group.rotation.set(
      pose.rx - pointer.y * 0.05,
      pose.ry + pointer.x * 0.12 - (1 - enter) * 1.4,
      pose.rz,
    );
    group.scale.setScalar(scale * (0.85 + enter * 0.15));

    materials.setBlueprint(pose.xray);
    explode.value = pose.explode;
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
        <MacintoshCase materials={materials} screen={screen.texture} power={power} />
        <Keyboard ref={keyboard} materials={materials} explode={explode} />
        <Mouse materials={materials} screen={screen} />
        {shadows && (
          <ContactShadows position={[0.3, DESK_Y - 0.01, 0.6]} scale={[16, 14]} resolution={512} blur={3} opacity={0.5} far={1.6} color="#000000" />
        )}
      </group>
    </group>
  );
}
