// fin04 original vertical Shorts (render the "-vertical" compositions): fin04s1 (your $100 is melting) and fin04s2 (shrinkflation).
// Chunk captions (no bubbles). Each ends with Finn's CTA (cta2) on the shared end card.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {DustPuff, Sparkles, SoundWord, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {lookOf} from '../../cast';
import {BigStat, clamp, pop, ramp} from '../fin02/kit';
import {CtaEnd} from '../fin03/shorts';
import {Counter} from '../fin03/scenesA';
import {Boardwalk, CerealBox, ChipBag, CornerStore, FINN_04, Grocery, IceCream, Inflato, StoreCounter} from './kit';

const Hook: React.FC<{text: string; f: number; until: number; color?: string}> = ({text, f, until, color = '#ff4f6d'}) =>
  f < until ? (
    <div style={{position: 'absolute', left: 50, right: 50, top: 110, transform: `scale(${pop(f, 10)})`, opacity: interpolate(f, [until - 8, until], [1, 0], clamp), background: color, color: '#fff', border: `7px solid ${INK}`, borderRadius: 34, padding: '22px 30px', fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.1, textAlign: 'center', WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
      {text}
    </div>
  ) : null;

// ============================================================== SHORT 1 – your $100 is melting
export const ShortMelt: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const melt = s.cue('melt');
  const puff = s.cue('puff');
  const drop = s.cue('drop');
  const rule = s.cue('rule');
  const save = s.cue('save');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} look={FINN_04} />;
  const m = f < save ? interpolate(f, [melt, rule], [0, 0.6], clamp) : interpolate(f, [save, save + 20], [0.6, 0.1], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 500, zoom: 1.6}},
    {f: melt, cam: {x: 960, y: 520, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: puff, cam: {x: 1150, y: 420, zoom: 1.3}},
    {f: drop, cam: {x: 900, y: 520, zoom: 1.3}},
    {f: save, cam: {x: 960, y: 500, zoom: 1.3}},
  ]);
  cam = drift(cam, f, 0.5);
  const yrs = interpolate(f, [drop, drop + 120], [0, 10], clamp);
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim="#fff0b0"
      set={<Boardwalk frame={f} />}
      actors={[{who: 'finn', look: FINN_04, x: 760, y: 900, facing: 1, pose: f < melt ? 'point' : f < save ? 'facepalm' : 'fist', mood: f >= drop && f < save ? 'worried' : undefined}]}
      front={
        <>
          <IceCream x={1040} y={700} s={0.9} melt={m} frame={f} />
          {f >= puff - 10 && <Inflato x={1180} y={330} s={0.6} frame={f} talk={s.mouth('inflato')} puff={f >= s.at('i502') ? interpolate(f, [s.at('i502'), s.at('i502') + 30], [1.2, 0.5], clamp) : 1.2} mood={f >= s.at('i502') ? 'shock' : 'smug'} />}
          {f >= save && <Sparkles x={1040} y={560} t={(f - save) % 40} r={140} />}
        </>
      }
      overlay={
        <>
          <Hook text="🍦 Your $100 is melting right now" f={f} until={s.at('i501')} />
          <SoundWord text="PUFF!" t={f - puff} x={760} y={380} color="#ff4f6d" size={110} />
          {f >= drop && f < rule && <Counter t={f - drop} from={100} to={Math.round(100 / Math.pow(1.03, yrs))} dur={1} prefix="$" x="50%" y="14%" size={150} color={yrs > 0.5 ? '#ff8f73' : '#5fd38a'} sub={`buying power after ${Math.round(yrs)} yrs at 3%`} />}
          {f >= rule && f < save && (
            <div style={{position: 'absolute', left: 60, right: 60, top: 120, transform: `scale(${pop(f - rule, 12)})`, background: '#2f4a3a', border: `10px solid #a5703f`, borderRadius: 18, padding: '18px 26px', fontFamily: FONT, color: '#f4f1ea', textAlign: 'center', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 52, fontWeight: 700}}>RULE OF 72 ✏️</div>
              <div style={{fontSize: 50, fontWeight: 700, marginTop: 6}}>72 ÷ inflation % = years to double</div>
              {f >= s.at('f504') && <div style={{fontSize: 56, fontWeight: 700, marginTop: 10, color: '#ffe94f'}}>3% → prices double in ~24 yrs</div>}
            </div>
          )}
          {f >= save && (
            <div style={{position: 'absolute', left: 60, right: 60, top: 120, transform: `scale(${pop(f - save, 12)})`, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 52}}>
              <div style={{background: PAPER, border: `6px solid ${INK}`, borderRadius: 22, padding: '10px 22px', color: INK}}>🏦 high-interest savings</div>
              <div style={{background: PAPER, border: `6px solid ${INK}`, borderRadius: 22, padding: '10px 22px', color: INK}}>📈 invest long-term money</div>
            </div>
          )}
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

// ============================================================== SHORT 2 – shrinkflation
export const ShortShrink: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const chips = s.cue('chips');
  const air = s.cue('air');
  const shrink = s.cue('shrink');
  const tag = s.cue('tag');
  const compare = s.cue('compare');
  const cta = s.cue('cta');
  if (f >= cta) return <CtaEnd t={f - cta} look={FINN_04} />;
  const inStore = f < shrink;
  let cam = inStore
    ? camKeys(f, [
        {f: 0, cam: {x: 900, y: 480, zoom: 1.7}},
        {f: chips, cam: {x: 1050, y: 520, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
        {f: s.at('d501'), cam: {x: 1300, y: 460, zoom: 1.5}},
        {f: air, cam: {x: 1050, y: 520, zoom: 1.3}},
      ])
    : camKeys(f, [
        {f: shrink, cam: {x: 1100, y: 520, zoom: 1.3}},
        {f: tag, cam: {x: 900, y: 500, zoom: 1.35}},
        {f: s.at('d502'), cam: {x: 1000, y: 500, zoom: 1.3}},
      ]);
  cam = drift(cam, f, 0.5);
  const thin = ramp(f, shrink + 10, shrink + 60);
  return (
    <Stage
      cam={cam}
      vcam={cam}
      rim={inStore ? '#ffe0b0' : '#e0f0ff'}
      set={inStore ? <CornerStore frame={f} /> : <Grocery frame={f} />}
      actors={[
        {who: 'finn', look: FINN_04, x: inStore ? 760 : 700, y: 900, facing: 1, pose: f < chips ? 'think' : f < tag ? 'point' : 'hold'},
        ...(inStore ? [{who: 'doug', look: lookOf('doug'), x: 1340, y: 650, facing: -1 as const, pose: 'cross' as const, scale: 0.95}] : []),
      ]}
      front={
        inStore ? (
          <>
            <StoreCounter />
            {f >= chips && <ChipBag x={1050} y={630} s={0.75} open={ramp(f, air, air + 20)} frame={f} />}
          </>
        ) : (
          <>
            <CerealBox x={980} y={900} s={0.85} thin={0} />
            <CerealBox x={1220} y={900} s={0.85} thin={thin} />
          </>
        )
      }
      overlay={
        <>
          <Hook text="🕵️ The sneaky price hike nobody notices" f={f} until={s.at('f512')} color="#4f9dde" />
          <BigStat t={f - s.at('f512') - 10} dur={air - s.at('f512')} text="SHRINKFLATION" sub="same price · smaller package" x="50%" y="12%" size={110} color="#ff8f73" />
          <BigStat t={f - air} dur={shrink - air} text="70% AIR 💨" x="50%" y="12%" size={130} color="#7fd3ff" />
          <BigStat t={f - shrink - 10} dur={tag - shrink} text="📦 thinner · 🍫 shorter · 🧻 skinnier" x="50%" y="12%" size={58} color="#f6c945" />
          {f >= tag && (
            <div style={{position: 'absolute', left: 70, right: 70, top: 120, transform: `rotate(-2deg) scale(${pop(f - tag, 12)})`, background: '#fff', border: `6px solid ${INK}`, borderRadius: 14, padding: '18px 26px', fontFamily: FONT, color: INK, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 44, fontWeight: 700}}>O’s Cereal 340 g</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontSize: 80, fontWeight: 700}}>$4.99</div>
                <div style={{fontSize: 48, fontWeight: 700, color: '#e5302f', border: '5px solid #e5302f', borderRadius: 10, padding: '2px 12px'}}>$1.47 / 100 g</div>
              </div>
              <div style={{fontSize: 34, fontWeight: 700, color: '#e5302f', textAlign: 'right'}}>⬆ compare THIS number</div>
              {f >= compare && <div style={{fontSize: 40, fontWeight: 700, marginTop: 10, textAlign: 'center'}}>bigger box cheaper? sometimes… 🤔</div>}
            </div>
          )}
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};


