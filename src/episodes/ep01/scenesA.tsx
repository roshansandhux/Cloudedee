// EP01 scenes 1–6
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage, type ActorSpec} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk, type Cam} from '../../stage/camera';
import {direct} from '../../stage/director';
import {Light, Darkness} from '../../fx/lighting';
import {DustPuff, Emote, Flash, ImpactStars, MotionLines, SoundWord, Sparkles, SpeedLines, SweatDrop, TitleCard, Vignette} from '../../fx/fx';
import {horde, zombieLook} from '../../rig/zombies';
import {FONT, INK} from '../../lib/theme';
import {
  Apartment,
  BackRoom,
  Baguette,
  BroomSpatula,
  Can,
  Cart,
  CheesePuffs,
  Controller,
  Couch,
  Debris,
  DestroyedCity,
  Display,
  Fire,
  FlippedCar,
  Fridge,
  NewsBroadcast,
  PixelGame,
  PizzaBox,
  Register,
  StopSign,
  Supermarket,
  TV,
} from './kit';
import {bennyL, dexL, garyL, miloL} from './looks';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

// ═════════════ 1. COLD OPEN – 4 AM ═════════════
export const S01: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const over = s.after('gameOver');
  const title = s.beat('titleCard');
  const pos = {dex: {x: 560, y: 885}, benny: {x: 800, y: 885, look: bennyL()}, milo: {x: 1040, y: 885}};
  const intense = !over;
  let cam = direct(s, {
    wide: drift({x: 1000, y: 560, zoom: 1.05}, f),
    pos,
    pattern: ['close', 'close', 'medium', 'close', 'push', 'medium', 'close'],
    shots: {m02: 'medium', d03: 'push'},
  });
  // narrator intro: slow dolly across the three faces
  if (f < s.at('d01')) cam = camKeys(f, [{f: 0, cam: {x: 520, y: 520, zoom: 1.9}}, {f: s.at('d01') - 1, cam: {x: 1060, y: 520, zoom: 1.6}}]);
  if (f >= s.cue('gameOver') && f < s.at('m02')) cam = {x: 1620, y: 520, zoom: 2.2}; // TV close-up: GAME OVER
  const shakeOn = Math.floor(f / 4) % 2 ? 1 : -1;
  const actors: ActorSpec[] = [
    {who: 'dex', ...pos.dex, sitting: true, facing: 1, holding: <Controller />, pose: ['down', 'hold'], lean: intense ? 6 : -4, mood: over ? 'sleepy' : 'determined', look2: {x: 0.8, y: 0}},
    {who: 'benny', ...pos.benny, look: bennyL(), sitting: true, facing: 1, holding: <Controller color="#e8553e" />, pose: ['down', 'hold'], lean: intense ? shakeOn * 2 : 0, mood: over ? 'sad' : 'worried', mouth: s.activeLine('benny') ? 0 : 0.15 * Math.abs(Math.sin(f / 4))},
    {who: 'milo', ...pos.milo, sitting: true, facing: 1, holding: <Controller color="#5aa469" />, pose: ['down', 'hold'], mood: 'worried', look2: {x: 0.8, y: 0}},
  ];
  return (
    <Stage
      cam={cam}
      rim="#9fc4ff"
      set={<Apartment frame={f} night />}
      actors={actors}
      front={
        <>
          <PizzaBox x={420} y={985} rot={-8} open />
          <PizzaBox x={1180} y={990} rot={6} />
          <Can x={1250} y={980} down />
          <Can x={360} y={975} color="#4f9dde" />
          {over && <Emote x={800} y={300} t={f - s.cue('gameOver')} kind="..." dur={60} />}
        </>
      }
      overlay={
        <>
          <Light kind="tv" strength={0.8} />
          {f >= title.start && <TitleCard t={f - title.start} dur={title.end - title.start} kicker="Episode 1" title="NIGHT OF THE LIVING DOUGH" bg="#1a2e1f" />}
        </>
      }
    >
      <Couch x={800} y={905} color="#4a5f7a" />
      <TV x={1640}>
        <PixelGame frame={f} over={over} />
      </TV>
      {/* clock */}
      <g transform="translate(1120 140)" stroke={INK} strokeWidth={4}>
        <rect x={-110} y={-40} width={220} height={80} rx={10} fill="#1a1a22" />
        <text x={0} y={22} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={52} fill="#ff4a3a" stroke="none">
          04:00
        </text>
      </g>
    </Stage>
  );
};

// ═════════════ 2. THE NEXT AFTERNOON – the news & the window ═════════════
export const S02: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const awake = s.after('d04');
  const tvOn = s.after('tvOn');
  const staticAmt = s.after('static') ? interpolate(f, [s.cue('static'), s.cue('static') + 6], [0, 1], clamp) : 0;
  const zombieAmt = interpolate(f, [s.at('a02'), s.line('a02').end], [0, 1], clamp);
  const blinds = s.progress('blinds');
  const revealStart = s.cue('reveal');
  const revealEnd = s.at('b06');
  const inReveal = f >= revealStart && f < revealEnd;
  const fall = hop(f, s.cue('fall') - 14, 14, 60);
  const dexWalk = walk(f, s.beat('blinds').start - 20, s.beat('blinds').start + 20, 560, 1180);
  const panic = s.after('b06') && !s.after('d08');

  if (inReveal) {
    // ── POV through the window: the street is full of zombies ──
    const t = f - revealStart;
    const cam = camKeys(t, [
      {f: 0, cam: {x: 960, y: 500, zoom: 1.35}},
      {f: revealEnd - revealStart, cam: {x: 960, y: 560, zoom: 0.95}, ease: Easing.out(Easing.cubic)},
    ]);
    return (
      <Stage
        cam={cam}
        set={<DestroyedCity frame={f} seed="win" />}
        actors={horde(f, {n: 30, seed: 'wz', x0: 900, x1: 2400, y0: 880, y1: 1100, speed: 0.8, spread: 1800})}
        front={
          <>
            <FlippedCar x={1500} y={1000} frame={f} fire color="#e86a8f" />
            {/* window frame in front = POV */}
            <rect x={-2000} y={-2000} width={6000} height={1950} fill="#d9ae86" />
            <rect x={-2000} y={1150} width={6000} height={2000} fill="#d9ae86" />
            <rect x={-2000} y={-100} width={2140} height={2000} fill="#d9ae86" />
            <rect x={1780} y={-100} width={3000} height={2000} fill="#d9ae86" />
            <rect x={130} y={-60} width={1660} height={1220} fill="none" stroke="#fff3e0" strokeWidth={40} />
          </>
        }
        overlay={
          <>
            <Light kind="warm" />
            <Vignette amount={0.35} />
          </>
        }
      />
    );
  }

  const pos = {
    dex: {x: awake ? dexWalk.x : 560, y: 885},
    benny: {x: 820, y: 900, look: bennyL()},
    milo: {x: 1120, y: 890},
    anchor: {x: 1640, y: 560},
  };
  let cam = direct(s, {
    wide: {x: 960, y: 560, zoom: 1.0},
    pos,
    pattern: ['medium', 'close', 'close', 'medium', 'close', 'push', 'wide'],
    shots: {
      b03: 'close',
      d05: 'push',
      a01: {x: 1640, y: 560, zoom: 2.2},
      a02: {x: 1640, y: 530, zoom: 2.8},
      m05: 'close',
      b06: 'punch',
      m06: 'punch',
      d08: 'low',
      b07: 'close',
      d09: 'push',
    },
  });
  if (f < s.at('b03')) cam = camKeys(f, [{f: 0, cam: {x: 960, y: 560, zoom: 1.0}}, {f: s.at('b03'), cam: {x: 900, y: 600, zoom: 1.15}}]);
  if (f >= s.beat('blinds').start && f < revealStart) cam = {x: 1300, y: 520, zoom: 1.5};
  if (f >= revealEnd && f < revealEnd + 4) cam = shake(cam, f, revealEnd, 12, 18);
  const actors: ActorSpec[] = [
    {who: 'dex', ...pos.dex, sitting: !awake, eyesClosed: !s.after('n04') || f < s.at('d04') - 10, facing: awake && f > s.beat('blinds').start - 20 ? 1 : 1, walking: dexWalk.walking, walkPhase: dexWalk.walkPhase, mood: panic ? 'scared' : 'neutral', pose: s.after('blinds') && !s.after('b06') ? ['down', 'reach'] : 'down', lean: awake ? 0 : -12},
    {who: 'benny', ...pos.benny, look: bennyL(), sitting: true, eyesClosed: f < s.at('b03'), squash: fall.squash, y: 900 + fall.dy, mood: panic ? 'scared' : 'sleepy', pose: panic ? 'up' : 'down', facing: 1},
    {who: 'milo', ...pos.milo, sitting: true, eyesClosed: f < s.at('m03') - 8, facing: -1, holding: s.after('m03') && !s.after('tvOn') ? <g transform="rotate(10)"><rect x={-14} y={-52} width={34} height={60} rx={7} fill="#2f2f3a" stroke={INK} strokeWidth={3} /><rect x={-9} y={-46} width={24} height={44} fill="#bfe6ff" /></g> : undefined, pose: ['down', s.after('m03') && !s.after('tvOn') ? 'hold' : 'down'], mood: panic ? 'scared' : 'worried'},
  ];
  return (
    <Stage
      cam={cam}
      rim="#ffd08a"
      speakers={{anchor: {x: 1640, y: 400}}}
      set={<Apartment frame={f} blinds={blinds} />}
      actors={actors}
      front={
        <>
          <PizzaBox x={420} y={985} rot={-8} open />
          <Can x={1250} y={980} down />
          <DustPuff x={820} y={905} t={f - s.cue('fall')} />
          {!awake && f > s.at('n04') && <Emote x={600} y={480} t={(f - s.at('n04')) % 60} kind="zzz" dur={60} />}
          {s.after('m04') && !s.after('tvOn') && <SweatDrop x={1180} y={470} t={f - s.at('m04')} />}
          {panic && <Emote x={820} y={300} t={f - revealEnd} kind="!" dur={50} />}
        </>
      }
      overlay={
        <>
          <Light kind="warm" />
          {f >= revealEnd && <SoundWord text="AAAH!" t={f - revealEnd} x={1450} y={260} color="#e8553e" />}
        </>
      }
    >
      <Couch x={800} y={905} color="#4a5f7a" />
      <TV x={1640}>{tvOn ? <NewsBroadcast frame={f} zombie={zombieAmt} staticAmt={staticAmt} talk={s.mouth('anchor')} /> : <rect width={400} height={240} fill="#0c0f1e" />}</TV>
    </Stage>
  );
};

// ═════════════ 3. GEAR UP ═════════════
export const S03: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const open = interpolate(f, [s.cue('fridge'), s.cue('fridge') + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const miloGear = s.after('gearMilo');
  const bennyGear = s.after('gearBenny');
  const dexGear = s.after('gearDex');
  const pos = {benny: {x: 760, y: 900, look: bennyL(bennyGear)}, milo: {x: 1060, y: 895}, dex: {x: 1360, y: 890}};
  let cam = direct(s, {
    wide: {x: 1000, y: 560, zoom: 1.05},
    pos,
    pattern: ['close', 'medium', 'close', 'push', 'medium', 'close', 'close', 'medium'],
    shots: {b08: 'push', d12: 'close', b10: 'punch', m10: 'close', d14: 'close'},
  });
  if (f < s.at('b08')) cam = camKeys(f, [{f: 0, cam: {x: 520, y: 420, zoom: 1.9}}, {f: s.at('b08'), cam: {x: 600, y: 480, zoom: 1.6}}]);
  // hero montage: each gear reveal = low angle hero shot with speed lines
  const hero = (cue: string, who: keyof typeof pos) => {
    const t = f - s.cue(cue);
    return t >= 0 && t < 70 ? {x: pos[who].x, y: 520, zoom: 2.0 + t * 0.004, rot: -4} : null;
  };
  const heroCam = (dexGear ? hero('gearDex', 'dex') : null) ?? (bennyGear ? hero('gearBenny', 'benny') : null) ?? (miloGear ? hero('gearMilo', 'milo') : null);
  if (heroCam && !s.activeLine('milo') && !s.activeLine('dex')) cam = heroCam as Cam;
  if (heroCam) cam = heroCam as Cam;
  const inMontage = !!heroCam;
  const actors: ActorSpec[] = [
    {who: 'benny', ...pos.benny, look: bennyL(bennyGear), facing: -1, mood: 'sad', pose: s.after('b08') && !s.after('b09') ? 'shrug' : bennyGear ? 'fist' : 'down'},
    {who: 'milo', ...pos.milo, look: miloL(miloGear), facing: -1, mood: 'worried', pose: s.after('m07') && !s.after('d10') ? ['down', 'think'] : miloGear && !bennyGear ? 'up' : 'down'},
    {who: 'dex', ...pos.dex, facing: -1, pose: dexGear ? ['down', 'up'] : s.after('d11') ? ['down', 'point'] : 'hips', holding: dexGear ? <BroomSpatula glint={Math.max(0, 1 - Math.abs(f - s.cue('gearDex') - 20) / 15)} /> : undefined, mood: 'determined'},
  ];
  return (
    <Stage
      cam={cam}
      rim="#ffd08a"
      set={<Apartment frame={f} blinds={0.9} />}
      actors={actors}
      front={
        <>
          {miloGear && <Sparkles x={1060} y={430} t={f - s.cue('gearMilo')} />}
          {bennyGear && <Sparkles x={760} y={480} t={f - s.cue('gearBenny')} color="#ffb0b0" />}
          {dexGear && <Sparkles x={1420} y={220} t={f - s.cue('gearDex')} r={140} />}
        </>
      }
      overlay={
        <>
          {inMontage && <SpeedLines frame={f} opacity={0.35} />}
          <Light kind="warm" />
          {s.after('m08') && !s.after('d11') && (
            <div style={{position: 'absolute', right: 80, top: 110, width: 520, background: '#fff', border: `4px solid ${INK}`, borderRadius: 12, fontFamily: FONT, fontSize: 26, color: INK, transform: 'rotate(2deg)', boxShadow: '0 8px 20px rgba(0,0,0,.3)'}}>
              <div style={{background: '#5aa469', color: '#fff', padding: '8px 16px', fontWeight: 700}}>SURVIVAL.xlsx</div>
              {['A: Things that can kill us', 'B: Things that can kill us', 'C: Things that can kill us', 'D: Snacks (Benny)'].map((r, i) => (
                <div key={i} style={{padding: '6px 16px', borderTop: '2px solid #ddd'}}>
                  {r}
                </div>
              ))}
            </div>
          )}
        </>
      }
    >
      <Fridge x={420} frame={f} open={open} />
    </Stage>
  );
};

// ═════════════ 4. THE DESTROYED CITY + CHASE ═════════════
export const S04: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const sneak = s.beat('sneak');
  const chase = s.beat('chase1');
  const dash = s.beat('dash');
  const turned = s.after('honk');
  const running = s.after('d16');
  // trio path: sneak 150 → 820 (crouched), wait at car, then run 900 → 3000
  const runT = interpolate(f, [chase.start, dash.end], [0, 1], clamp);
  const baseX = !s.after('sneak') ? 150 : !running ? walk(f, sneak.start, sneak.end, 150, 820).x : 820 + runT * 2300;
  const crouch = !running;
  const sneakW = walk(f, sneak.start, sneak.end, 150, 820);
  const xs = {dex: baseX + 160, milo: baseX, benny: baseX - 170};
  const walkingNow = sneakW.walking || (running && f < dash.end);
  const phase = running ? (baseX - 820) / 12 : sneakW.walkPhase;
  // zombies: shuffle with their backs turned, then turn & chase
  const zs = horde(f, {n: 12, seed: 'cz', x0: 1900, x1: 2600, y0: 850, y1: 895, speed: 0.4, spread: 1100, facing: 1});
  zs.forEach((z, i) => {
    if (turned) {
      z.facing = -1;
      z.mood = 'angry';
    }
    if (running) {
      z.facing = 1;
      z.x = baseX - 500 - (i % 6) * 150 - Math.floor(i / 6) * 70;
      z.walkPhase = z.x / 10;
      z.y = 880 + (i % 3) * 40;
    }
  });
  const pos = {dex: {x: xs.dex, y: 900}, milo: {x: xs.milo, y: 905, look: miloL(true)}, benny: {x: xs.benny, y: 910, look: bennyL(true)}};
  let cam: Cam;
  if (f < s.at('m11')) {
    // establishing: wide destruction pan, high crane
    cam = camKeys(f, [
      {f: 0, cam: {x: 2400, y: 380, zoom: 0.85}},
      {f: s.at('m11'), cam: {x: 700, y: 560, zoom: 1.0}},
    ]);
  } else if (running) {
    cam = {x: Math.min(baseX + 120, 2950), y: 560, zoom: 1.05};
    cam = shake(cam, f, chase.start, 300, 4);
    const l = s.activeLine();
    if (l && l.who !== 'narrator' && l.id !== 'd16') cam = {...cam, zoom: 1.45, y: 500, x: (pos as any)[l.who].x + 80};
  } else {
    cam = direct(s, {wide: {x: 800, y: 560, zoom: 1.0}, pos, pattern: ['medium', 'close', 'medium', 'close', 'punch', 'punch'], shots: {b14: 'close', d16: 'punch', b13: 'push'}});
    if (f >= s.beat('turn').start && f < s.at('b14')) cam = {x: 1700, y: 560, zoom: 1.25};
    if (f >= s.cue('honk') && f < s.cue('honk') + 12) cam = shake({x: 960, y: 560, zoom: 1.1}, f, s.cue('honk'), 12, 12);
  }
  const lean = s.beat('lean');
  const actor = (who: 'dex' | 'milo' | 'benny', extra: Partial<ActorSpec> = {}): ActorSpec => ({
    who,
    x: xs[who],
    y: pos[who].y,
    look: who === 'milo' ? miloL(true) : who === 'benny' ? bennyL(true) : undefined,
    walking: walkingNow,
    run: running,
    walkPhase: phase + (who === 'milo' ? 1 : who === 'benny' ? 2 : 0),
    squash: crouch ? 0.82 : 1,
    lean: running ? 10 : crouch ? 8 : 0,
    facing: 1,
    mood: running ? 'scared' : 'worried',
    ...extra,
  });
  const benny = actor('benny', f >= lean.start && f < s.at('b14') ? {x: 820 - 60, lean: -18, squash: 0.95, walking: false, mood: 'happy', pose: ['down', 'reach']} : {});
  if (s.after('b14') && !running) benny.mood = 'worried';
  return (
    <Stage
      cam={cam}
      rim="#ffb36b"
      set={<DestroyedCity frame={f} seed="main" />}
      actors={[actor('dex', {holding: <BroomSpatula />, pose: ['down', 'hold']}), actor('milo'), benny, ...zs]}
      front={
        <>
          <Debris x={420} y={1010} seed="d1" />
          <Debris x={2300} y={1030} seed="d2" />
          {running && <MotionLines x={xs.dex} y={700} dir={1} frame={f} />}
          {running && <MotionLines x={xs.benny} y={720} dir={1} frame={f} />}
          {turned && zs.slice(0, 5).map((z, i) => <Emote key={i} x={z.x} y={z.y! - 470 * (z.scale ?? 1)} t={f - s.cue('honk') - i * 3} kind="!" dur={30} />)}
        </>
      }
      overlay={
        <>
          <Light kind="warm" />
          {s.after('honk') && <SoundWord text="HONK!" t={f - s.cue('honk')} x={760} y={300} color="#f6c945" />}
          {s.after('doorSlam') && <SoundWord text="SLAM!" t={f - s.cue('doorSlam')} x={1300} y={420} color="#e8553e" />}
          {s.after('doorSlam') && <Flash t={f - s.cue('doorSlam')} color="#000" dur={20} />}
        </>
      }
    >
      <StopSign x={-100} />
      <FlippedCar x={1900} y={990} frame={f} fire color="#7b5ea7" />
      {/* the honking car */}
      <g transform="translate(900 960)">
        <g transform="scale(0.9)">
          <path d="M -230 -60 Q -235 -130 -170 -140 L -110 -145 Q -70 -230 30 -230 Q 110 -230 150 -150 L 210 -140 Q 240 -130 235 -60 Z" fill="#5aa469" stroke={INK} strokeWidth={4} />
          <path d="M -90 -150 Q -60 -205 0 -205 L 0 -150 Z" fill="#9ab" stroke={INK} strokeWidth={4} />
          {[-140, 140].map((wx) => (
            <circle key={wx} cx={wx} cy={-52} r={48} fill="#2f2f3a" stroke={INK} strokeWidth={4} />
          ))}
        </g>
      </g>
      {/* Mega Saver storefront at the end of the street */}
      <g transform="translate(3150 870)" stroke={INK} strokeWidth={4}>
        <rect x={-300} y={-500} width={600} height={500} fill="#4f9dde" />
        <rect x={-280} y={-480} width={560} height={90} rx={12} fill="#f6c945" />
        <text x={0} y={-418} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill={INK} stroke="none">
          MEGA SAVER
        </text>
        <rect x={-120} y={-300} width={240} height={300} fill="#bfe6ff" />
        <line x1={0} y1={-300} x2={0} y2={0} />
      </g>
      <Fire x={2500} y={880} frame={f} s={0.7} />
    </Stage>
  );
};

// ═════════════ 5. MEGA SAVER SUPERMARKET – the bite ═════════════
export const S05: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const flicker = (Math.floor(f / 3) * 7919) % 11 > 2 ? 1 : 0;
  const lunge = s.beat('lunge');
  const bonked = s.after('bonk');
  const garyX = interpolate(f, [lunge.start, lunge.end], [1750, 1340], clamp);
  const reach = s.beat('reach');
  const bennyW = walk(f, reach.start - 10, reach.end, 820, 520);
  const bitten = s.after('bite');
  const zPop = interpolate(f, [reach.end - 12, s.cue('bite')], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const cartT = interpolate(f, [s.cue('cartSmash') - 14, s.cue('cartSmash')], [0, 1], clamp);
  const hasBaguette = f >= lunge.start - 6 && !s.after('d22') ;
  const pos = {dex: {x: 1120, y: 900}, milo: {x: 980, y: 905, look: miloL(true)}, benny: {x: bennyW.x, y: 910, look: bennyL(true)}, };
  let cam = direct(s, {
    wide: {x: 1000, y: 560, zoom: 1.0},
    pos,
    pattern: ['close', 'medium', 'close', 'medium', 'close', 'push', 'medium'],
    shots: {b16: 'push', b17: 'close', m14: 'punch', d21: 'low', m15: 'close', b19: 'push', b20: 'close', b21: 'punch'},
  });
  if (f < s.at('b16')) cam = camKeys(f, [{f: 0, cam: {x: 1300, y: 420, zoom: 0.85}}, {f: s.at('b16'), cam: {x: 900, y: 560, zoom: 1.1}}]);
  if (f >= s.cue('gary') && f < s.at('m14')) cam = {x: 1750, y: 520, zoom: 1.8};
  if (f >= lunge.start && f < s.at('d21')) cam = shake({x: 1240, y: 560, zoom: 1.35}, f, s.cue('bonk'), 14, 16);
  if (f >= reach.end - 12 && f < s.at('b21')) cam = shake({x: 470, y: 520, zoom: 1.9}, f, s.cue('bite'), 16, 20);
  if (f >= s.cue('cartSmash') - 14) cam = {x: 700, y: 560, zoom: 1.2};
  const actors: ActorSpec[] = [
    {
      who: 'dex',
      ...pos.dex,
      facing: f >= lunge.start - 20 && !s.after('b19') ? 1 : -1,
      holding: hasBaguette ? <Baguette /> : <BroomSpatula />,
      pose: hasBaguette ? (bonked && f < s.cue('bonk') + 20 ? ['down', 'reach'] : ['down', 'up']) : s.after('cartSmash') ? ['reach', 'reach'] : ['down', 'hold'],
      lean: bonked && f < s.cue('bonk') + 16 ? 14 : 0,
      mood: s.after('d22') ? 'worried' : 'smug',
      x: s.after('cartSmash') ? interpolate(cartT, [0, 1], [1120, 760]) : 1120,
      walking: cartT > 0 && cartT < 1,
      run: true,
    },
    {who: 'milo', ...pos.milo, look: miloL(true), facing: s.after('b19') ? -1 : 1, mood: s.after('m14') ? 'scared' : 'worried', pose: s.after('m14') && !s.after('d20') ? ['down', 'point'] : 'down'},
    {who: 'benny', ...pos.benny, look: bennyL(true, 0, bitten), facing: s.after('b19') ? -1 : 1, walking: bennyW.walking, walkPhase: bennyW.walkPhase, pose: s.after('b17') && !s.after('d19') ? 'up' : f >= reach.start && !bitten ? ['down', 'reach'] : bitten && !s.after('cartSmash') ? 'up' : 'down', mood: bitten ? 'scared' : 'happy', squash: bitten && f < s.cue('bite') + 10 ? 1.15 : 1},
    {who: 'gary', x: bonked ? garyX + 40 : garyX, y: 900, look: garyL(), facing: -1, pose: 'reach', walking: f > lunge.start && !bonked, walkPhase: garyX / 14, lean: bonked ? interpolate(f, [s.cue('bonk'), s.cue('bonk') + 12], [0, 85], clamp) : -6, opacity: 1, mouth: 0.3, z: 950},
    {who: 'freezerZ', x: 400, y: 905 - zPop * 0, look: zombieLook('fz', {body: '#6a8a6a'}), facing: 1, pose: 'reach', opacity: zPop, scale: 0.3 + zPop * 0.7, mouth: bitten ? 0.8 : 0.4, z: 905, lean: 10},
  ];
  return (
    <Stage
      cam={cam}
      rim="#fffbe0"
      set={<Supermarket frame={f} flicker={flicker} />}
      actors={actors}
      front={
        <>
          {/* the last bag lives on the display; once bitten, Benny clutches it */}
          <ImpactStars x={garyX - 40} y={460} t={f - s.cue('bonk')} />
          {bitten && <ImpactStars x={480} y={600} t={f - s.cue('bite')} color="#9aff8a" />}
          <ImpactStars x={420} y={620} t={f - s.cue('cartSmash')} />
          {s.after('gary') && !bonked && <Emote x={1750} y={420} t={f - s.cue('gary')} kind="!" dur={40} />}
        </>
      }
      overlay={
        <>
          <Vignette amount={0.3} />
          {bonked && <SoundWord text="BONK!" t={f - s.cue('bonk')} x={1150} y={300} />}
          {bitten && <SoundWord text="CHOMP!" t={f - s.cue('bite')} x={700} y={260} color="#9aff8a" rot={6} />}
          {bitten && <Flash t={f - s.cue('bite')} color="#9aff8a" dur={10} />}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: flicker ? 'transparent' : 'rgba(10,10,20,0.25)'}} />
        </>
      }
    >
      <Register x={1800} />
      {/* Gary's name tag hovering text */}
      <g transform={`translate(${garyX + 10} 600)`} opacity={bonked ? 0 : 1}>
        <rect x={-34} y={-14} width={68} height={26} rx={4} fill="#fff" stroke={INK} strokeWidth={3} />
        <text x={0} y={6} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={18} fill={INK}>
          GARY
        </text>
      </g>
      <Display x={300} hasBag={!bitten && f < reach.end} />
      <Cart x={interpolate(cartT, [0, 1], [900, 520])} frame={f} full />
    </Stage>
  );
};

// ═════════════ 6. BACK ROOM – Benny turns… sort of ═════════════
export const S06: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const turning = s.beat('turning');
  const green = interpolate(f, [turning.start, turning.end], [0, 1], clamp);
  const shaking = f >= turning.start && f < s.cue('turned') + 30;
  const zombieMoment = f >= s.cue('turned') && f < s.at('b24');
  const pos = {benny: {x: 960, y: 900, look: bennyL(true, green, true)}, dex: {x: 1360, y: 895}, milo: {x: 560, y: 900, look: miloL(true)}};
  let cam = direct(s, {
    wide: {x: 960, y: 560, zoom: 1.05},
    pos,
    pattern: ['close', 'push', 'punch', 'close', 'medium', 'close', 'push', 'close', 'medium', 'punch'],
    shots: {m18: 'punch', d23: 'close', b24: 'medium', b25: 'push', d24: 'close', m20: 'close', b26: 'low'},
  });
  if (f >= turning.start && f < s.at('b24')) {
    cam = camKeys(f, [{f: turning.start, cam: {x: 960, y: 560, zoom: 1.2}}, {f: s.cue('turned'), cam: {x: 960, y: 420, zoom: 2.3}, ease: Easing.in(Easing.cubic)}]);
    cam = shake(cam, f, s.cue('turned'), 20, 14);
  }
  const jitter = shaking ? Math.sin(f * 2.3) * 6 : 0;
  const actors: ActorSpec[] = [
    {
      who: 'benny',
      ...pos.benny,
      x: 960 + jitter,
      look: {...bennyL(true, green, true), zombie: zombieMoment},
      sitting: true,
      facing: 1,
      holding: <CheesePuffs s={0.6} />,
      pose: zombieMoment ? 'reach' : ['down', 'hold'],
      eyesClosed: f >= turning.start && f < s.cue('turned') - 6,
      mood: zombieMoment ? 'neutral' : s.after('b24') ? 'confused' : 'sad',
      lean: shaking ? Math.sin(f * 1.7) * 5 : 0,
    },
    {who: 'dex', ...pos.dex, facing: -1, holding: <BroomSpatula />, pose: zombieMoment ? ['down', 'up'] : ['down', 'hold'], mood: zombieMoment ? 'scared' : 'worried', lean: zombieMoment ? -10 : 0},
    {who: 'milo', ...pos.milo, look: miloL(true), facing: 1, mood: zombieMoment ? 'scared' : 'worried', pose: zombieMoment ? 'up' : 'down', lean: zombieMoment ? 10 : 0},
  ];
  return (
    <Stage
      cam={cam}
      rim="#fff3b0"
      set={<BackRoom frame={f} />}
      actors={actors}
      front={
        <>
          {s.after('m18') && <Emote x={560} y={380} t={f - s.at('m18')} kind="anger" dur={40} />}
          {s.after('b25') && <Emote x={1010} y={330} t={f - s.at('b25') - 40} kind="idea" dur={50} />}
          <Darkness id="br" lights={[{x: 960, y: 300, r: 900}]} opacity={0.55} />
        </>
      }
      overlay={
        <>
          <Light kind="warm" strength={0.5} />
          {f >= turning.start && f < s.at('b24') && <div style={{position: 'absolute', inset: 0, background: `rgba(120,255,140,${0.18 * green})`, mixBlendMode: 'multiply'}} />}
        </>
      }
    />
  );
};
