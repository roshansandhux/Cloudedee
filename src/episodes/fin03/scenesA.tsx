// fin03 scenes 1–7: cold open, studio, TFSA (ice fishing), garage, traps (curling), emergency fund (cottage), RRSP (hockey)
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk} from '../../stage/camera';
import {Mug} from '../../props/props';
import {DustPuff, Emote, Flash, ImpactStars, MotionLines, Sparkles, SoundWord, SweatDrop, TitleCard, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {BigStat, ChapterChip, Coin, OfficeChair, Panel, Studio, SwipeCard, clamp, pop, ramp} from '../fin02/kit';
import {
  CurlingRink, CurlingStone, Cottage, FINN_CA, Fish, Garage, HockeyNet, HockeyRink, IceHole, IceLake, MapleLeaf, Puck, RUTH_CA,
  RaceCar, SnowStreet, Snowfall, TaxMoose,
} from './kit';

const T = (s: ReturnType<typeof useScene>, id: string) => s.frame - s.at(id);

// ---------- shared bits
export const Shield: React.FC<{x: number; y: number; s?: number; label: string; color: string; sub?: string}> = ({x, y, s = 1, label, color, sub}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={6} strokeLinejoin="round">
    <path d="M 0 -130 L 110 -90 Q 110 60 0 130 Q -110 60 -110 -90 Z" fill={color} />
    <path d="M 0 -104 L 86 -72 Q 84 46 0 102 Q -84 46 -86 -72 Z" fill="#fff" fillOpacity={0.25} strokeWidth={0} />
    <text y={sub ? 6 : 18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">
      {label}
    </text>
    {sub && (
      <text y={52} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#fff" stroke={INK} strokeWidth={5} paintOrder="stroke">
        {sub}
      </text>
    )}
  </g>
);

export const Stamp: React.FC<{t: number; text: string; x: string | number; y: string | number; color?: string; size?: number; rot?: number}> = ({t, text, x, y, color = '#e5302f', size = 80, rot = -10}) => {
  if (t < 0) return null;
  const s = interpolate(t, [0, 6], [2.4, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const o = interpolate(t, [0, 4], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `10px solid ${color}`, color, borderRadius: 18, padding: '6px 26px', fontFamily: FONT, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', background: 'rgba(255,250,241,0.9)', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)'}}>
      {text}
    </div>
  );
};

/** Screen-space info card (HTML) that pops in. */
export const InfoCard: React.FC<{t: number; dur?: number; x: string | number; y: string | number; w?: number; color?: string; title?: string; children: React.ReactNode; rot?: number}> = ({t, dur = 99999, x, y, w = 620, color = '#e5302f', title, children, rot = -2}) => {
  if (t < 0 || t > dur) return null;
  const s = pop(t, 12);
  const o = interpolate(t, [dur - 8, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, background: PAPER, border: `6px solid ${INK}`, borderRadius: 30, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)', overflow: 'hidden', fontFamily: FONT, color: INK}}>
      {title && <div style={{background: color, color: '#fff', fontWeight: 700, fontSize: 40, padding: '10px 26px', borderBottom: `6px solid ${INK}`, WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>{title}</div>}
      <div style={{padding: '18px 28px', fontSize: 40, fontWeight: 600, lineHeight: 1.25}}>{children}</div>
    </div>
  );
};

export const Counter: React.FC<{t: number; from: number; to: number; dur?: number; prefix?: string; suffix?: string; x: string | number; y: string | number; size?: number; color?: string; sub?: string; hold?: number}> = ({t, from, to, dur = 40, prefix = '$', suffix = '', x, y, size = 150, color = '#f6c945', sub, hold = 99999}) => {
  if (t < 0 || t > hold) return null;
  const v = interpolate(t, [0, dur], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
  return <BigStat t={t} text={`${prefix}${Math.round(v).toLocaleString('en-US')}${suffix}`} x={x} y={y} size={size} color={color} sub={sub} dur={hold} />;
};

const Shovel: React.FC<{label?: string}> = ({label}) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round" transform="rotate(-20)">
    <rect x={-6} y={-150} width={12} height={170} fill="#a5703f" />
    <rect x={-22} y={-168} width={44} height={20} rx={8} fill="#2b2333" />
    <path d="M -50 20 H 50 L 44 110 Q 0 126 -44 110 Z" fill="#e5302f" />
    {label && (
      <text x={0} y={76} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={20} fill="#fff">
        {label}
      </text>
    )}
  </g>
);

const Rod: React.FC<{bend: number}> = ({bend}) => (
  <g stroke={INK} strokeLinecap="round" fill="none">
    <path d={`M 0 0 Q 80 ${-120 + bend * 40} 200 ${-150 + bend * 90}`} strokeWidth={8} />
    <path d={`M 200 ${-150 + bend * 90} L 200 ${60 + bend * 40}`} strokeWidth={2} />
    <rect x={-10} y={-10} width={36} height={26} rx={6} fill="#e5302f" strokeWidth={3} />
  </g>
);

const Broom: React.FC = () => (
  <g stroke={INK} strokeWidth={4} transform="rotate(30)">
    <rect x={-5} y={-160} width={10} height={220} fill="#e5302f" />
    <rect x={-40} y={60} width={80} height={30} rx={8} fill="#2b2333" />
  </g>
);

// =============================================================== 1. COLD OPEN – moose crossing
export const ColdOpen: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const moose = s.cue('moose');
  const hook = s.cue('hook');
  const title = s.beat('titleCard');
  const w = walk(f, 4, 80, 260, 700);
  const startle = hop(f, moose + 4, 14, 90);
  const mooseY = interpolate(f, [moose - 8, moose], [-700, 0], {...clamp, easing: Easing.in(Easing.quad)});
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.0}},
    {f: s.at('f101') + 60, cam: {x: 820, y: 560, zoom: 1.25}},
    {f: moose - 2, cam: {x: 900, y: 540, zoom: 1.1}},
    {f: s.at('m101'), cam: {x: 1250, y: 520, zoom: 1.2}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f102') - 2, cam: {x: 1250, y: 520, zoom: 1.2}},
    {f: s.at('f102') + 6, cam: {x: 760, y: 560, zoom: 1.7}, ease: Easing.out(Easing.back(1.6))},
    {f: s.at('f103'), cam: {x: 820, y: 560, zoom: 1.45}},
    {f: hook, cam: {x: 760, y: 540, zoom: 1.75}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f104') + 30, cam: {x: 1000, y: 560, zoom: 1.0}},
  ]);
  cam = shake(cam, f, moose, 14, 18);
  cam = drift(cam, f, 0.6);
  const mooseMood = f < s.at('f102') ? 'smug' : 'neutral';
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#bfe6ff"
      set={<SnowStreet frame={f} />}
      speakers={{moose: {x: 1420, y: 900 - 560}}}
      actors={[
        {
          who: 'finn',
          look: FINN_CA,
          x: w.x,
          y: 900 + startle.dy,
          squash: startle.squash,
          walking: w.walking,
          walkPhase: w.walkPhase,
          facing: f > moose ? 1 : w.facing,
          pose: f < moose ? 'hold' : f < s.at('f103') ? 'up' : f < hook ? 'point' : 'fist',
          holding: f < moose ? <Mug color="#e5302f" steam={f} /> : undefined,
          mood: f >= moose && f < s.at('f103') ? 'scared' : undefined,
        },
      ]}
      front={
        <>
          {f >= moose - 8 && <TaxMoose x={1420} y={900 + mooseY} s={1} frame={f} talk={s.mouth('moose')} mood={mooseMood} arms="clip" />}
          <DustPuff x={1360} y={900} t={f - moose} n={10} />
          <Emote x={w.x} y={430} t={f - moose - 4} kind="!" dur={34} />
          {f >= moose + 4 && f < moose + 40 && (
            <g transform={`translate(${760 + (f - moose) * 6} ${700 - (f - moose) * 14 + (f - moose) ** 2 * 0.5}) rotate(${(f - moose) * 20})`}>
              <Mug color="#e5302f" />
            </g>
          )}
          <SweatDrop x={w.x + 60} y={460} t={f - s.at('f102')} />
        </>
      }
      overlay={
        <>
          <SoundWord text="THUD!" t={f - moose} x={1360} y={300} color="#ff8f73" size={110} />
          <BigStat t={f - hook} text="3 CHEAT CODES 🎮" x="66%" y="20%" size={110} dur={s.at('f104') - hook + 4} />
          <Counter t={f - s.at('f104') - 10} from={0} to={1000000} dur={50} x="50%" y="14%" size={140} sub="a regular person?! 🤯" />
          {f >= title.start && <TitleCard t={f - title.start} dur={title.end - title.start} kicker="FINNOMICS · Canada edition 🍁" title="How to Get Rich in Canada (Even If You Start Broke)" bg="#a8222b" />}
          <Vignette amount={0.28} />
        </>
      }
    />
  );
};

// =============================================================== 2. STUDIO – three cheat codes
const SEAT = {x: 520, y: 862};
const PANEL = {x: 960, y: 140, w: 820, h: 600};

const PiggyMoth: React.FC<{f: number}> = ({f}) => {
  const wing = Math.abs(Math.sin(f * 0.9));
  return (
    <g stroke={INK} strokeWidth={5}>
      <g transform={`translate(410 340) rotate(${Math.sin(f / 10) * 4})`}>
        <ellipse rx={150} ry={112} fill="#ff9ec4" />
        <ellipse cx={150} cy={10} rx={34} ry={40} fill="#ff86b2" />
        <circle cx={145} cy={0} r={6} fill={INK} />
        <circle cx={145} cy={22} r={6} fill={INK} />
        <rect x={-30} y={-116} width={70} height={12} rx={6} fill={INK} />
        <path d="M -70 -95 L -50 -150 L -20 -105 Z" fill="#ff86b2" />
        {[-90, -30, 40, 95].map((lx) => (
          <rect key={lx} x={lx - 16} y={88} width={32} height={46} rx={10} fill="#ff86b2" />
        ))}
        {/* tiny toque on the pig */}
        <path d="M -20 -112 Q 0 -170 40 -112 Z" fill="#e5302f" />
        <circle cx={10} cy={-160} r={12} fill="#fff" />
      </g>
      <g transform={`translate(${410 + Math.sin(f / 7) * 60} ${170 + Math.cos(f / 5) * 20})`} strokeWidth={3}>
        <ellipse cx={-14} cy={-10} rx={22} ry={16 * wing + 3} fill="#b9ae9e" />
        <ellipse cx={14} cy={-10} rx={22} ry={16 * wing + 3} fill="#cfc4b4" />
        <ellipse rx={8} ry={18} fill="#8d8273" />
        <path d="M -8 -16 Q 0 -30 8 -16" fill="#e5302f" />
      </g>
      <text x={410} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e8553e" stroke="none">
        balance: $0.00 (moth hotel 🏨)
      </text>
    </g>
  );
};

export const Intro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const codes = s.cue('codes');
  const shadow = s.cue('mooseShadow');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.15}},
    {f: 20, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f106') - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f106') + 5, cam: {x: 560, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f107') - 2, cam: {x: 560, y: 520, zoom: 1.6}},
    {f: s.at('f107') + 10, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: shadow - 2, cam: {x: 1000, y: 540, zoom: 1.05}},
    {f: shadow + 10, cam: {x: 900, y: 600, zoom: 0.92}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = shake(cam, f, shadow, 20, 8);
  cam = drift(cam, f, 0.6);
  const shadowIn = ramp(f, shadow - 4, shadow + 20);
  const shown = [0, 1, 2].map((i) => pop(f - s.at('f107') - 50 - i * 45, 12));
  return (
    <Stage
      cam={cam}
      vcam={{x: 760, zoom: 1.9}}
      rim="#ffd0d0"
      set={<Studio frame={f} a="#5c1220" b="#a8222b" c="#e86a5f" />}
      speakers={{moose: {x: 1700, y: 220}}}
      actors={[
        {
          who: 'finn',
          look: FINN_CA,
          ...SEAT,
          sitting: true,
          facing: 1,
          pose: f < s.at('f106') ? 'wave' : f < s.at('f107') ? 'shrug' : f < shadow ? 'point' : 'up',
          mood: f >= shadow ? 'scared' : undefined,
          look2: f >= shadow ? {x: 1, y: -0.5} : undefined,
        },
      ]}
      front={
        <>
          <Panel {...PANEL} title={f < s.at('f107') ? 'FINNOMICS' : '3 CHEAT CODES'} color={f < s.at('f107') ? '#e5302f' : '#4f9dde'} s={pop(f, 10)}>
            {f < s.at('f107') ? (
              <PiggyMoth f={f} />
            ) : (
              <g>
                {[
                  ['TFSA', '#5fb37a'],
                  ['RRSP', '#4f9dde'],
                  ['FHSA', '#e86a8f'],
                ].map(([l, c], i) => (
                  <g key={l} opacity={shown[i] > 0 ? 1 : 0}>
                    <Shield x={160 + i * 250} y={330} s={Math.max(0.01, shown[i]) * 0.95} label={l} color={c} />
                  </g>
                ))}
                <text x={410} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={INK}>
                  {f >= s.at('f108') ? 'shields vs. the Tax Moose 🫎' : 'not Wi-Fi passwords, promise'}
                </text>
              </g>
            )}
          </Panel>
          {f >= shadow - 4 && (
            <g opacity={shadowIn * 0.85} transform={`translate(${1700 + (1 - shadowIn) * 500} 0)`}>
              <g transform="translate(0 1100) scale(1.9)">
                <TaxMoose x={0} y={0} frame={f} talk={s.mouth('moose')} mood="angry" arms="down" />
              </g>
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="FINNOMICS 🍁 CANADA" color="#ff8f73" dur={110} />
          <BigStat t={T(s, 'f106') - 4} dur={s.at('f107') - s.at('f106')} text="NOT FINANCIAL ADVICE" sub="(he's 14 and very cold 🥶)" x="66%" y="66%" size={80} color="#ff8f73" rot={-6} />
          {f >= shadow - 4 && <AbsoluteFill style={{background: '#0a0510', opacity: shadowIn * 0.35}} />}
          <Vignette amount={0.35} />
        </>
      }
    >
      <OfficeChair x={SEAT.x - 10} frame={f} color="#e5302f" />
    </Stage>
  );
};

// =============================================================== 3. TFSA – ice fishing with Grandma
const HOLE = {x: 1240, y: 930};
export const Tfsa: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const catchAt = s.cue('catch');
  const limit = s.cue('limit');
  const tryAt = s.cue('mooseTry');
  const mw = walk(f, tryAt - 50, tryAt - 4, 2200, 1480);
  const bounced = f > tryAt + 4;
  const mooseX = bounced ? 1480 + interpolate(f, [tryAt + 4, tryAt + 24], [0, 260], {...clamp, easing: Easing.out(Easing.cubic)}) : mw.x;
  const shield = f < tryAt - 2 ? 0 : interpolate(f, [tryAt - 2, tryAt + 4, s.at('f112')], [0, 1, 0.5], clamp);
  const fishT = f - catchAt;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: s.at('u101'), cam: {x: 1050, y: 580, zoom: 1.3}},
    {f: catchAt + 10, cam: {x: 1150, y: 600, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: limit - 2, cam: {x: 900, y: 560, zoom: 1.2}},
    {f: tryAt - 50, cam: {x: 1100, y: 560, zoom: 1.0}},
    {f: tryAt + 2, cam: {x: 1300, y: 600, zoom: 1.4}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('u102'), cam: {x: 1100, y: 580, zoom: 1.3}},
    {f: s.at('f112'), cam: {x: 900, y: 560, zoom: 1.15}},
  ]);
  cam = shake(cam, f, tryAt, 12, 12);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1100, zoom: 1.7}}
      rim="#d8f0ff"
      set={<IceLake frame={f} />}
      speakers={{moose: {x: mooseX, y: 340}}}
      actors={[
        {who: 'finn', look: FINN_CA, x: 640, facing: 1, pose: f < limit ? 'point' : f < tryAt ? 'hips' : f < s.at('f112') ? 'up' : 'shrug'},
        {who: 'ruth', look: RUTH_CA, x: 980, facing: 1, pose: ['down', 'hold'], holding: <Rod bend={fishT > 0 && fishT < 24 ? 1 : 0} />, mood: s.after('u102') && !s.after('f112') ? 'smug' : undefined},
      ]}
      front={
        <>
          <IceHole x={HOLE.x} y={HOLE.y} shield={shield} frame={f} />
          {fishT >= 0 && fishT < 60 && (
            <Fish x={HOLE.x + interpolate(fishT, [0, 40], [0, -160], clamp)} y={HOLE.y - Math.sin(Math.min(1, fishT / 40) * Math.PI) * 300 - interpolate(fishT, [0, 40], [0, 40], clamp)} rot={fishT * 9} s={1.1} gold label="$" />
          )}
          {/* bucket of fish (= tax-free growth) */}
          <g transform="translate(1060 930)" stroke={INK} strokeWidth={4}>
            <path d="M -50 -80 H 50 L 40 0 H -40 Z" fill="#9aa0a6" />
            {fishT >= 40 && <Fish x={0} y={-90} s={0.55} rot={-30} gold label="$" />}
          </g>
          {f >= tryAt - 50 && f < s.at('f112') + 60 && <TaxMoose x={mooseX} y={930} s={0.95} frame={f} talk={s.mouth('moose')} mood={bounced ? 'shock' : 'smug'} arms={f < tryAt ? 'point' : 'up'} flip />}
          <ImpactStars x={1400} y={760} t={f - tryAt} />
          <Sparkles x={HOLE.x} y={HOLE.y - 80} t={(f - tryAt) % 50} r={120} color="#bff8ff" />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="CHEAT CODE #1: TFSA 🛡️" color="#5fd38a" dur={150} />
          <SoundWord text="SPLASH!" t={fishT} x={1100} y={320} color="#7fd3ff" size={90} />
          <InfoCard t={f - s.at('f110') - 20} dur={limit - s.at('f110') - 10} x="74%" y="26%" w={560} color="#5fb37a" title="TFSA = Tax-Free">
            Growth inside: <b>$0 tax</b>
            <br />
            Take it out: <b>$0 tax</b> 🎉
          </InfoCard>
          <BigStat t={f - limit} dur={tryAt - 60 - limit} text="$7,000 / year" sub="2026 TFSA limit" x="72%" y="16%" size={110} color="#5fd38a" />
          <Counter t={f - limit - 80} from={7000} to={109000} dur={60} hold={tryAt - 60 - limit - 80} x="72%" y="40%" size={110} sub="room if 18+ since 2009 & never used 📦" />
          <SoundWord text="BOING!" t={f - tryAt} x={1300} y={300} color="#bff8ff" size={100} />
          <InfoCard t={f - s.at('f112') - 10} x="74%" y="22%" w={600} color="#4f9dde" title="Took money out?">
            You get that room <b>back next year</b> ↺
          </InfoCard>
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

// =============================================================== 4. GARAGE – a basket, not a bank account
export const GarageScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const sad = s.cue('sad');
  const basket = s.cue('basket');
  const vroom = s.cue('vroom');
  const spread = s.cue('spread');
  const carX = f < vroom ? 1180 : 1180 + interpolate(f, [vroom, vroom + 24], [0, 1500], {...clamp, easing: Easing.in(Easing.cubic)});
  const carBack = f > s.at('u106') ? interpolate(f, [s.at('u106'), s.at('u106') + 20], [-900, 1180], {...clamp, easing: Easing.out(Easing.cubic)}) : null;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.2}},
    {f: sad - 2, cam: {x: 760, y: 540, zoom: 1.5}},
    {f: sad + 6, cam: {x: 700, y: 520, zoom: 1.8}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u103'), cam: {x: 1100, y: 560, zoom: 1.2}},
    {f: basket - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: vroom - 2, cam: {x: 1100, y: 600, zoom: 1.2}},
    {f: vroom + 10, cam: {x: 1300, y: 600, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u106'), cam: {x: 960, y: 560, zoom: 1.05}},
    {f: spread, cam: {x: 960, y: 540, zoom: 1.0}},
  ]);
  cam = shake(cam, f, vroom, 14, 10);
  cam = drift(cam, f, 0.6);
  const showPanel = f >= basket && f < vroom;
  const showSpread = f >= s.at('f151');
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.7}}
      rim="#ffe0b0"
      set={<Garage frame={f} />}
      actors={[
        {who: 'finn', look: FINN_CA, x: 520, facing: 1, pose: f < sad ? 'up' : f < s.at('f114') ? 'facepalm' : f < vroom ? 'point' : f < s.at('u106') ? 'fist' : 'hips', mood: f >= sad && f < s.at('f114') ? 'sad' : undefined},
        {who: 'ruth', look: RUTH_CA, x: f < showSpreadAt(s) ? 1720 : 1760, facing: -1, pose: s.after('u106') ? 'think' : 'hips'},
      ]}
      front={
        <>
          {(carBack === null || f < s.at('u106')) && f < vroom + 30 && <RaceCar x={carX} y={900} s={1} frame={f} moving={f >= vroom} />}
          {carBack !== null && <RaceCar x={carBack} y={900} s={1} frame={f} moving={carBack < 1170} label="INDEX" />}
          {f >= vroom && f < vroom + 30 && <MotionLines x={carX - 360} y={820} frame={f} dir={-1} len={300} />}
          <DustPuff x={900} y={900} t={f - vroom} n={10} dir={-1} />
          {f < s.at('f114') && f > s.at('f113') && (
            <g transform="translate(1180 720)">
              <rect x={-150} y={-60} width={300} height={70} rx={14} fill={PAPER} stroke={INK} strokeWidth={5} />
              <text x={0} y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e5302f">
                PARKED 🅿️
              </text>
            </g>
          )}
          {showPanel && (
            <Panel x={760} y={110} w={900} h={560} title="WHAT'S IN YOUR TFSA BASKET?" color="#5fb37a" s={pop(f - basket, 12)}>
              <g transform="translate(450 330)" stroke={INK} strokeWidth={6}>
                <path d="M -250 -40 H 250 L 200 160 H -200 Z" fill="#c98f5e" />
                {Array.from({length: 6}, (_, i) => (
                  <path key={i} d={`M ${-220 + i * 88} -40 L ${-180 + i * 72} 160`} strokeWidth={4} />
                ))}
                <path d="M -200 -40 Q 0 -260 200 -40" fill="none" strokeWidth={14} />
              </g>
              {[
                ['💵', 'Cash', 140],
                ['🏦', 'GICs', 330],
                ['📈', 'Index funds', 560],
                ['📊', 'Stocks', 760],
              ].map(([e, l, x], i) => {
                const p = pop(f - basket - 8 - i * 8, 10);
                return (
                  <g key={l as string} transform={`translate(${x} ${250 + (i % 2) * 20}) scale(${p})`}>
                    <text textAnchor="middle" fontSize={84}>
                      {e}
                    </text>
                    <text y={56} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK} stroke={PAPER} strokeWidth={8} paintOrder="stroke">
                      {l}
                    </text>
                  </g>
                );
              })}
              {f >= s.at('f115') && (
                <g transform="translate(560 330)">
                  <circle r={110} fill="none" stroke="#e5302f" strokeWidth={10} strokeDasharray={`${pop(f - s.at('f115'), 20) * 700} 700`} />
                </g>
              )}
            </Panel>
          )}
          {showSpread && (
            <Panel x={700} y={80} w={940} h={600} title={f >= spread + 0 && f < s.at('f152') ? '1 FUND = 1,000+ COMPANIES' : f >= s.at('f152') ? 'THE POUTINE PRINCIPLE' : 'DIVERSIFY'} color="#4f9dde" s={pop(f - s.at('f151'), 12)}>
              {f < s.at('f152') ? <CompanyGrid t={f - s.at('f151')} /> : <Poutine f={f} t={f - s.at('f152')} />}
            </Panel>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE #1 TFSA MISTAKE 🚗" color="#f6c945" dur={130} />
          <BigStat t={f - s.at('f113') - 40} dur={s.at('u103') - s.at('f113') - 30} text="0.5% 😐" sub="(cash just sitting there)" x="70%" y="18%" size={120} color="#c8ccd2" />
          <SoundWord text="VROOOM!" t={f - vroom} x={1300} y={300} color="#ff8f73" size={120} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};
const showSpreadAt = (s: ReturnType<typeof useScene>) => s.at('f151');

const CompanyGrid: React.FC<{t: number}> = ({t}) => {
  const cols = 20;
  const rows = 8;
  const flop = 47;
  return (
    <g transform="translate(70 120)">
      {Array.from({length: cols * rows}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const p = interpolate(t + 30 - i * 0.4, [0, 8], [0, 1], clamp);
        const bad = i === flop && t > 20;
        return <rect key={i} x={c * 40} y={r * 44} width={32} height={36} rx={6} fill={bad ? '#e5302f' : ['#5fb37a', '#4f9dde', '#f6c945', '#a98bff'][(i * 7) % 4]} stroke={INK} strokeWidth={2.5} opacity={p} transform={bad ? `translate(0 ${Math.min(30, (t - 20) * 2)})` : undefined} />;
      })}
      {t > 24 && (
        <text x={400} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={INK}>
          one flops? you barely notice 🤷
        </text>
      )}
    </g>
  );
};

const Poutine: React.FC<{f: number; t: number}> = ({f, t}) => (
  <g transform="translate(470 370)" stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -230 -40 H 230 L 190 140 H -190 Z" fill="#fff" />
    <path d="M -230 -40 H 230" strokeWidth={8} />
    {Array.from({length: 14}, (_, i) => (
      <rect key={i} x={-190 + i * 26} y={-120 + (i % 3) * 18} width={22} height={110} rx={6} fill="#f6c945" transform={`rotate(${(i % 5) * 8 - 16} ${-180 + i * 26} -60)`} />
    ))}
    {[[-120, -70], [-40, -90], [40, -60], [120, -84], [0, -40]].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={34} ry={24} fill="#fff6e0" />
    ))}
    <path d="M -200 -70 Q -100 -20 0 -70 Q 100 -110 200 -60 L 190 -30 Q 0 0 -190 -30 Z" fill="#8a4a22" opacity={0.85} />
    {/* the soggy fry */}
    <g transform={`translate(150 -150) rotate(${40 + Math.sin(f / 8) * 6})`}>
      <path d="M -12 0 Q -20 60 0 110 Q 20 60 12 0 Z" fill="#d8c27a" />
      <circle cx={-6} cy={30} r={3} fill={INK} />
      <circle cx={6} cy={30} r={3} fill={INK} />
      <path d="M -6 46 Q 0 40 6 46" fill="none" strokeWidth={3} />
    </g>
    {t > 10 && (
      <text x={0} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK} stroke="none">
        one soggy fry ≠ ruined poutine 🍟
      </text>
    )}
  </g>
);

// =============================================================== 5. TRAPS – curling rink
export const Traps: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const penalty = s.cue('penalty');
  const casino = s.cue('casino');
  const sweep = f >= s.at('u109') && f < s.at('u110') + 20;
  const stoneX = f < casino ? -300 : interpolate(f, [casino, s.at('u109') + 40], [300, 1440], {...clamp, easing: Easing.out(Easing.cubic)});
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.1}},
    {f: penalty - 2, cam: {x: 900, y: 560, zoom: 1.05}},
    {f: s.at('m107'), cam: {x: 1560, y: 520, zoom: 1.6}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('f162'), cam: {x: 900, y: 560, zoom: 1.1}},
    {f: casino, cam: {x: 1000, y: 600, zoom: 1.0}},
    {f: s.at('u109'), cam: {x: 900, y: 620, zoom: 1.25}},
    {f: s.at('f164'), cam: {x: 640, y: 560, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u110') - 1, cam: {x: 640, y: 560, zoom: 1.6}},
    {f: s.at('u110') + 3, cam: {x: 900, y: 520, zoom: 1.9}, ease: Easing.out(Easing.back(2))},
  ]);
  cam = drift(cam, f, 0.6);
  const broomOff = sweep ? Math.sin(f * 1.2) * 40 : 0;
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.7}}
      rim="#d0e8ff"
      set={<CurlingRink frame={f} />}
      speakers={{moose: {x: 1600, y: 360}}}
      actors={[
        {who: 'finn', look: FINN_CA, x: 560, facing: 1, pose: f < penalty ? 'point' : f < casino ? 'think' : f < s.at('f164') ? 'point' : 'shrug'},
        {who: 'ruth', look: RUTH_CA, x: 900 + broomOff * 0.3, facing: 1, pose: ['down', 'hold'], holding: <g transform={`translate(${broomOff} 0)`}><Broom /></g>, mood: s.after('u110') ? 'smug' : undefined},
      ]}
      front={
        <>
          {f >= casino && <CurlingStone x={stoneX} y={840} s={1.2} label="TFSA" spin={f * 6} />}
          {f < casino + 10 && <TaxMoose x={1600} y={900} s={0.9} frame={f} talk={s.mouth('moose')} mood={f >= penalty ? 'happy' : 'smug'} arms={f >= penalty && f < s.at('f162') ? 'rub' : 'clip'} flip />}
          {sweep && <DustPuff x={1000} y={900} t={(f - s.at('u109')) % 12} n={4} />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="2 TFSA TRAPS ⚠️" color="#ff8f73" dur={120} />
          <InfoCard t={f - s.at('f161') - 10} dur={s.at('f162') - s.at('f161')} x="50%" y="82%" w={760} color="#e5302f" title="TRAP #1">
            Putting in <b>more than your room</b>
          </InfoCard>
          {f < s.at('f162') && <Stamp t={f - penalty} text="1% / MONTH PENALTY" x="62%" y="62%" size={64} />}
          <InfoCard t={f - s.at('f162') - 6} dur={casino - s.at('f162')} x="50%" y="82%" w={760} color="#4f9dde" title="Your room 📒">
            Check your CRA account — but it can lag. <b>Keep your own notes.</b>
          </InfoCard>
          <InfoCard t={f - casino} dur={s.at('u109') - casino + 10} x="50%" y="82%" w={780} color="#a98bff" title="TRAP #2 🎰">
            Day-trading a lot inside it → could be taxed as a <b>business</b>
          </InfoCard>
          <SoundWord text="SWEEP SWEEP!" t={f - s.at('f164')} x={900} y={260} color="#7fd3ff" size={80} />
          <SoundWord text="HUSH." t={f - s.at('u110')} x={960} y={300} color="#ff8f73" size={110} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 6. EMERGENCY FUND – cottage dock in a snowstorm
export const Emergency: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const stormAt = s.cue('storm');
  const jar = s.cue('jar');
  const storm = interpolate(f, [stormAt, stormAt + 20, s.at('f154') + 20, jar], [0, 1, 1, 0.2], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 760, y: 560, zoom: 1.2}},
    {f: stormAt - 2, cam: {x: 760, y: 560, zoom: 1.3}},
    {f: stormAt + 20, cam: {x: 900, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f154'), cam: {x: 640, y: 540, zoom: 1.4}},
    {f: jar, cam: {x: 800, y: 540, zoom: 1.1}},
    {f: s.at('u108'), cam: {x: 900, y: 560, zoom: 1.35}},
  ]);
  cam = shake(cam, f, stormAt, 24, 8);
  cam = drift(cam, f, 0.6);
  const flyers: [string, number][] = [
    ['🚗💥', 0],
    ['🔥❌', 1],
    ['🐕🧤', 2],
  ];
  const jarFill = ramp(f, jar + 10, s.at('u108'));
  return (
    <Stage
      cam={cam}
      vcam={{x: 760, zoom: 1.7}}
      rim="#e0f0ff"
      set={<Cottage frame={f} storm={storm} />}
      actors={[
        {who: 'finn', look: FINN_CA, x: 560, y: 862, facing: 1, pose: ['down', 'hold'], holding: <Shovel label="EMERGENCY" />, mood: storm > 0.5 ? 'worried' : undefined, lean: storm * -0.08},
        {who: 'ruth', look: RUTH_CA, x: 860, y: 862, facing: -1, pose: s.after('u108') ? ['down', 'hold'] : 'hips', holding: s.after('u108') ? <CoffeeCan /> : undefined, lean: storm * -0.05},
      ]}
      front={
        <>
          {flyers.map(([e, i]) => {
            const t = f - s.at('u107') - 30 - i * 40;
            if (t < 0 || t > 70) return null;
            return (
              <text key={e} x={2100 - t * 34} y={420 + i * 120 + Math.sin(t / 4) * 20} fontSize={120} transform={`rotate(${t * -6} ${2100 - t * 34} ${420 + i * 120})`}>
                {e}
              </text>
            );
          })}
          {f >= s.at('f154') && f < jar && (
            <g transform={`translate(${1250} ${560}) rotate(${Math.sin(f / 10) * 5})`}>
              <SwipeCard x={0} y={0} s={0.7} frame={f} talk={0} mood="evil" arms="rub" legs={false} />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="FIRST: A SNOW SHOVEL ❄️" color="#bfe6ff" dur={130} />
          <BigStat t={f - s.at('f154') - 40} dur={jar - s.at('f154') - 40} text="~20% INTEREST 😱" sub="surprise bills on a credit card" x="66%" y="74%" size={90} color="#ff8f73" />
          {f >= jar && (
            <div style={{position: 'absolute', left: '72%', top: '46%', transform: `translate(-50%,-50%) scale(${pop(f - jar, 12)})`}}>
              <svg width={360} height={460} viewBox="-180 -230 360 460">
                <rect x={-70} y={-220} width={140} height={50} rx={10} fill="#c8ccd2" stroke={INK} strokeWidth={6} />
                <path d="M -140 -170 H 140 V 180 Q 140 220 100 220 H -100 Q -140 220 -140 180 Z" fill="#dff2ff" fillOpacity={0.6} stroke={INK} strokeWidth={6} />
                <clipPath id="jarclip">
                  <path d="M -136 -166 H 136 V 180 Q 136 216 100 216 H -100 Q -136 216 -136 180 Z" />
                </clipPath>
                <g clipPath="url(#jarclip)">
                  <rect x={-140} y={216 - 380 * jarFill} width={280} height={400} fill="#5fd38a" />
                  {Array.from({length: 12}, (_, i) => (
                    <Coin key={i} x={-90 + (i % 4) * 60} y={190 - Math.floor(i / 4) * 50 - (1 - jarFill) * 400} r={22} />
                  ))}
                </g>
                <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">
                  3–6 months
                </text>
                <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
                  of basic expenses
                </text>
              </svg>
            </div>
          )}
          <BigStat t={f - s.at('f155') - 110} dur={s.at('u108') - s.at('f155') - 100} text="Start with $500 👍" x="30%" y="84%" size={90} color="#5fd38a" />
          <BigStat t={f - s.at('u108') - 10} text="HISA + coffee can ☕" x="30%" y="84%" size={80} color="#f6c945" />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

const CoffeeCan: React.FC = () => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-30} y={-70} width={60} height={70} rx={6} fill="#e5302f" />
    <ellipse cx={0} cy={-70} rx={30} ry={8} fill="#c8ccd2" />
    <text y={-28} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#fff" stroke="none">
      $
    </text>
  </g>
);

// =============================================================== 7. RRSP – hockey rink
export const Rrsp: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const refund = s.cue('refund');
  const goal = s.cue('goal');
  const assist = s.cue('assist');
  const NET = {x: 1600, y: 900};
  // shot: puck from Finn's stick to the net, then comes back with a bonus
  const shot = ramp(f, refund + 4, refund + 18);
  const back = ramp(f, goal + 10, goal + 40);
  const puckX = f < goal + 10 ? 780 + (NET.x - 780) * shot : NET.x + (780 - NET.x) * back;
  const puckY = 890 - Math.sin(shot * Math.PI) * 60 * (1 - back);
  const goalLight = f >= goal && f < goal + 60 ? 1 : 0;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.2}},
    {f: s.at('f118'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: refund + 2, cam: {x: 1200, y: 600, zoom: 1.15}},
    {f: goal, cam: {x: 1500, y: 620, zoom: 1.5}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('m104') - 2, cam: {x: 1500, y: 600, zoom: 1.2}},
    {f: s.at('m104') + 8, cam: {x: 1760, y: 470, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f120'), cam: {x: 900, y: 560, zoom: 1.2}},
    {f: assist, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: assist + 30, cam: {x: 800, y: 540, zoom: 1.3}},
  ]);
  cam = shake(cam, f, goal, 16, 10);
  cam = drift(cam, f, 0.6);
  const passX = interpolate(f, [assist + 4, assist + 22], [180, 760], clamp);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#ffffff"
      set={<HockeyRink frame={f} goalLight={goalLight} cheer={f >= goal && f < goal + 90 ? 1 : 0} />}
      speakers={{moose: {x: 1820, y: 330}}}
      actors={[
        {who: 'finn', look: {...FINN_CA, hat: 'cap', hatColor: '#e5302f'}, x: 700, y: 900, facing: 1, pose: f < refund ? 'point' : f < goal + 40 ? 'up' : f < assist ? 'think' : 'fist', holding: undefined},
        ...(f >= assist ? [{who: 'ruth', look: RUTH_CA, x: 200, y: 900, facing: 1 as const, pose: 'wave' as const}] : []),
      ]}
      front={
        <>
          <HockeyNet x={NET.x} y={NET.y} s={1.4} />
          {f >= refund && f < assist && <Puck x={puckX} y={puckY} />}
          {f >= goal + 10 && f < assist && (
            <g transform={`translate(${puckX} ${puckY - 80})`}>
              <Coin x={0} y={0} r={34} />
              <text x={50} y={12} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#5fd38a" stroke={INK} strokeWidth={6} paintOrder="stroke">
                +bonus
              </text>
            </g>
          )}
          {f >= assist && <Puck x={passX} y={892} />}
          {f >= s.at('m104') - 10 && f < assist && (
            <g>
              <TaxMoose x={1820} y={780} s={0.8} frame={f} talk={s.mouth('moose')} mood="smug" arms="clip" flip />
              <rect x={1600} y={700} width={440} height={90} fill="#fdfdfd" stroke={INK} strokeWidth={4} />
              <text x={1820} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e5302f">
                🧾 RETIREMENT BOX
              </text>
            </g>
          )}
          <ImpactStars x={NET.x} y={NET.y - 100} t={f - goal} />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="CHEAT CODE #2: RRSP 🏒" color="#7fb3ff" dur={150} />
          <InfoCard t={f - s.at('f118') - 10} dur={refund - s.at('f118') + 5} x="72%" y="24%" w={580} color="#4f9dde" title="RRSP: put money in →">
            Your <b>taxable income goes down</b> ⬇ <br />→ maybe a <b>tax refund</b> 💸
          </InfoCard>
          <BigStat t={f - refund - 20} dur={s.at('m104') - refund - 20} text="$1,000 in → a few $100 back*" sub="*depends on your tax bracket" x="66%" y="16%" size={80} color="#5fd38a" />
          <SoundWord text="GOAL!!" t={f - goal} x={1400} y={260} color="#ff5b5b" size={140} />
          <InfoCard t={f - s.at('f120') - 6} dur={s.at('f121') - s.at('f120')} x="72%" y="22%" w={620} color="#e5302f" title="The catch 🫎">
            Taxed when you <b>take it out</b> — hopefully at a lower rate in retirement
          </InfoCard>
          <BigStat t={f - s.at('f121') - 20} dur={assist - s.at('f121') - 16} text="18% of income" sub="up to $33,810 for 2026" x="68%" y="18%" size={110} color="#7fb3ff" />
          <BigStat t={f - assist - 24} text="EMPLOYER MATCH = FREE MONEY 🎁" x="50%" y="18%" size={74} color="#f6c945" />
          <Flash t={f - goal} dur={8} color="#ffdddd" />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};


