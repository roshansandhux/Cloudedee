// 10-SECOND 3D STYLE TEST – real 3D (three.js) with physically based lighting, built entirely in code.
// Reuses ep01 voice lines d08 / b07 / d09 (no new credits).
import React, {useLayoutEffect, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {ContactShadows} from '@react-three/drei';
import {EffectComposer, N8AO, Bloom, Vignette, SMAA, ToneMapping, HueSaturation, BrightnessContrast} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import * as THREE from 'three';
import {buildSchedule, say, wait, music, type VoiceManifest} from '../engine/timeline';
import {SceneProvider, useScene} from '../engine/SceneContext';
import {AudioTracks} from '../engine/EpisodePlayer';
import {Letterbox} from '../components/Letterbox';
import {layoutBubble, SpeechBubble} from '../components/SpeechBubble';
import {ensureFonts} from '../lib/fonts';
import voices from '../generated/voices/ep01.json';
import {Character3D, type Look3D} from './Character3D';
import {Apartment3D} from './Apartment3D';

ensureFonts();

export const TEST3D_STEPS = [music('orchestral', {vol: 0.3}), wait(0.5), say('d08', 'dex', '', {mood: 'smug'}), say('b07', 'benny', '', {mood: 'confused'}), say('d09', 'dex', '', {mood: 'determined'}), wait(0.6)];
const TEXT: Record<string, string> = {
  d08: 'Gentlemen. We have trained our whole lives for this moment.',
  b07: "We've trained our whole lives for sitting down.",
  d09: 'Exactly. And now... we stand up.',
};
export const test3dSchedule = () => {
  const s = buildSchedule(TEST3D_STEPS, voices as VoiceManifest);
  s.lines.forEach((l) => (l.text = TEXT[l.id]));
  return s;
};

const DEX: Look3D = {skin: '#f0c29c', hair: '#3a2418', hairStyle: 'swoop', top: '#2f6fc4', topStyle: 'hoodie', pants: '#33384a', shoes: '#ececec', iris: '#5a3a22', build: 'slim'};
const BENNY: Look3D = {skin: '#c98a5c', hair: '#1e130d', hairStyle: 'curly', top: '#f2c21a', topStyle: 'tee', pants: '#4f5f80', shoes: '#c94a3f', iris: '#3a2414', build: 'big'};
const MILO: Look3D = {skin: '#ffd9bd', hair: '#c4622a', hairStyle: 'tuft', top: '#4f9a60', topStyle: 'sweater', pants: '#6e5c48', shoes: '#5a3e2f', iris: '#3f7a4a', build: 'small', glasses: true, freckles: true};

// world positions of each head (for camera aim & bubble anchoring)
const POS = {
  dex: new THREE.Vector3(1.05, 0, -0.35),
  benny: new THREE.Vector3(-0.75, 0.15, -1.15),
  milo: new THREE.Vector3(0.15, 0.15, -1.15),
};
const HEAD = {dex: new THREE.Vector3(1.05, 1.62, -0.35), benny: new THREE.Vector3(-0.75, 1.25, -1.1), milo: new THREE.Vector3(0.15, 1.2, -1.1)};

type Shot = {pos: THREE.Vector3; target: THREE.Vector3; fov: number};
const lerpShot = (a: Shot, b: Shot, t: number): Shot => ({pos: a.pos.clone().lerp(b.pos, t), target: a.target.clone().lerp(b.target, t), fov: a.fov + (b.fov - a.fov) * t});
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function useShot(): Shot {
  const s = useScene();
  const f = s.frame;
  const d08 = s.line('d08');
  const b07 = s.line('b07');
  const d09 = s.line('d09');
  const ease = Easing.inOut(Easing.cubic);
  if (f < d08.start + 20) {
    // establishing: slow dolly in across the sunny, messy room
    const t = ease(interpolate(f, [0, d08.start + 20], [0, 1], {extrapolateRight: 'clamp'}));
    return lerpShot({pos: V(-0.6, 1.5, 4.6), target: V(0, 1.0, -1), fov: 40}, {pos: V(0.2, 1.45, 3.4), target: V(0.4, 1.1, -0.8), fov: 36}, t);
  }
  if (f < b07.start) {
    // slow push on Dex
    const t = ease(interpolate(f, [d08.start + 20, b07.start], [0, 1], {extrapolateRight: 'clamp'}));
    return lerpShot({pos: V(0.55, 1.55, 1.6), target: HEAD.dex.clone().add(V(0, -0.08, 0)), fov: 32}, {pos: V(0.62, 1.58, 1.05), target: HEAD.dex.clone().add(V(0, -0.05, 0)), fov: 30}, t);
  }
  if (f < d09.start) {
    // reverse: Benny on the couch, over the coffee table
    const t = interpolate(f, [b07.start, d09.start], [0, 1], {extrapolateRight: 'clamp'});
    return lerpShot({pos: V(-0.2, 1.15, 0.55), target: HEAD.benny.clone().add(V(0.12, -0.05, 0)), fov: 30}, {pos: V(-0.25, 1.15, 0.4), target: HEAD.benny.clone().add(V(0.12, -0.05, 0)), fov: 28}, t);
  }
  // heroic low angle on Dex, pulling back to reveal all three
  const t = ease(interpolate(f, [d09.start, s.duration], [0, 1], {extrapolateRight: 'clamp'}));
  return lerpShot({pos: V(0.75, 0.85, 1.0), target: HEAD.dex.clone().add(V(0, 0.05, 0)), fov: 34}, {pos: V(0.3, 1.0, 2.9), target: V(0.2, 1.1, -0.7), fov: 38}, t);
}

const CameraRig: React.FC<{shot: Shot}> = ({shot}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.copy(shot.pos);
    c.fov = shot.fov;
    c.lookAt(shot.target);
    c.updateProjectionMatrix();
  }, [camera, shot]);
  return null;
};

const Scene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const {width, height} = useVideoConfig();
  const shot = useShot();
  const dexTalking = !!s.activeLine('dex');
  const standUp = s.after('d09') ? interpolate(f, [s.line('d09').start + 40, s.line('d09').start + 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  // project head positions → screen for the speech bubbles (same camera maths as the 3D view)
  const bubble = useMemo(() => {
    const l = s.activeLine();
    if (!l) return null;
    const cam = new THREE.PerspectiveCamera(shot.fov, width / height, 0.05, 100);
    cam.position.copy(shot.pos);
    cam.lookAt(shot.target);
    cam.updateMatrixWorld();
    const h = HEAD[l.who as keyof typeof HEAD].clone().add(V(0, 0.2, 0)).project(cam);
    const head = h.z < 1 ? {x: ((h.x + 1) / 2) * width, y: ((1 - h.y) / 2) * height} : null;
    const layout = layoutBubble(l.text, head ? {x: Math.max(80, Math.min(width - 80, head.x)), y: Math.max(140, head.y)} : null, {x0: 40, y0: 58, x1: width - 40, y1: height - 160}, false, 1);
    return {l, layout};
  }, [s.activeLine()?.id, shot.pos.x, shot.pos.y, shot.pos.z, shot.fov]);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows="soft"
        gl={{antialias: false, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace}}
        camera={{fov: 36, near: 0.05, far: 60, position: [0, 1.5, 4]}}
      >
        <CameraRig shot={shot} />
        <color attach="background" args={['#1a1410']} />
        <fog attach="fog" args={['#3a2a1e', 6, 16]} />
        {/* warm afternoon sun through the window – key light with soft shadows */}
        <directionalLight
          position={[4.5, 5.5, -7]}
          intensity={5.5}
          color="#ffcf8f"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-radius={6}
        />
        {/* sky bounce + warm fill + cool rim */}
        <hemisphereLight args={['#ffe6c8', '#6b4a35', 0.9]} />
        <pointLight position={[1.5, 2.4, 2.5]} intensity={6} distance={9} color="#ffd2a6" />
        <directionalLight position={[-3, 3, 2]} intensity={0.7} color="#a8c4ff" />
        <spotLight position={[1.6, 2.2, -1.9]} angle={1.0} penumbra={1} intensity={8} distance={6} color="#ffc98a" target-position={[0.5, 0.5, 0]} />

        <EffectComposer multisampling={0}>
          <N8AO aoRadius={0.35} intensity={2.2} distanceFalloff={0.6} quality="medium" />
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.AGX} />
          <HueSaturation saturation={0.18} />
          <BrightnessContrast brightness={0.02} contrast={0.12} />
          <Vignette offset={0.25} darkness={0.5} />
          <SMAA />
        </EffectComposer>
        <Apartment3D frame={f} />
        <ContactShadows position={[0, 0.006, -0.4]} scale={8} blur={2.6} opacity={0.55} far={2} resolution={1024} />

        <group position={[POS.dex.x, 0, POS.dex.z]}>
          <Character3D
            look={DEX}
            seed="dex"
            frame={f}
            position={[0, 0, 0]}
            rotY={-0.55}
            pose="stand"
            talk={s.mouth('dex')}
            mood={(s.moodOf('dex') ?? 'smug') as any}
            gesture={dexTalking && !s.after('d09') ? 1 : 0}
            fist={s.after('d09') ? interpolate(f, [s.line('d09').start + 30, s.line('d09').start + 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0}
            headTurn={-0.15}
            lookX={-0.6}
          />
        </group>
        <Character3D look={BENNY} seed="benny" frame={f} position={[POS.benny.x, 0, POS.benny.z + 0.1 + (standUp > 0.5 ? 0.55 : 0)]} rotY={0.35} pose={standUp > 0.5 ? 'stand' : 'sit'} talk={s.mouth('benny')} mood={(s.moodOf('benny') ?? (s.after('d09') ? 'happy' : 'neutral')) as any} headTurn={0.35} lookX={0.7} gesture={s.activeLine('benny') ? 0.6 : 0} />
        <Character3D look={MILO} seed="milo" frame={f} position={[POS.milo.x, 0, POS.milo.z + 0.1 + (standUp > 0.5 ? 0.55 : 0)]} rotY={0.3} pose={standUp > 0.5 ? 'stand' : 'sit'} mood={s.after('d09') ? 'surprised' : 'worried'} headTurn={0.4} lookX={0.8} />
      </ThreeCanvas>
      {bubble && <SpeechBubble layout={bubble.layout} appear={Math.min(1, (f - bubble.l.start + 2) / 6) * Math.min(1, (bubble.l.end + 5 - f) / 5)} frame={f} />}
      <Letterbox size={34} />
    </AbsoluteFill>
  );
};

export const Test3D: React.FC = () => {
  const schedule = useMemo(test3dSchedule, []);
  return (
    <AbsoluteFill>
      <SceneProvider schedule={schedule}>
        <Scene />
      </SceneProvider>
      <AudioTracks schedule={schedule} />
    </AbsoluteFill>
  );
};

export const test3dDuration = () => test3dSchedule().duration;
