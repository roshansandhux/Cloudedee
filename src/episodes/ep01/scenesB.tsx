// EP01 scenes 7–13
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage, type ActorSpec} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk, type Cam} from '../../stage/camera';
import {direct} from '../../stage/director';
import {Light, Darkness} from '../../fx/lighting';
import {DustPuff, Emote, Flash, ImpactStars, IrisWipe, MotionLines, SoundWord, Sparkles, SpeedLines, TitleCard, Vignette} from '../../fx/fx';
import {horde, zombieLook} from '../../rig/zombies';
import {FONT, INK} from '../../lib/theme';
import {StreetLamp} from '../../props/props';
import {
  BroomSpatula,
  CheesePuffs,
  CrumbBurst,
  DestroyedCity,
  DoughTendril,
  Flyer,
  Lab,
  LogMonitor,
  PizzaOven,
  PizzeriaExterior,
  PizzeriaInterior,
  RCCar,
  Remote,
  Rooftop,
  TheMother,
} from './kit';
import {bennyEndL, bennyL, bigZL, crumbL, miloL} from './looks';
import {lookOf} from '../../cast';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ═════════════ 7. ROOFTOP AT GOLDEN HOUR ═════════════
export const S07: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const flyerT = interpolate(f, [s.cue('flyer'), s.cue('flyer') + 22], [0, 1], clamp);
  const flyerOnFace = f >= s.cue('flyer') + 22 && f < s.at('m22');
  const pos = {dex: {x: 1080, y: 880}, benny: {x: 760, y: 885, look: bennyL(true, 1, true)}, milo: {x: 1380, y: 880, look: miloL(true)}};
  const streetInsert = (f >= s.beat('look').start && f < s.at('d25') + 20) || (s.activeLine('benny')?.id === 'b27' && f > s.at('b27') + 30);
  if (streetInsert) {
    // high-angle insert: the whole horde marching the same way at sunset
    const cam = drift({x: 1100, y: 640, zoom: 0.8}, f, 2);
    return (
      <Stage
        cam={cam}
        set={<DestroyedCity frame={f} time="sunset" seed="roofview" />}
        actors={[...horde(f, {n: 22, seed: 'mh', x0: -200, x1: 3000, y0: 920, y1: 1100, speed: 1.4, spread: 2600, facing: 1})]}
        overlay={
          <>
            <Light kind="warm" strength={1.2} />
            <Vignette amount={0.4} />
          </>
        }
      />
    );
  }
  let cam = direct(s, {
    wide: drift({x: 1060, y: 560, zoom: 1.0}, f),
    pos,
    pattern: ['close', 'close', 'medium', 'push', 'medium', 'close', 'push', 'medium', 'close', 'low'],
    shots: {m21: 'close', d26: 'punch', m22: 'push', b29: 'close', d28: 'low', b30: 'punch'},
  });
  if (f >= s.cue('flyer') && f < s.at('m22')) cam = {x: 1080, y: 440, zoom: 2.2};
  const flyerX = interpolate(flyerT, [0, 1], [2300, 1110]);
  const flyerY = interpolate(flyerT, [0, 0.5, 1], [200, 520, 470]);
  const actors: ActorSpec[] = [
    {who: 'dex', ...pos.dex, facing: -1, holding: <BroomSpatula />, pose: s.after('d25') && !s.after('b27') ? ['down', 'point'] : ['down', 'hold'], mood: s.after('d27') ? 'surprised' : 'confused', look2: {x: 0.6, y: 0.2}},
    {who: 'benny', ...pos.benny, look: bennyL(true, 1, true), facing: 1, holding: <CheesePuffs s={0.55} />, pose: s.after('b27') && !s.after('m21') ? ['down', 'think'] : ['down', 'hold'], mood: 'happy'},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: -1, holding: s.after('m22') ? <Flyer /> : undefined, pose: s.after('m22') ? ['down', 'hold'] : 'down', mood: s.after('m24') ? 'determined' : 'worried'},
  ];
  return (
    <Stage
      cam={cam}
      rim="#ff9a5a"
      set={<Rooftop frame={f} />}
      actors={actors}
      front={
        <>
          {f >= s.cue('flyer') && f < s.at('m22') && <g transform={`translate(${flyerX} ${flyerY}) rotate(${(1 - flyerT) * 360 + (flyerOnFace ? -6 : 0)}) scale(1.8)`}><Flyer /></g>}
          {s.after('b30') && <Sparkles x={760} y={400} t={f - s.at('b30')} />}
        </>
      }
      overlay={<Light kind="warm" strength={1.3} />}
    />
  );
};

// ═════════════ 8. NIGHT STREETS – blending in with the horde ═════════════
export const S08: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const sniff = s.beat('sniff');
  const leaves = s.beat('leaves');
  const stopped = f >= sniff.start && f < leaves.end;
  // the trio shuffles right with the horde; pauses during the sniff
  const pace = 0.9;
  const t = f < sniff.start ? f : f < leaves.end ? sniff.start : f - (leaves.end - sniff.start);
  const baseX = 200 + t * pace;
  const signScene = s.after('sign');
  const xs = {benny: baseX + 260, dex: baseX, milo: baseX - 220};
  const bigX = interpolate(f, [sniff.start - 30, sniff.start, leaves.start, leaves.end], [xs.dex + 700, xs.dex + 170, xs.dex + 170, xs.dex + 900], clamp);
  const pos = {benny: {x: xs.benny, y: 905, look: bennyL(true, 1, true)}, dex: {x: xs.dex, y: 900}, milo: {x: xs.milo, y: 905, look: miloL(true)}};
  let cam = direct(s, {
    wide: {x: baseX + 120, y: 560, zoom: 1.0},
    pos,
    pattern: ['medium', 'close', 'close', 'push', 'close', 'medium', 'close', 'close', 'wide'],
    shots: {m25: 'close', d29: 'close', m26: 'punch', b32: 'medium', d30: 'close', b33: 'push'},
  });
  if (f < s.at('b31')) cam = camKeys(f, [{f: 0, cam: {x: 400, y: 360, zoom: 0.9}}, {f: s.at('b31'), cam: {x: baseX + 120, y: 560, zoom: 1.1}}]);
  if (f >= sniff.start && f < s.at('b32')) cam = {x: xs.dex + 90, y: 420, zoom: 1.9};
  if (signScene) cam = camKeys(f, [{f: s.cue('sign'), cam: {x: baseX + 300, y: 520, zoom: 1.0}}, {f: s.cue('sign') + 50, cam: {x: 2700, y: 420, zoom: 1.0}}, {f: s.at('m27') + 40, cam: {x: 2500, y: 480, zoom: 1.0}}]);
  if (s.after('m27') && f > s.at('m27') + 40) cam = direct(s, {wide: {x: 2400, y: 520, zoom: 1.0}, pos, shots: {d31: 'close', m27: 'medium'}});
  const zs = horde(f, {n: 14, seed: 'nz', x0: 600, x1: 3000, y0: 850, y1: 895, speed: pace, spread: 2600, facing: 1});
  zs.forEach((z, i) => {
    // a few shamble in the foreground, but never right in front of our heroes
    if (i % 4 === 0 && Math.abs(z.x - (baseX + 100)) > 650) {
      z.y = 1000;
      z.scale = 1.1;
    }
  });
  const zombieWalk = (who: 'dex' | 'milo' | 'benny', extra: Partial<ActorSpec> = {}): ActorSpec => ({
    who,
    x: xs[who],
    y: pos[who].y,
    look: who === 'milo' ? miloL(true) : who === 'benny' ? bennyL(true, 1, true) : undefined,
    walking: !stopped,
    walkPhase: xs[who] / 14,
    pose: 'reach',
    lean: 6,
    facing: 1,
    mood: 'worried',
    ...extra,
  });
  const actors: ActorSpec[] = [
    ...zs,
    zombieWalk('milo', {lean: 0, mood: 'scared', look2: {x: -0.4, y: 0}, squash: 1.04}), // stiff robot zombie
    zombieWalk('dex', {holding: <BroomSpatula />, pose: ['reach', 'hold'], mood: f >= sniff.start && f < leaves.start ? 'scared' : 'worried'}),
    zombieWalk('benny', {holding: <CheesePuffs s={0.5} />, pose: ['reach', 'hold'], mood: 'happy'}),
    {who: 'bigz', x: bigX, y: 910, look: bigZL(), facing: f < leaves.start ? -1 : 1, walking: f < sniff.start || f > leaves.start, walkPhase: bigX / 12, pose: 'reach', lean: f >= sniff.start && f < leaves.start ? -18 + Math.sin(f / 3) * 4 : 0, mouth: 0.3},
  ];
  const lamps = [400, 1300, 2200];
  return (
    <Stage
      cam={cam}
      rim="#9fb4ff"
      set={<DestroyedCity frame={f} time="night" seed="night" />}
      actors={actors}
      front={
        <>
          <Darkness id="nd" lights={[...lamps.map((x) => ({x, y: 420, r: 520, color: '#ffe9a0'})), {x: 2700, y: 400, r: 700, color: '#6aff9a'}]} opacity={0.62} />
          {f >= sniff.start && f < leaves.start && <Emote x={bigX - 60} y={330} t={f - sniff.start} kind="?" dur={leaves.start - sniff.start} />}
        </>
      }
      overlay={<Light kind="night" />}
    >
      {lamps.map((x) => (
        <StreetLamp key={x} x={x} y={880} on />
      ))}
      <PizzeriaExterior frame={f} x={2700} />
    </Stage>
  );
};

// ═════════════ 9. MAMA MOZZA'S – the secret door ═════════════
export const S09: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const wall = s.progress('wallOpens');
  const desc = s.beat('descend');
  const lean = s.beat('lean');
  const dexLeanX = interpolate(f, [lean.start, lean.end], [1000, 1160], clamp);
  const go = (x0: number, d: number) => walk(f, desc.start + d, desc.end, x0, 1500);
  const wd = go(dexLeanX, 0);
  const wb = go(760, 6);
  const wm = go(580, 12);
  const fade = interpolate(f, [desc.start + 20, desc.end], [1, 0], clamp);
  const pos = {benny: {x: wb.x, y: 905, look: bennyL(true, 1, true)}, milo: {x: wm.x, y: 900, look: miloL(true)}, dex: {x: wd.x, y: 900}};
  let cam = direct(s, {
    wide: {x: 1000, y: 560, zoom: 1.0},
    pos,
    pattern: ['push', 'close', 'punch', 'push'],
    shots: {d32: {x: 1300, y: 470, zoom: 1.4}},
  });
  if (f >= lean.start && f < s.at('d32')) cam = {x: 1300, y: 480, zoom: 1.35};
  if (f >= desc.start) cam = {x: 1400, y: 560, zoom: 1.2};
  const actors: ActorSpec[] = [
    {who: 'benny', ...pos.benny, look: bennyL(true, 1, true), facing: 1, walking: wb.walking, walkPhase: wb.walkPhase, holding: <CheesePuffs s={0.5} />, pose: ['down', 'hold'], mood: s.after('b35') ? 'happy' : 'happy', eyesClosed: s.activeLine('benny')?.id === 'b34', opacity: wb.x > 1380 ? fade : 1},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: 1, walking: wm.walking, walkPhase: wm.walkPhase, mood: 'worried', opacity: wm.x > 1380 ? fade : 1},
    {who: 'dex', ...pos.dex, facing: 1, holding: <BroomSpatula />, pose: ['down', 'hold'], lean: f >= lean.start && f < desc.start ? -14 : 0, walking: wd.walking, walkPhase: wd.walkPhase, mood: s.after('wallOpens') ? 'smug' : 'neutral', look2: s.after('d32') ? {x: -0.2, y: 0} : undefined, opacity: wd.x > 1380 ? fade : 1},
  ];
  return (
    <Stage
      cam={cam}
      rim="#7dffaa"
      set={<PizzeriaInterior frame={f} wall={wall} />}
      actors={actors}
      front={<Darkness id="pz" lights={[{x: 1480, y: 600, r: 300 + wall * 600, color: '#6aff9a'}, {x: 700, y: 400, r: 500}]} opacity={0.65} />}
      overlay={
        <>
          <Light kind="night" strength={0.7} />
          {s.after('lever') && <SoundWord text="CLICK" t={f - s.cue('lever')} x={1100} y={320} color="#7dffaa" size={90} />}
        </>
      }
    >
      <PizzaOven x={-300} heat={0.1} frame={f} />
    </Stage>
  );
};

// ═════════════ 10. THE SECRET LAB – Dr. Crumb's video log ═════════════
export const S10: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const on = s.after('play') ? interpolate(f, [s.cue('play'), s.cue('play') + 8], [0, 1], clamp) : 0;
  const logEnd = s.cue('logEnd');
  const zombie = interpolate(f, [s.at('c05') + 40, s.line('c05').end], [0, 1], clamp);
  const staticAmt = f >= logEnd ? interpolate(f, [logEnd, logEnd + 6], [0, 1], clamp) : 0;
  const day = s.after('c05') ? 'DAY 13' : s.after('c04') ? 'DAY 12' : s.after('c03') ? 'DAY 9' : 'DAY 1';
  const entry = walk(f, 0, 70, -200, 600);
  const pos = {dex: {x: entry.x + 200, y: 900}, benny: {x: entry.x - 40, y: 905, look: bennyL(true, 1, true)}, milo: {x: entry.x + 420, y: 900, look: miloL(true)}, crumb: {x: 1500, y: 560}};
  let cam = direct(s, {
    wide: {x: 1000, y: 560, zoom: 1.0},
    pos,
    pattern: ['push', 'close'],
    shots: {
      c01: {x: 1500, y: 560, zoom: 1.6},
      c02: {x: 1500, y: 600, zoom: 1.9},
      c03: {x: 1480, y: 560, zoom: 1.6},
      c04: {x: 1500, y: 580, zoom: 2.1},
      c05: {x: 1500, y: 560, zoom: 2.4},
      b36: 'punch',
    },
  });
  if (f < s.at('m29')) cam = camKeys(f, [{f: 0, cam: {x: 1300, y: 300, zoom: 0.8}}, {f: s.at('m29'), cam: {x: 900, y: 560, zoom: 1.1}}]);
  const watching = s.after('play');
  const actors: ActorSpec[] = [
    {who: 'dex', ...pos.dex, facing: 1, walking: entry.walking, walkPhase: entry.walkPhase, holding: <BroomSpatula />, pose: ['down', 'hold'], mood: watching ? 'confused' : 'smug'},
    {who: 'benny', ...pos.benny, look: bennyL(true, 1, true), facing: 1, walking: entry.walking, walkPhase: entry.walkPhase + 2, holding: <CheesePuffs s={0.5} />, pose: ['down', 'hold'], mood: s.after('b36') ? 'surprised' : 'happy'},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: 1, walking: entry.walking, walkPhase: entry.walkPhase + 1, mood: s.after('m29') && !s.after('d33') ? 'happy' : 'worried', pose: s.after('m29') && !s.after('d33') ? 'up' : s.after('play') && !s.after('c01') ? ['down', 'point'] : 'down'},
  ];
  return (
    <Stage
      cam={cam}
      rim="#7dffaa"
      speakers={{crumb: {x: 1500, y: 360}}}
      set={<Lab frame={f} />}
      actors={actors}
      front={<>{s.after('c05') && f > s.at('c05') + 60 && <Emote x={760} y={330} t={f - s.at('c05') - 60} kind="!" dur={40} />}</>}
      overlay={<Light kind="lab" />}
    >
      {/* the dormant Mother's vat, far right, barely visible */}
      <TheMother x={2600} y={870} frame={f} rise={0} s={0.7} />
      <LogMonitor x={1500} y={560} frame={f} on={on} zombie={zombie} talk={s.mouth('crumb')} day={day} staticAmt={staticAmt} />
    </Stage>
  );
};

// ═════════════ 11. THE MOTHER – boss battle ═════════════
export const S11: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const rise = s.progress('rising');
  const angry = s.after('free') ? 1 : 0;
  const hordeIn = s.after('horde');
  const pulled = s.beat('pulled');
  const free = s.after('free');
  const bennyPull = free ? interpolate(f, [s.cue('free'), s.cue('free') + 10], [1080, 760], clamp) : interpolate(f, [pulled.start, s.at('b38') + 40], [760, 1080], clamp);
  const rollT = interpolate(f, [s.cue('roll'), s.cue('roll') + 22], [0, 1], clamp);
  const slam = hop(f, s.cue('slam'), 18, 180);
  const kite = s.beat('kite');
  const rcAngle = (f - s.cue('rc')) / 14;
  const rcX = s.after('rc') ? 560 + Math.cos(rcAngle) * 520 : -400;
  const rcY = s.after('rc') ? 1010 + Math.sin(rcAngle) * 70 : 1000;
  const smashed = s.after('smash');
  const flee = s.beat('flee');
  const fleeT = interpolate(f, [flee.start, flee.end], [0, 1], clamp);
  const motherSpeaks = !!s.activeLine('mother');
  const xs = {dex: 480 - fleeT * 900 + (rollT > 0 && rollT < 1 ? Math.sin(rollT * Math.PI) * 160 : 0), milo: 300 - fleeT * 900, benny: bennyPull - fleeT * 1200};
  const pos = {dex: {x: xs.dex, y: 900}, milo: {x: xs.milo, y: 905, look: miloL(true)}, benny: {x: xs.benny, y: 910, look: bennyL(true, 1, true)}};
  // zombies stream in from the left once the Mother calls them
  let zs: ActorSpec[] = [];
  if (hordeIn) {
    zs = horde(f, {n: 10, seed: 'lz', x0: -600, x1: 900, y0: 870, y1: 960, speed: 2.2, spread: 400, start: s.cue('horde'), facing: 1, scale: 0.92});
    zs.forEach((z, i) => {
      z.x = Math.min(z.x, 120 + (i % 5) * 120);
      if (s.after('rc') && f < flee.start) {
        // kiting: they chase the RC car in a circle
        const a = rcAngle - 0.5 - i * 0.18;
        z.x = 560 + Math.cos(a) * (520 - (i % 3) * 30);
        z.y = 1010 + Math.sin(a) * 70;
        z.facing = -Math.sin(a) > 0 ? 1 : -1;
        z.walkPhase = f / 2.5 + i;
      }
      if (s.after('slam') && !s.after('rc') && i < 4) {
        z.lean = interpolate(f, [s.cue('slam') + 16, s.cue('slam') + 26], [0, 80], clamp) * (i % 2 ? 1 : -1);
      }
      if (s.after('roll') && !s.after('slam') && i === 7) z.lean = 30;
    });
  }
  const motherSpeaker = {x: 1400, y: 870 - 360 - rise * 300 - 220};
  let cam: Cam = direct(s, {
    wide: {x: 1000, y: 460, zoom: 0.9},
    pos,
    pattern: ['close', 'medium', 'close', 'punch'],
    shots: {
      x01: {x: 1300, y: 300, zoom: 1.0, rot: 2},
      m30: 'close',
      x02: {x: 1350, y: 260, zoom: 1.25},
      d34: 'push',
      x03: {x: 1250, y: 300, zoom: 1.1},
      b37: {x: 900, y: 520, zoom: 1.3},
      d35: 'close',
      b38: 'punch',
      x04: {x: 1300, y: 240, zoom: 1.5, rot: -3},
      m31: 'close',
      d36: 'low',
      m32: 'close',
      d37: 'punch',
      b39: {x: 400, y: 460, zoom: 1.2},
      m33: 'push',
      x05: {x: 1300, y: 280, zoom: 1.9},
      d38: 'medium',
    },
  });
  if (f < s.at('x01')) cam = camKeys(f, [{f: 0, cam: {x: 800, y: 560, zoom: 1.1}}, {f: s.beat('rising').end, cam: {x: 1150, y: 300, zoom: 0.85, rot: -2}, ease: Easing.inOut(Easing.cubic)}]);
  if (f >= kite.start && f < kite.end) cam = {x: 560, y: 600, zoom: 1.0};
  cam = shake(cam, f, s.cue('rise'), 90, 8);
  cam = shake(cam, f, s.cue('smash'), 24, 30);
  cam = shake(cam, f, s.cue('free'), 14, 14);
  const actors: ActorSpec[] = [
    ...zs,
    {who: 'milo', ...pos.milo, look: miloL(true), facing: f >= flee.start ? -1 : 1, walking: f >= flee.start, run: true, walkPhase: f / 2.5, holding: s.after('m33') ? <Remote /> : undefined, pose: s.after('m33') ? ['down', 'hold'] : s.after('m31') && !s.after('d36') ? ['down', 'point'] : 'down', mood: s.after('m33') && !smashed ? 'happy' : 'scared'},
    {
      who: 'dex',
      ...pos.dex,
      facing: f >= flee.start ? -1 : 1,
      walking: f >= flee.start,
      run: true,
      walkPhase: f / 2.5,
      holding: <BroomSpatula />,
      pose: s.after('d36') && !s.after('m33') ? ['down', 'up'] : ['down', 'hold'],
      lean: rollT > 0 && rollT < 1 ? rollT * 360 : 0,
      squash: rollT > 0 && rollT < 1 ? 0.6 : 1,
      mood: s.after('d34') && !s.after('x03') ? 'worried' : 'determined',
    },
    {
      who: 'benny',
      ...pos.benny,
      y: 910 + slam.dy,
      squash: slam.squash,
      look: {...bennyL(true, 1, true), zombie: f >= pulled.start && !free},
      facing: f >= flee.start ? -1 : 1,
      walking: (f >= pulled.start && !free) || f >= flee.start,
      run: f >= flee.start,
      walkPhase: f >= flee.start ? f / 2.5 : bennyPull / 30,
      pose: f >= pulled.start && !free ? 'reach' : s.after('b39') && !s.after('m33') ? 'up' : ['down', 'hold'],
      holding: !(f >= pulled.start && !free) ? <CheesePuffs s={0.5} /> : undefined,
      lean: f >= pulled.start && !free ? Math.sin(f / 2) * 4 : 0,
      mood: free ? 'determined' : 'scared',
    },
  ];
  return (
    <Stage
      cam={cam}
      rim="#7dffaa"
      speakers={{mother: motherSpeaker}}
      set={<Lab frame={f} alarm={hordeIn ? 1 : 0} />}
      actors={actors}
      front={
        <>
          {s.after('rc') && f < flee.start && <RCCar x={rcX} y={rcY} frame={f} flip={-Math.sin(rcAngle) < 0} />}
          <ImpactStars x={420} y={880} t={f - s.cue('slam') - 16} s={1.4} />
          <DustPuff x={420} y={910} t={f - s.cue('slam') - 16} n={8} />
          {s.after('roll') && <ImpactStars x={1100} y={650} t={f - s.cue('roll') - 18} color="#9aff8a" />}
          {f >= flee.start && <MotionLines x={xs.dex} y={700} dir={-1} frame={f} />}
          {smashed && <DustPuff x={900} y={900} t={f - s.cue('smash')} n={10} />}
        </>
      }
      overlay={
        <>
          <Light kind="lab" />
          {s.after('free') && <SoundWord text="NACHOS!!" t={f - s.cue('free')} x={760} y={240} color="#f6c945" />}
          {s.after('slam') && <SoundWord text="FWUMP!" t={f - s.cue('slam') - 16} x={500} y={320} color="#ff8fb1" />}
          {smashed && <Flash t={f - s.cue('smash')} dur={10} />}
          {smashed && <SoundWord text="KRAKOOM!" t={f - s.cue('smash')} x={1100} y={380} color="#e8553e" size={140} />}
          {f >= s.cue('free') - 4 && f < s.cue('free') + 20 && <SpeedLines frame={f} opacity={0.5} />}
        </>
      }
    >
      <TheMother x={1400} y={870} frame={f} rise={rise} talk={motherSpeaks ? s.mouth('mother') : 0} angry={angry} s={0.95} />
      {smashed && <DoughTendril x={950} y={900} frame={f} grow={interpolate(f, [s.cue('smash') - 8, s.cue('smash')], [0, 1], clamp)} bake={0} />}
    </Stage>
  );
};

// ═════════════ 12. CLIMAX – the pizza oven ═════════════
export const S12: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const heatB = s.beat('heat');
  const blast = s.cue('blast');
  const baked = s.cue('baked');
  const dial = interpolate(f, [s.cue('press') - 6, s.cue('press') + 6], [0, 1], clamp);
  const heat = f < heatB.start ? 0.15 : interpolate(f, [heatB.start, blast], [0.3, 1], clamp);
  const bake = interpolate(f, [blast, baked], [0, 1], clamp);
  const grow = interpolate(f, [0, 60], [0.4, 1], clamp);
  const inLab = f >= blast && f < baked + 10; // cutaway: fire pours into the proofing chamber
  const crumbsT = f - baked;
  const crumbled = f > baked + 20;
  if (inLab) {
    const cam = shake({x: 1400, y: 260, zoom: 0.95}, f, blast, baked + 10 - blast, 10);
    return (
      <Stage
        cam={cam}
        speakers={{mother: {x: 1400, y: 120}}}
        set={<Lab frame={f} alarm={1} />}
        front={
          <>
            {/* fire pouring from the vent */}
            <g>
              <rect x={1300} y={-600} width={200} height={300} fill="#3a3a3a" stroke={INK} strokeWidth={6} />
              {Array.from({length: 8}).map((_, i) => {
                const t = (f * 9 + i * 40) % 400;
                return <circle key={i} cx={1400 + Math.sin(i + f / 4) * 60} cy={-300 + t} r={70 - t * 0.08} fill={['#ff6a2a', '#ff9a3a', '#ffd25a'][i % 3]} opacity={0.85} />;
              })}
            </g>
          </>
        }
        overlay={
          <>
            <Light kind="lab" strength={1 - bake} />
            <div style={{position: 'absolute', inset: 0, background: `rgba(255,140,40,${0.35 * bake})`, mixBlendMode: 'screen'}} />
            <SoundWord text="FWOOOSH!" t={f - blast} x={600} y={300} color="#ff9a3a" size={130} />
          </>
        }
      >
        <TheMother x={1400} y={870} frame={f} rise={1} bake={bake} talk={s.mouth('mother')} angry={1} s={0.95} />
      </Stage>
    );
  }
  const pos = {dex: {x: 1460, y: 900}, milo: {x: 1690, y: 905, look: miloL(true)}, benny: {x: 1000, y: 910, look: bennyL(true, 1, true)}};
  let cam = direct(s, {
    wide: {x: 1150, y: 500, zoom: 0.95},
    pos,
    pattern: ['close', 'close', 'push', 'punch', 'close', 'push', 'close', 'medium'],
    shots: {
      d40: 'punch',
      b42: {x: 760, y: 560, zoom: 1.9},
      m35: 'close',
      b43: 'close',
      b44: 'push',
      m36: 'close',
      d41: 'medium',
      b45: 'close',
    },
  });
  if (f < s.at('d39')) cam = camKeys(f, [{f: 0, cam: {x: 1150, y: 300, zoom: 0.8}}, {f: s.at('d39'), cam: {x: 1250, y: 520, zoom: 1.0}}]);
  if (f >= s.cue('press') && f < blast) cam = camKeys(f, [{f: s.cue('press'), cam: {x: 740, y: 640, zoom: 2.4}}, {f: blast, cam: {x: 800, y: 500, zoom: 1.2}, ease: Easing.in(Easing.cubic)}]);
  cam = shake(cam, f, 0, 60, 6);
  cam = shake(cam, f, baked + 10, 30, 26);
  const crumbCover = f > baked + 10;
  const actors: ActorSpec[] = [
    {who: 'dex', ...pos.dex, facing: -1, holding: <BroomSpatula />, pose: s.after('d40') && !s.after('b41') ? ['down', 'shrug'] : ['down', 'hold'], mood: crumbled ? 'happy' : 'scared', squash: f > baked + 10 && f < baked + 24 ? 0.85 : 1},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: -1, pose: s.after('m35') && !s.after('b43') ? ['down', 'point'] : s.after('m34') && !s.after('b40') ? 'up' : 'down', mood: crumbled ? 'surprised' : 'scared'},
    {
      who: 'benny',
      ...pos.benny,
      look: bennyL(true, 1, true),
      facing: -1,
      holding: s.after('pizza') ? (
        <g stroke={INK} strokeWidth={3}>
          <circle r={46} fill="#f6c945" />
          <circle r={38} fill="#e8553e" />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={Math.cos(k * 1.3) * 22} cy={Math.sin(k * 1.3) * 22} r={7} fill="#a02a1a" strokeWidth={2} />
          ))}
        </g>
      ) : undefined,
      pose: s.after('pizza') ? ['down', 'hold'] : f >= s.at('b42') && f < s.cue('press') + 20 ? ['down', 'reach'] : 'down',
      mood: s.after('b40') && !s.after('press') ? 'determined' : crumbled ? 'worried' : 'happy',
    },
  ];
  return (
    <Stage
      cam={cam}
      rim="#ffb36b"
      set={<PizzeriaInterior frame={f} crack={1} crater={crumbled} />}
      actors={actors}
      front={
        <>
          <DoughTendril x={300} y={910} frame={f} grow={crumbled ? 0 : grow} bake={f > baked ? 1 : 0} />
          <DoughTendril x={2050} y={920} frame={f + 40} grow={crumbled ? 0 : grow * 0.9} bake={f > baked ? 1 : 0} flip />
          <CrumbBurst t={crumbsT - 10} x={1100} y={600} />
          {crumbCover && f < baked + 80 && <ImpactStars x={1000} y={500} t={f - baked - 10} s={2} color="#d9a35a" />}
          {s.after('pizza') && <Sparkles x={950} y={560} t={f - s.cue('pizza')} />}
          {crumbled && s.after('b44') && [0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={900 + k * 30} y={480 + (k % 2) * 30} width={16} height={12} rx={4} fill="#d9a35a" stroke={INK} strokeWidth={2} />)}
        </>
      }
      overlay={
        <>
          <Light kind="warm" strength={0.6 + heat * 0.6} />
          {f >= heatB.start && f < blast && <div style={{position: 'absolute', inset: 0, background: `rgba(255,120,30,${0.25 * heat})`, mixBlendMode: 'screen'}} />}
          {s.after('press') && f < blast && <SoundWord text="CLICK!" t={f - s.cue('press')} x={600} y={300} color="#e8553e" size={100} />}
          {f >= baked + 10 && <Flash t={f - baked - 10} dur={14} color="#fff6d8" />}
          {f >= baked + 10 && <SoundWord text="KA-BLAMM!" t={f - baked - 10} x={960} y={360} color="#d9a35a" size={150} />}
          {s.after('pizza') && <SoundWord text="DING!" t={f - s.cue('pizza')} x={760} y={260} color="#f6c945" size={90} />}
        </>
      }
    >
      <PizzaOven x={760} heat={heat} frame={f} dial={dial} destroyed={crumbled} />
    </Stage>
  );
};

// ═════════════ 13. SUNRISE – jobs, and one green ear ═════════════
export const S13: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const iris = s.progress('iris', null);
  const end = s.beat('endCard');
  const pos = {
    dex: {x: 1120, y: 900},
    milo: {x: 1330, y: 905, look: miloL(true)},
    benny: {x: 900, y: 910, look: bennyEndL()},
    crumb: {x: 1620, y: 900, look: crumbL()},
    anchor: {x: 420, y: 900},
  };
  let cam = direct(s, {
    wide: drift({x: 1050, y: 540, zoom: 1.0}, f),
    pos,
    pattern: ['close', 'close', 'medium', 'close', 'close', 'close', 'close', 'punch', 'push', 'close', 'close'],
    shots: {a03: {x: 420, y: 520, zoom: 1.7}, c06: 'medium', c07: 'close', d42: 'close', m37: 'close', b46: 'punch', c08: 'close', b47: 'punch', d43: 'push', m38: {x: 810, y: 600, zoom: 3.0}, b48: 'close'},
  });
  if (f < s.at('a03')) cam = camKeys(f, [{f: 0, cam: {x: 1400, y: 300, zoom: 0.8}}, {f: s.at('a03'), cam: {x: 900, y: 520, zoom: 1.05}}]);
  if (f >= s.beat('lookEachOther').start && f < s.at('d42')) cam = {x: 1100, y: 480, zoom: 1.5};
  if (s.after('n13')) cam = camKeys(f, [{f: s.at('n13'), cam: {x: 1050, y: 540, zoom: 1.0}}, {f: s.beat('iris').start, cam: {x: 806, y: 596, zoom: 2.8}}]);
  // former zombies, now normal people, waking up & stretching
  const townsfolk: ActorSpec[] = Array.from({length: 7}).map((_, i) => {
    const z = zombieLook(`town${i}`);
    return {
      who: `t${i}`,
      look: {...z, zombie: false, torn: false, skin: ['#f1c6a0', '#d99a6c', '#c98e65', '#ffe0c4', '#e8b48f', '#a86d48', '#f3d2bd'][i], blush: true},
      x: [-300, 1900, 2150, -60, 2400, 150, 2650][i],
      y: [960, 940, 1000, 1040, 960, 1080, 1020][i],
      facing: (i % 2 ? -1 : 1) as 1 | -1,
      pose: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'think' : 'shrug',
      mood: 'confused',
      scale: 0.85,
    };
  });
  const lookAround = f >= s.beat('lookEachOther').start && f < s.at('d42');
  const actors: ActorSpec[] = [
    ...townsfolk,
    {who: 'anchor', ...pos.anchor, facing: 1, holding: <g stroke={INK} strokeWidth={3}><rect x={-6} y={-60} width={12} height={60} fill="#2f2f3a" /><circle cy={-66} r={14} fill="#555" /></g>, pose: ['down', 'hold'], mood: 'confused', look: {...lookOf('anchor'), eyeBags: true}},
    {who: 'crumb', ...pos.crumb, facing: -1, pose: s.after('c07') ? ['down', 'shrug'] : 'down', mood: 'happy', look: {...crumbL(), eyeBags: true}},
    {who: 'dex', ...pos.dex, facing: lookAround ? (Math.floor(f / 15) % 2 ? 1 : -1) : 1, holding: <BroomSpatula />, pose: ['down', 'hold'], mood: s.after('d43') ? 'smug' : 'confused'},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: lookAround ? (Math.floor(f / 15) % 2 ? -1 : 1) : 1, pose: s.after('m38') ? ['down', 'point'] : 'down', mood: 'worried'},
    {who: 'benny', ...pos.benny, look: bennyEndL(), facing: 1, holding: <CheesePuffs s={0.5} />, pose: s.after('b47') && !s.after('d43') ? 'up' : ['down', 'hold'], mood: 'happy'},
  ];
  return (
    <Stage
      cam={cam}
      rim="#ffd0a0"
      set={<DestroyedCity frame={f} time="dawn" seed="dawn" />}
      actors={actors}
      front={
        <>
          {s.after('b47') && <Sparkles x={900} y={420} t={f - s.at('b47')} />}
          {s.after('m38') && <Emote x={800} y={360} t={f - s.at('m38')} kind="?" dur={60} />}
        </>
      }
      overlay={
        <>
          <Light kind="sunrise" />
          {iris > 0 && <IrisWipe t={iris} x="50%" y="50%" />}
          {f >= end.start && (
            <TitleCard t={f - end.start} dur={end.end - end.start} kicker="Thanks for watching!" title="NEXT TIME: The Night Shift" bg="#1a2e1f" />
          )}
        </>
      }
    >
      {/* the pizzeria, slightly exploded, with a HIRING sign */}
      <g>
        <PizzeriaExterior frame={f} x={1650} />
        <g transform="translate(1900 640) rotate(-6)" stroke={INK} strokeWidth={4}>
          <rect x={-90} y={-40} width={180} height={70} fill="#fff6e6" />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#c0392b" stroke="none">
            HIRING!
          </text>
        </g>
      </g>
    </Stage>
  );
};
