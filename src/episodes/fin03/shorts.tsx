// fin03 original vertical Shorts (render the "-vertical" compositions): fin03s1 (TFSA in 60 s) and fin03s2 (start at 25 vs 35).
// Each ends with Finn's CTA (voice cta2 from finshorts): "Want the full video? Watch it on YouTube! The link is in the description and in my bio!"
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {Character} from '../../rig/Character';
import {DustPuff, ImpactStars, MotionLines, Sparkles, SoundWord, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {BigStat, Coin, Confetti, clamp, pop, ramp} from '../fin02/kit';
import {Beaver, BeaverPond, FINN_CA, Garage, IceHole, IceLake, RaceCar, TaxMoose} from './kit';
import {Counter, InfoCard} from './scenesA';
import {GrowthChart} from './scenesB';

const Hook: React.FC<{text: string; f: number; until: number}> = ({text, f, until}) =>
  f < until ? (
    <div style={{position: 'absolute', left: 50, right: 50, top: 110, transform: `scale(${pop(f, 10)})`, opacity: interpolate(f, [until - 8, until], [1, 0], clamp), background: '#e5302f', color: '#fff', border: `7px solid ${INK}`, borderRadius: 34, padding: '22px 30px', fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.1, textAlign: 'center', WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
      {text}
    </div>
  ) : null;

/** End card driven by the scene schedule (Finn says cta2). */
const CtaEnd: React.FC<{t: number}> = ({t}) => {
  const s = useScene();
  const f = s.frame;
  const inn = interpolate(t, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #5c1220 0%, #a8222b 55%, #e86a5f 100%)', overflow: 'hidden'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 1150) rotate(${f * 0.6})`} opacity={0.12}>
          {Array.from({length: 16}, (_, k) => (
            <path key={k} d="M 0 0 L -90 -1400 L 90 -1400 Z" fill="#fff" transform={`rotate(${k * 22.5})`} />
          ))}
        </g>
        <rect x={0} y={1720} width={1080} height={300} fill="#3a0d14" />
        <g transform={`translate(540 ${1720 + (1 - inn) * 300}) scale(2.0)`}>
          <Character uid="cta3-finn" look={FINN_CA} frame={f} mood="happy" talk={s.mouth('finn')} facing={1} pose={['down', 'wave']} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 70, right: 70, top: 120, transform: `scale(${inn})`, background: PAPER, border: `7px solid ${INK}`, borderRadius: 44, padding: '30px 40px', fontFamily: FONT, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: INK, textAlign: 'center', boxShadow: '10px 14px 0 rgba(0,0,0,0.3)'}}>
        Want the full video? Watch it on YouTube! 🎬
        <div style={{fontSize: 46, color: '#e5302f', marginTop: 14}}>🔗 Link in the description &amp; in my bio!</div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 520, transform: `translateX(-50%) scale(${inn * pulse})`, display: 'flex', alignItems: 'center', gap: 22, background: '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 58, padding: '24px 46px', borderRadius: 70, border: '7px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,0.4)', whiteSpace: 'nowrap'}}>
        <svg width={70} height={50} viewBox="0 0 54 38">
          <rect width={54} height={38} rx={10} fill="#fff" />
          <path d="M 21 10 L 37 19 L 21 28 Z" fill="#ff0033" />
        </svg>
        Full video on YouTube
      </div>
      <div style={{position: 'absolute', left: '50%', top: 680, transform: `translateX(-50%) scale(${inn})`, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>
        @finnomics_yt 🍁
      </div>
    </AbsoluteFill>
  );
};

// ============================================================== SHORT 1 – the TFSA cheat code
export const ShortTfsa: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const moose = s.cue('moose');
  const limit = s.cue('limit');
  const mistake = s.cue('mistake');
  const vroom = s.cue('vroom');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} />;
  const garage = f >= mistake;
  const mooseY = interpolate(f, [moose - 8, moose], [-800, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const startle = hop(f, moose + 2, 14, 90);
  const carX = f < vroom ? 900 : 900 + interpolate(f, [vroom, vroom + 22], [0, 1600], {...clamp, easing: Easing.in(Easing.cubic)});
  const carBack = f >= s.at('f205') ? interpolate(f, [s.at('f205'), s.at('f205') + 20], [-700, 900], {...clamp, easing: Easing.out(Easing.cubic)}) : null;
  let cam = garage
    ? camKeys(f, [
        {f: mistake, cam: {x: 820, y: 480, zoom: 1.35}},
        {f: vroom - 2, cam: {x: 820, y: 480, zoom: 1.3}},
        {f: vroom + 10, cam: {x: 760, y: 480, zoom: 1.25}, ease: Easing.out(Easing.cubic)},
        {f: s.at('m202') - 2, cam: {x: 760, y: 480, zoom: 1.25}},
        {f: s.at('m202') + 8, cam: {x: 1080, y: 460, zoom: 1.25}, ease: Easing.out(Easing.cubic)},
      ])
    : camKeys(f, [
        {f: 0, cam: {x: 700, y: 460, zoom: 1.6}},
        {f: moose, cam: {x: 900, y: 420, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
        {f: s.at('f202'), cam: {x: 900, y: 460, zoom: 1.35}},
        {f: limit, cam: {x: 760, y: 480, zoom: 1.45}},
      ]);
  cam = shake(cam, f, moose, 14, 16);
  cam = shake(cam, f, vroom, 12, 10);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim="#d8f0ff"
      set={garage ? <Garage frame={f} /> : <IceLake frame={f} hut={false} />}
      speakers={{moose: {x: garage ? 1400 : 1150, y: 340}}}
      actors={[
        {
          who: 'finn',
          look: FINN_CA,
          x: garage ? 560 : 620,
          y: 900 + (garage ? 0 : startle.dy),
          squash: garage ? 1 : startle.squash,
          facing: 1,
          pose: garage ? (f < vroom ? 'facepalm' : 'fist') : f < moose ? 'up' : f < limit ? 'point' : 'hips',
          mood: garage && f < vroom ? 'worried' : undefined,
        },
      ]}
      front={
        garage ? (
          <>
            {f < vroom + 30 && carBack === null && <RaceCar x={carX} y={900} s={0.85} frame={f} moving={f >= vroom} />}
            {carBack !== null && <RaceCar x={carBack} y={900} s={0.85} frame={f} moving={carBack < 890} label="INDEX" />}
            {f >= vroom && f < vroom + 30 && <MotionLines x={carX - 320} y={830} frame={f} dir={-1} len={260} />}
            <DustPuff x={700} y={900} t={f - vroom} n={8} dir={-1} />
            {f >= s.at('m202') - 10 && <TaxMoose x={1400} y={920} s={0.85} frame={f} talk={s.mouth('moose')} mood="sad" arms="down" flip />}
          </>
        ) : (
          <>
            <IceHole x={980} y={930} shield={ramp(f, s.at('f202'), s.at('f202') + 14)} frame={f} />
            {f >= moose - 8 && <TaxMoose x={1150} y={930 + mooseY} s={0.85} frame={f} talk={s.mouth('moose')} mood={f >= s.at('f202') ? 'angry' : 'smug'} arms="clip" flip />}
            <DustPuff x={1150} y={930} t={f - moose} n={10} />
            {f >= s.at('f202') && Array.from({length: 3}, (_, i) => <Coin key={i} x={980 + Math.sin(f / 10 + i * 2) * 80} y={800 - ((f * 2 + i * 50) % 160)} r={20} />)}
          </>
        )
      }
      overlay={
        <>
          <Hook text="🇨🇦 The TFSA cheat code (most people waste it)" f={f} until={s.at('f202')} />
          <SoundWord text="THUD!" t={f - moose} x={760} y={520} color="#ff8f73" size={110} />
          <InfoCard t={f - s.at('f202') - 10} dur={limit - s.at('f202')} x="50%" y="16%" w={880} color="#5fb37a" title="TFSA = Tax-Free 🛡️" rot={-1}>
            Growth inside: <b>$0 tax</b> · Take it out: <b>$0 tax</b>
          </InfoCard>
          <BigStat t={f - limit} dur={mistake - limit} text="$7,000/yr" sub="2026 limit" x="50%" y="10%" size={110} color="#5fd38a" rot={-3} />
          <Counter t={f - limit - 70} from={7000} to={109000} dur={50} hold={mistake - limit - 70} x="50%" y="23%" size={110} sub="room if 18+ since 2009 & never used" />
          <BigStat t={f - mistake} dur={vroom - mistake} text="PARKED @ 0.5% 🅿️" sub="cash-only TFSA = car in the garage" x="50%" y="14%" size={90} color="#ff8f73" rot={-3} />
          <SoundWord text="VROOOM!" t={f - vroom} x={600} y={420} color="#ff8f73" size={120} />
          <BigStat t={f - s.at('f205') - 10} text="LOW-COST INDEX FUNDS 📈" sub="what many long-term investors use" x="50%" y="12%" size={70} color="#5fd38a" rot={-3} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// ============================================================== SHORT 2 – start at 25 vs 35
export const ShortBeaver: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const race = s.cue('race');
  const late = s.cue('late');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} />;
  const dam = interpolate(f, [0, cta], [0.15, 1], clamp);
  const chartP = ramp(f, race + 6, s.at('f213') + 20);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1300, y: 460, zoom: 1.7}},
    {f: s.at('f211'), cam: {x: 1000, y: 480, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
    {f: s.at('b201'), cam: {x: 1300, y: 500, zoom: 1.6}},
    {f: s.at('f212'), cam: {x: 1000, y: 540, zoom: 1.3}},
    {f: s.at('b202') - 2, cam: {x: 1000, y: 540, zoom: 1.3}},
    {f: s.at('b202') + 6, cam: {x: 1350, y: 500, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f215'), cam: {x: 1000, y: 500, zoom: 1.35}},
  ]);
  cam = drift(cam, f, 0.5);
  const showChart = f >= race && f < s.at('b202');
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim="#fff0c0"
      set={<BeaverPond frame={f} dam={dam} damX={1400} />}
      speakers={{bernie: {x: 1300, y: 600}}}
      actors={[{who: 'finn', look: FINN_CA, x: 780, y: 900, facing: 1, pose: f < race ? 'point' : f < late ? 'up' : f < s.at('f215') ? 'shrug' : 'fist', mood: f >= s.at('f213') && f < late ? 'surprised' : undefined}]}
      front={
        <>
          <Beaver x={1300} y={900} s={1.0} frame={f} talk={s.mouth('bernie')} mood={f >= s.at('b202') ? 'wise' : 'happy'} arms={f < s.at('f211') ? 'stick' : 'wave'} />
          {f >= s.at('f212') && f < race + 10 && (
            <g opacity={interpolate(f, [s.at('f212'), s.at('f212') + 10], [0, 1], clamp)}>
              <Beaver x={1140} y={900} s={0.75} frame={f + 30} mood="happy" arms="up" stick={false} />
              <text x={1140} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">
                cousin 😴
              </text>
            </g>
          )}
          <DustPuff x={1400} y={880} t={(f % 40)} n={3} />
        </>
      }
      overlay={
        <>
          <Hook text="Same money. Same job. ONE got rich. 🦫" f={f} until={s.at('b201')} />
          {f < s.at('f211') && <SoundWord text="TOK! TOK! TOK!" t={f} x={540} y={600} color="#f6c945" size={90} />}
          <BigStat t={f - s.at('f212') - 6} dur={race - s.at('f212')} text="$7,000/yr · 7%/yr · until 65" x="50%" y="12%" size={60} color="#fff" rot={-2} />
          {showChart && (
            <div style={{position: 'absolute', left: '50%', top: '20%', transform: `translate(-50%,-50%) scale(${pop(f - race, 12) * 0.98})`}}>
              <GrowthChart p={chartP} showLate={f >= late} w={900} h={560} />
            </div>
          )}
          <Counter t={f - s.at('f213') - 20} from={280000} to={1397000} dur={40} hold={late - s.at('f213') - 20} x="50%" y="88%" size={110} color="#5fd38a" sub="Bernie (start 25) · put in $280K" />
          {f >= s.at('f213') + 20 && f < late && <Confetti t={f - s.at('f213') - 20} />}
          <BigStat t={f - late} dur={s.at('b202') - late} text="≈ $661,000 😬" sub="cousin (start 35) · less than half" x="50%" y="88%" size={110} color="#ff8f73" />
          <BigStat t={f - s.at('f215') - 6} text="TIME = THE CHEAT CODE ⏳" sub="(7% is not guaranteed)" x="50%" y="14%" size={70} color="#f6c945" rot={-3} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};


