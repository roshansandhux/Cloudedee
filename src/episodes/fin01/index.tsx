// fin01 – 10-second finance explainer sample. Finn sits on an office chair in a motion-graphics studio
// and explains compound interest with coin characters, a rocketing chart and a very empty piggy bank.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import type {EpisodeDef} from '../../engine/episode';
import type {VoiceManifest} from '../../engine/timeline';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, shake} from '../../stage/camera';
import {Emote, Flash, ImpactStars, Sparkles, SoundWord, SweatDrop, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import voices from '../../generated/voices/fin01.json';
import {s1} from './script';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const backOut = Easing.out(Easing.back(1.8));
const pop = (t: number, dur = 10) => interpolate(t, [0, dur], [0, 1], {...clamp, easing: backOut});

const FINN = {x: 560, y: 862};
const PANEL = {x: 1010, y: 150, w: 800, h: 620};

// ---------------------------------------------------------------- set
const Studio: React.FC<{frame: number}> = ({frame}) => {
  const rays = Array.from({length: 18}, (_, i) => i);
  const symbols = ['$', '%', '$', '¢', '$', '%', '$', '¢', '$', '%'];
  return (
    <g>
      <defs>
        <linearGradient id="fin-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a1f5c" />
          <stop offset="0.55" stopColor="#1d5f7a" />
          <stop offset="1" stopColor="#1f8f7a" />
        </linearGradient>
        <radialGradient id="fin-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fin-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173b52" />
          <stop offset="1" stopColor="#0e2233" />
        </linearGradient>
        <pattern id="fin-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2" />
        </pattern>
      </defs>
      <rect x={-400} y={-300} width={2720} height={1700} fill="url(#fin-bg)" />
      <rect x={-400} y={-300} width={2720} height={1700} fill="url(#fin-grid)" />
      {/* slowly spinning sunburst behind Finn */}
      <g transform={`translate(${FINN.x} 560) rotate(${frame * 0.25})`} opacity={0.12}>
        {rays.map((i) => (
          <path key={i} d="M 0 0 L -70 -1100 L 70 -1100 Z" fill="#ffffff" transform={`rotate(${i * 20})`} />
        ))}
      </g>
      <circle cx={FINN.x} cy={560} r={420} fill="url(#fin-glow)" />
      {/* floating money symbols */}
      {symbols.map((sym, i) => {
        const x = ((i * 233 + frame * (0.6 + (i % 3) * 0.25)) % 2200) - 140;
        const y = 120 + ((i * 97) % 520) + Math.sin(frame / 25 + i) * 18;
        return (
          <text key={i} x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={50 + (i % 4) * 22} fill="#ffffff" opacity={0.1} transform={`rotate(${Math.sin(frame / 40 + i) * 12} ${x} ${y})`}>
            {sym}
          </text>
        );
      })}
      {/* glossy floor */}
      <rect x={-400} y={880} width={2720} height={600} fill="url(#fin-floor)" />
      <rect x={-400} y={880} width={2720} height={6} fill="#3fd0b0" opacity={0.7} />
      <ellipse cx={FINN.x} cy={905} rx={260} ry={26} fill="#3fd0b0" opacity={0.12} />
    </g>
  );
};

// ---------------------------------------------------------------- office chair (behind Finn)
const OfficeChair: React.FC<{x: number; frame: number}> = ({x, frame}) => {
  const swivel = Math.sin(frame / 18) * 3;
  return (
    <g transform={`translate(${x} 0)`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <ellipse cx={0} cy={902} rx={120} ry={14} fill="rgba(0,0,0,0.3)" stroke="none" />
      {/* star base + wheels */}
      <path d="M -105 878 L 105 878" strokeWidth={12} stroke="#2e2e3e" />
      <path d="M -60 872 L 60 872" strokeWidth={10} stroke="#45455a" />
      {[-105, -45, 45, 105].map((wx) => (
        <circle key={wx} cx={wx} cy={890} r={11} fill="#1f1f2b" />
      ))}
      {/* gas lift */}
      <rect x={-9} y={812} width={18} height={62} fill="#9aa3b5" />
      <g transform={`rotate(${swivel} 0 800)`}>
        {/* backrest */}
        <rect x={-108} y={560} width={70} height={230} rx={30} fill="#e8553e" />
        <rect x={-96} y={578} width={46} height={190} rx={22} fill="#ff7a5c" stroke="none" opacity={0.7} />
        <rect x={-80} y={770} width={16} height={40} fill="#45455a" />
        {/* seat */}
        <rect x={-95} y={788} width={200} height={34} rx={16} fill="#e8553e" />
        <rect x={-85} y={792} width={170} height={10} rx={5} fill="#ff8f73" stroke="none" />
        {/* armrest */}
        <path d="M 70 790 L 70 740 L 120 740" fill="none" strokeWidth={10} stroke="#45455a" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- coin characters
const Coin: React.FC<{x: number; y: number; r: number; frame: number; baby?: boolean; mood?: 'happy' | 'wow'; rot?: number}> = ({x, y, r, frame, baby, mood = 'happy', rot = 0}) => {
  const blink = (frame + Math.round(x)) % 80 < 4;
  const sw = baby ? 3 : 5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={INK} strokeWidth={sw}>
      <ellipse cx={r * 0.12} cy={r * 0.08} rx={r} ry={r} fill="#c98a12" />
      <circle r={r} fill="#f6c945" />
      <circle r={r * 0.8} fill="none" stroke="#e0a81e" strokeWidth={sw * 1.4} />
      <path d={`M ${-r * 0.55} ${-r * 0.45} A ${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.2} ${-r * 0.72}`} fill="none" stroke="#fff6c9" strokeWidth={sw * 1.6} strokeLinecap="round" />
      {/* face */}
      {blink ? (
        <>
          <path d={`M ${-r * 0.4} ${-r * 0.1} h ${r * 0.2}`} strokeLinecap="round" />
          <path d={`M ${r * 0.2} ${-r * 0.1} h ${r * 0.2}`} strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={-r * 0.3} cy={-r * 0.1} rx={r * 0.1} ry={r * (mood === 'wow' ? 0.17 : 0.13)} fill={INK} stroke="none" />
          <ellipse cx={r * 0.3} cy={-r * 0.1} rx={r * 0.1} ry={r * (mood === 'wow' ? 0.17 : 0.13)} fill={INK} stroke="none" />
          <circle cx={-r * 0.27} cy={-r * 0.16} r={r * 0.04} fill="#fff" stroke="none" />
          <circle cx={r * 0.33} cy={-r * 0.16} r={r * 0.04} fill="#fff" stroke="none" />
        </>
      )}
      <circle cx={-r * 0.55} cy={r * 0.15} r={r * 0.12} fill="#ff9a8a" stroke="none" opacity={0.7} />
      <circle cx={r * 0.55} cy={r * 0.15} r={r * 0.12} fill="#ff9a8a" stroke="none" opacity={0.7} />
      {baby ? (
        // pacifier
        <g>
          <circle cx={0} cy={r * 0.34} r={r * 0.22} fill="#ff8fb3" />
          <circle cx={0} cy={r * 0.34} r={r * 0.08} fill="#ffd1e0" />
          <path d={`M ${-r * 0.12} ${r * 0.56} a ${r * 0.12} ${r * 0.12} 0 1 0 ${r * 0.24} 0`} fill="none" />
        </g>
      ) : mood === 'wow' ? (
        <ellipse cx={0} cy={r * 0.35} rx={r * 0.14} ry={r * 0.18} fill="#7a2d3a" />
      ) : (
        <path d={`M ${-r * 0.28} ${r * 0.25} Q 0 ${r * 0.6} ${r * 0.28} ${r * 0.25} Z`} fill="#7a2d3a" />
      )}
    </g>
  );
};

// ---------------------------------------------------------------- the explainer panel
const PanelFrame: React.FC<{title: string; color: string; children: React.ReactNode; s: number}> = ({title, color, children, s}) => (
  <g transform={`translate(${PANEL.x + PANEL.w / 2} ${PANEL.y + PANEL.h / 2}) scale(${s}) translate(${-PANEL.w / 2} ${-PANEL.h / 2})`}>
    <rect x={14} y={18} width={PANEL.w} height={PANEL.h} rx={36} fill="rgba(0,0,0,0.25)" />
    <rect width={PANEL.w} height={PANEL.h} rx={36} fill={PAPER} stroke={INK} strokeWidth={6} />
    <path d={`M 0 36 A 36 36 0 0 1 36 0 H ${PANEL.w - 36} A 36 36 0 0 1 ${PANEL.w} 36 V 84 H 0 Z`} fill={color} stroke={INK} strokeWidth={6} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={40 + i * 34} cy={42} r={10} fill={['#ff6b6b', '#f6c945', '#5fd38a'][i]} stroke={INK} strokeWidth={3} />
    ))}
    <text x={PANEL.w / 2} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
      {title}
    </text>
    {children}
  </g>
);

/** Phase A – Mama coin has baby coins. */
const BabyMoney: React.FC<{t: number; birth: number; frame: number}> = ({t, birth, frame}) => {
  const cx = PANEL.w / 2;
  const bob = Math.sin(frame / 7) * 6;
  const babies = [
    {x: cx - 230, y: 470, d: 0},
    {x: cx + 230, y: 470, d: 5},
    {x: cx, y: 520, d: 10},
  ];
  return (
    <g>
      <Coin x={cx} y={300 + bob} r={120 * pop(t, 12)} frame={frame} mood={t - birth > 0 ? 'wow' : 'happy'} />
      {babies.map((b, i) => {
        const bt = t - birth - b.d;
        if (bt < 0) return null;
        const hop = Math.abs(Math.sin((frame + i * 9) / 6)) * 18;
        return <Coin key={i} x={interpolate(bt, [0, 8], [cx, b.x], clamp)} y={interpolate(bt, [0, 8], [320, b.y], {...clamp, easing: Easing.out(Easing.quad)}) - hop} r={55 * pop(bt, 9)} frame={frame} baby rot={Math.sin((frame + i * 20) / 8) * 10} />;
      })}
      {t - birth > 0 && <Emote x={cx + 120} y={170} t={t - birth} kind="heart" dur={70} />}
      {t > 15 && (
        <text x={cx} y={PANEL.h - 30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK} opacity={interpolate(t, [15, 25], [0, 1], clamp)}>
          money + interest = MORE money
        </text>
      )}
    </g>
  );
};

/** Phase B – exponential chart, bars of coins, a rocket that leaves the building. */
const Chart: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const x0 = 90;
  const x1 = PANEL.w - 70;
  const yb = PANEL.h - 80;
  const yt = 140;
  const k = 3.6;
  const curve = (u: number) => yb - (yb - yt) * ((Math.exp(k * u) - 1) / (Math.exp(k) - 1));
  const draw = interpolate(t, [4, 60], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pts = Array.from({length: 41}, (_, i) => i / 40).filter((u) => u <= draw + 1e-6);
  const d = pts.map((u, i) => `${i ? 'L' : 'M'} ${x0 + (x1 - x0) * u} ${curve(u)}`).join(' ');
  const tipU = draw;
  const tip = {x: x0 + (x1 - x0) * tipU, y: curve(tipU)};
  const launch = t - 64; // rocket blasts off the top of the panel
  const rx = tip.x + Math.max(0, launch) * 14;
  const ry = tip.y - Math.max(0, launch) * Math.max(0, launch) * 3.2;
  const bars = [0.12, 0.3, 0.48, 0.66, 0.84];
  return (
    <g>
      {/* grid + axes */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={x0} x2={x1} y1={yb - (yb - yt) * g} y2={yb - (yb - yt) * g} stroke="#d9cfe8" strokeWidth={3} strokeDasharray="10 10" />
      ))}
      <path d={`M ${x0} ${yt - 20} V ${yb} H ${x1 + 20}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <text x={x0 - 18} y={yt + 10} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#1f8f7a">$$$</text>
      <text x={x1} y={yb + 50} textAnchor="end" fontFamily={FONT} fontWeight={600} fontSize={28} fill="#6b6280">time →</text>
      {/* coin-stack bars */}
      {bars.map((u, i) => {
        const bt = t - 8 - i * 7;
        if (bt < 0) return null;
        const h = (yb - curve(u)) * 0.85 * pop(bt, 12);
        const n = Math.max(1, Math.floor(h / 22));
        return (
          <g key={i}>
            {Array.from({length: n}, (_, j) => (
              <ellipse key={j} cx={x0 + (x1 - x0) * u} cy={yb - 12 - j * 22} rx={34} ry={12} fill={j % 2 ? '#f6c945' : '#e9b52c'} stroke={INK} strokeWidth={3} />
            ))}
          </g>
        );
      })}
      {/* the line */}
      <path d={d} fill="none" stroke="#ffffff" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#18b57a" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      {/* rocket riding the tip */}
      {draw > 0.02 && ry > -900 && (
        <g transform={`translate(${rx} ${ry}) rotate(${launch > 0 ? -20 : -35 - draw * 20})`}>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-50 - i * 26} cy={Math.sin(frame + i) * 5} r={14 - i * 3 + Math.abs(Math.sin(frame * 0.9 + i)) * 6} fill={i ? '#ffb347' : '#fff2a0'} opacity={0.9} />
          ))}
          <path d="M -40 -18 L 30 -18 Q 60 0 30 18 L -40 18 Z" fill="#f2f2f7" stroke={INK} strokeWidth={4} />
          <path d="M 30 -18 Q 60 0 30 18 Z" fill="#e8553e" stroke={INK} strokeWidth={4} />
          <path d="M -40 -18 L -56 -34 L -26 -18 Z M -40 18 L -56 34 L -26 18 Z" fill="#e8553e" stroke={INK} strokeWidth={4} />
          <circle cx={4} cy={0} r={8} fill="#7fd3ff" stroke={INK} strokeWidth={3} />
        </g>
      )}
      {launch > 0 && launch < 40 && <ImpactStars x={tip.x} y={tip.y} t={launch} s={0.6} />}
      {/* baby coins riding the curve */}
      {[0.25, 0.5, 0.75].map((u, i) =>
        draw > u ? <Coin key={i} x={x0 + (x1 - x0) * u} y={curve(u) - 46 - Math.abs(Math.sin((frame + i * 7) / 5)) * 14} r={28} frame={frame} baby rot={Math.sin(frame / 6 + i) * 12} /> : null,
      )}
    </g>
  );
};

/** Phase C – upside-down piggy bank, $0.00 and a moth. */
const BrokePiggy: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const flip = interpolate(t, [6, 18], [0, 180], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const shakeA = t > 18 ? Math.sin(t * 1.6) * 10 * interpolate(t, [18, 60], [1, 0.3], clamp) : 0;
  const cx = PANEL.w / 2;
  const cy = 300;
  const mt = t - 26; // moth escapes
  const mx = cx + Math.max(0, mt) * 5 + Math.sin(mt / 4) * 30;
  const my = cy + 90 - Math.max(0, mt) * 4.5 + Math.cos(mt / 3) * 16;
  const wing = Math.abs(Math.sin(frame * 0.9));
  const zeroBlink = Math.floor(frame / 8) % 2 === 0;
  return (
    <g>
      <g transform={`translate(${cx} ${cy}) rotate(${flip + shakeA})`} stroke={INK} strokeWidth={5}>
        <ellipse cx={0} cy={0} rx={150} ry={112} fill="#ff9ec4" />
        <ellipse cx={-30} cy={-40} rx={70} ry={30} fill="#ffc4dc" stroke="none" opacity={0.7} />
        <path d="M -70 -95 L -50 -150 L -20 -105 Z" fill="#ff86b2" />
        <path d="M 30 -105 L 60 -150 L 70 -95 Z" fill="#ff86b2" />
        <ellipse cx={150} cy={10} rx={34} ry={40} fill="#ff86b2" />
        <circle cx={145} cy={0} r={6} fill={INK} stroke="none" />
        <circle cx={145} cy={22} r={6} fill={INK} stroke="none" />
        <path d="M 70 -30 q 12 -10 24 0" fill="none" strokeLinecap="round" />
        <rect x={-30} y={-116} width={70} height={12} rx={6} fill={INK} />
        {[-90, -30, 40, 95].map((lx) => (
          <rect key={lx} x={lx - 16} y={88} width={32} height={46} rx={10} fill="#ff86b2" />
        ))}
        <path d="M -150 0 q -40 -20 -30 -50 q 20 20 0 30" fill="none" strokeLinecap="round" />
      </g>
      {/* dust from the slot */}
      {t > 18 &&
        [0, 1, 2, 3].map((i) => {
          const dt = t - 18 - i * 6;
          if (dt < 0 || dt > 30) return null;
          return <circle key={i} cx={cx - 10 + i * 8 + dt * (i % 2 ? 1 : -1)} cy={cy + 120 + dt * 3} r={10 + dt * 0.4} fill="#cbbfa8" opacity={interpolate(dt, [0, 30], [0.8, 0], clamp)} />;
        })}
      {mt > 0 && my > 90 && (
        <g transform={`translate(${mx} ${my})`} stroke={INK} strokeWidth={3}>
          <ellipse cx={-14} cy={-10} rx={22} ry={16 * wing + 3} fill="#b9ae9e" transform="rotate(-25 -14 -10)" />
          <ellipse cx={14} cy={-10} rx={22} ry={16 * wing + 3} fill="#cfc4b4" transform="rotate(25 14 -10)" />
          <ellipse cx={0} cy={0} rx={8} ry={18} fill="#8d8273" />
          <path d="M -3 -16 q -8 -14 -16 -12 M 3 -16 q 8 -14 16 -12" fill="none" />
        </g>
      )}
      <text x={cx} y={PANEL.h - 60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={86} fill={zeroBlink ? '#e8553e' : '#ff8f73'} stroke={INK} strokeWidth={6} paintOrder="stroke">
        $0.00
      </text>
      {/* cobweb in the corner */}
      <path d="M 0 84 L 90 84 M 0 84 L 0 174 M 0 84 L 70 154 M 30 84 Q 22 112 0 114 M 60 84 Q 46 130 0 144" stroke="#9b93ab" strokeWidth={2} fill="none" opacity={interpolate(t, [20, 34], [0, 1], clamp)} />
    </g>
  );
};

// ---------------------------------------------------------------- screen-space graphics
const TitleChip: React.FC<{frame: number}> = ({frame}) => {
  const a = pop(frame, 12);
  const b = pop(frame - 5, 12);
  return (
    <div style={{position: 'absolute', left: 70, top: 70, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 18}}>
      <div style={{background: '#f6c945', color: INK, fontWeight: 700, fontSize: 46, padding: '8px 26px', borderRadius: 18, border: `5px solid ${INK}`, transform: `scale(${a}) rotate(-4deg)`, boxShadow: '6px 8px 0 rgba(0,0,0,0.3)'}}>MONEY 101</div>
      <div style={{color: '#fff', fontWeight: 700, fontSize: 44, WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill', transform: `translateX(${(1 - b) * -60}px)`, opacity: Math.min(1, b)}}>Compound Interest</div>
    </div>
  );
};

const EndCard: React.FC<{t: number}> = ({t}) => {
  if (t < 0) return null;
  const s = pop(t, 10);
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 120, transform: `translateX(-50%) scale(${s}) rotate(-2deg)`, fontFamily: FONT, background: '#18b57a', color: '#fff', border: `6px solid ${INK}`, borderRadius: 26, padding: '14px 40px', fontWeight: 700, fontSize: 54, whiteSpace: 'nowrap', boxShadow: '8px 10px 0 rgba(0,0,0,0.35)'}}>
      Start saving early. <span style={{color: '#fff3a0'}}>(Unlike Finn.)</span>
    </div>
  );
};

// ---------------------------------------------------------------- the shot
const Explainer: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const f01 = s.at('f01');
  const chart = s.at('chart');
  const broke = s.at('broke');
  const endT = s.at('end');
  const more = s.at('f02') + 68; // "MORE babies!"
  const birth = f01 + 85; // "...makes baby money"

  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.18}},
    {f: 14, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: chart - 2, cam: {x: 990, y: 540, zoom: 1.04}},
    {f: chart + 8, cam: {x: 1180, y: 500, zoom: 1.22}, ease: Easing.out(Easing.back(1.3))},
    {f: more - 2, cam: {x: 1180, y: 500, zoom: 1.24}},
    {f: more + 5, cam: {x: 1060, y: 470, zoom: 1.4}, ease: Easing.out(Easing.back(2))},
    {f: broke - 1, cam: {x: 1060, y: 480, zoom: 1.36}},
    {f: broke + 1, cam: {x: 1010, y: 520, zoom: 1.08}},
    {f: endT, cam: {x: 1010, y: 530, zoom: 1.16}, ease: Easing.inOut(Easing.sin)},
    {f: endT + 12, cam: {x: 980, y: 540, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = shake(drift(cam, f, 0.6), f, more, 14, 10);

  const phase = f < chart ? 'A' : f < broke ? 'B' : 'C';
  const phaseStart = phase === 'A' ? f01 - 6 : phase === 'B' ? chart : broke;
  const panelS = pop(f - phaseStart, 10);
  const pose = phase === 'A' ? (f > birth ? 'point' : 'think') : phase === 'B' ? (f > more ? 'up' : 'point') : 'shrug';
  const spin = phase === 'B' && f > more ? Math.sin((f - more) / 3) * 4 : 0;

  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 2.2}}
      rim="#7ff0d0"
      set={<Studio frame={f} />}
      actors={[
        {
          who: 'finn',
          x: FINN.x,
          y: FINN.y,
          facing: 1,
          sitting: true,
          pose: pose as 'point',
          lean: spin,
          mood: phase === 'C' ? 'sad' : 'happy',
          look2: phase === 'C' ? {x: 0.1, y: 0.3} : {x: 0.8, y: -0.1},
        },
      ]}
      front={
        <>
          {f >= f01 - 6 && (
            <PanelFrame title={phase === 'A' ? 'Interest = baby money' : phase === 'B' ? 'Babies have babies!' : 'My savings'} color={phase === 'C' ? '#e8553e' : phase === 'B' ? '#18b57a' : '#7b5ea7'} s={panelS}>
              {phase === 'A' && <BabyMoney t={f - f01} birth={birth - f01} frame={f} />}
              {phase === 'B' && <Chart t={f - chart} frame={f} />}
              {phase === 'C' && <BrokePiggy t={f - broke} frame={f} />}
            </PanelFrame>
          )}
          {phase === 'A' && <Sparkles x={PANEL.x + PANEL.w / 2} y={PANEL.y + 300} t={f - birth} r={200} />}
          {phase === 'B' && <Sparkles x={1600} y={260} t={f - more} r={160} />}
          {phase === 'C' && <SweatDrop x={FINN.x + 70} y={FINN.y - 430} t={f - broke - 30} />}
        </>
      }
      overlay={
        <>
          <TitleChip frame={f} />
          <SoundWord text="KA-CHING!" t={f - more - 6} x={1500} y={220} color="#5fd38a" rot={-10} size={130} />
          <SoundWord text="*cricket*" t={f - broke - 52} x={1520} y={950} color="#c9c2d9" rot={6} size={64} />
          <Flash t={f - more} dur={6} color="#fff6c9" />
          <EndCard t={f - endT} />
          <Vignette amount={0.35} />
        </>
      }
    >
      <OfficeChair x={FINN.x - 10} frame={f} />
    </Stage>
  );
};

export const fin01: EpisodeDef = {
  id: 'fin01',
  number: 1,
  title: 'Money 101 – Compound Interest (sample)',
  voices: voices as VoiceManifest,
  scenes: [{id: 'explainer', title: 'Compound interest', steps: s1, View: Explainer, tail: 0.2}],
};
