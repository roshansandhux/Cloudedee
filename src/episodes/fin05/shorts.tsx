// fin05 original vertical Shorts (render "-vertical"): fin05s1 (the dealer's favorite question) and fin05s2 (Grandma's car payment trick).
// Chunk captions; each ends with Finn's CTA (cta3, owner's voice) on the shared end card.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop} from '../../stage/camera';
import {Emote, Sparkles, SoundWord} from '../../fx/fx';
import {clamp, pop} from '../fin02/kit';
import {CtaEnd} from '../fin03/shorts';
import {BarRow, Betsy, FINN_05, GlassCard, Highway, Limo, NEON, NeonGrade, NeonStat, NeonTag, RUTH_05, RuthStreet, SavingsJar, ShinyCar, Showroom, VINNY} from './kit';
import {NeonCounter} from './scenesB';

const Hook: React.FC<{text: string; f: number; until: number; color?: string}> = ({text, f, until, color = NEON.pink}) =>
  f < until ? <NeonTag t={f} dur={until} text={text} x="50%" y="9%" color={color} size={44} rot={-3} /> : null;

// ============================================================== SHORT 1 – the dealer's favorite question
export const ShortDealer: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const car = s.cue('car');
  const stretch = s.cue('stretch');
  const limo = s.cue('limo');
  const rules = s.cue('rules');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} look={FINN_05} />;
  const road = f >= limo && f < s.at('f604');
  const len = interpolate(f, [limo, limo + 40], [200, 900], {...clamp, easing: Easing.out(Easing.back(1.2))});
  let cam = road
    ? camKeys(f, [{f: limo, cam: {x: 1000, y: 560, zoom: 1.0}}])
    : camKeys(f, [
        {f: 0, cam: {x: 1250, y: 520, zoom: 1.6}},
        {f: s.at('f601'), cam: {x: 700, y: 540, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
        {f: car, cam: {x: 900, y: 560, zoom: 1.25}, ease: Easing.out(Easing.cubic)},
        {f: s.at('f604'), cam: {x: 800, y: 540, zoom: 1.4}},
        {f: s.at('v603'), cam: {x: 1250, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
      ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim="#fff0c8"
      set={
        road ? (
          <Highway frame={f} speed={0.6} />
        ) : (
          <>
            <Showroom frame={f} />
            <ShinyCar x={950} y={880} s={0.95} color="#e5302f" />
          </>
        )
      }
      actors={
        road
          ? [{who: 'vinny', look: VINNY, x: 1050, y: 930, facing: -1, pose: 'up', scale: 0.85}]
          : [
              {who: 'vinny', look: VINNY, x: 1250, y: 900, facing: -1, pose: f < s.at('f601') ? 'wave' : f < s.at('v603') ? 'hips' : 'facepalm', mood: f >= s.at('v603') ? 'sad' : undefined},
              {who: 'finn', look: FINN_05, x: 700, y: 900, facing: 1, pose: f < car ? 'think' : f < rules ? 'point' : 'cross'},
            ]
      }
      front={road ? <Limo x={1000} y={960} len={len} frame={f} s={0.8} /> : <Emote x={1250} y={420} t={f - s.at('v603')} kind="..." dur={50} />}
      overlay={
        <>
          <Hook text="🚗 Never answer this question" f={f} until={s.at('f601')} />
          {f >= car && f < s.at('v602') && (
            <GlassCard t={f - car} x="50%" y="24%" w={900} color={NEON.orange} title="$40,000 car @ 7%">
              <BarRow t={f - car - 10} label="4 yrs · $958/mo" value="$5,977 interest" frac={0.56} color={NEON.lime} />
              <BarRow t={f - stretch - 10} label="7 yrs · $604/mo" value="$10,711 interest" frac={1} color={NEON.red} />
            </GlassCard>
          )}
          <NeonStat t={f - s.at('v602') - 4} dur={s.at('f604') - s.at('v602')} text="LOWER PAYMENT!" sub="(more interest)" x="50%" y="14%" size={96} color={NEON.gold} />
          <GlassCard t={f - rules + 8} x="50%" y="22%" w={900} color={NEON.lime} title="before you buy">
            <div>1️⃣ negotiate the TOTAL price</div>
            <div>2️⃣ keep the loan short</div>
            <div>3️⃣ get pre-approved first 🏦</div>
          </GlassCard>
          <NeonGrade amount={0.6} />
        </>
      }
    />
  );
};

// ============================================================== SHORT 2 – Grandma's car payment trick
export const ShortRuth: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const betsy = s.cue('betsy');
  const jar = s.cue('jar');
  const grow = s.cue('grow');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} look={FINN_05} />;
  const h = hop(f, betsy, 14, 30);
  const fill = interpolate(f, [jar, grow + 60], [0.1, 0.95], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 720, y: 520, zoom: 1.7}},
    {f: betsy, cam: {x: 1100, y: 540, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f611'), cam: {x: 500, y: 540, zoom: 1.6}},
    {f: s.at('u602'), cam: {x: 720, y: 520, zoom: 1.7}},
    {f: jar, cam: {x: 1250, y: 560, zoom: 1.4}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f614'), cam: {x: 560, y: 540, zoom: 1.6}},
    {f: s.at('u603'), cam: {x: 720, y: 520, zoom: 1.75}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim="#fff4c8"
      set={
        <>
          <RuthStreet frame={f} />
          <g transform={`translate(0 ${h.dy})`}>
            <Betsy x={1200} y={900} s={0.95} frame={f} puff={f >= betsy && f < betsy + 80 ? 1 : 0} />
          </g>
        </>
      }
      actors={[
        {who: 'ruth', look: RUTH_05, x: 720, y: 900, facing: -1, pose: f < betsy ? 'wave' : f < jar ? 'point' : 'hips', mood: f >= s.at('u603') ? 'smug' : undefined},
        {who: 'finn', look: FINN_05, x: 450, y: 900, facing: 1, pose: f < jar ? 'think' : f < grow ? 'point' : 'up'},
      ]}
      front={
        <>
          {f >= jar && <SavingsJar x={1350} y={900} s={pop(f - jar, 14) * 1.0 + 0.01} fill={fill} />}
          {f >= jar && <Sparkles x={1350} y={720} t={(f - jar) % 40} r={120} />}
          <SoundWord text="HONK!" t={f - betsy} x={1300} y={480} color={NEON.gold} size={100} />
        </>
      }
      overlay={
        <>
          <Hook text="👵 Grandma's car payment trick" f={f} until={s.at('f611')} />
          <NeonStat t={f - s.at('f611') - 20} dur={s.at('u602') - s.at('f611')} text="2009 · NO LOAN" sub="still makes a payment?!" x="50%" y="14%" size={90} color={NEON.lime} />
          <GlassCard t={f - s.at('f612') - 6} dur={grow - s.at('f612')} x="50%" y="22%" w={900} color={NEON.lime} title="pay yourself">
            <div>✅ car paid off</div>
            <div>➡️ same payment → SAVINGS</div>
            <div style={{color: NEON.lime}}>🚗 next car: cash · no interest</div>
          </GlassCard>
          <NeonCounter t={f - grow - 10} from={0} to={130000} dur={70} x="50%" y="14%" size={120} sub="$750/mo · 10 yrs · ~7%" hold={s.at('f614') - grow} />
          <NeonTag t={f - s.at('f614')} dur={s.at('u603') + 20 - s.at('f614')} text="NOT GUARANTEED" x="50%" y="12%" color={NEON.orange} size={64} />
          <NeonTag t={f - s.at('u603') - 10} text="THE BANK PAYS HER 💅" x="50%" y="14%" color={NEON.pink} size={64} />
          <NeonGrade warm amount={0.5} />
        </>
      }
    />
  );
};
