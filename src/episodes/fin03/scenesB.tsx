// fin03 scenes 8–14: FHSA (house street), Bernie (compounding), fees (sugar shack), Mr. Swipe (sled lot),
// automate (outdoor night rink), game plan (arena), outro (frozen lake sunset)
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk} from '../../stage/camera';
import {Door} from '../../props/props';
import {DustPuff, Emote, Flash, ImpactStars, Sparkles, SoundWord, SweatDrop, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {BigStat, ChapterChip, Coin, Confetti, Panel, SwipeCard, clamp, pop, ramp} from '../fin02/kit';
import {Arena, Beaver, BeaverPond, FINN_CA, HouseStreet, IceLake, MapleLeaf, RUTH_CA, RoboZamboni, SapBucket, SnowStreet, SugarShack, TaxMoose} from './kit';
import {Counter, InfoCard, Shield, Stamp} from './scenesA';

// =============================================================== 8. FHSA – house hunting
export const Fhsa: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const baby = s.cue('baby');
  const house = s.cue('house');
  const mooseUp = interpolate(f, [s.at('m105') - 8, s.at('m105') + 4], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const mooseDown = interpolate(f, [s.at('f126') - 4, s.at('f126') + 8], [1, 0], clamp);
  const mooseShow = mooseUp * mooseDown;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.15}},
    {f: s.at('f124'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('m105') - 2, cam: {x: 1000, y: 540, zoom: 1.0}},
    {f: s.at('m105') + 6, cam: {x: 1420, y: 520, zoom: 1.6}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f125'), cam: {x: 620, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f126'), cam: {x: 960, y: 540, zoom: 1.05}},
    {f: house + 2, cam: {x: 1100, y: 560, zoom: 1.1}},
    {f: s.at('f127'), cam: {x: 640, y: 560, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.6);
  const merge = ramp(f, baby - 30, baby);
  return (
    <Stage
      cam={cam}
      vcam={{x: 800, zoom: 1.7}}
      rim="#ffe8f0"
      set={<HouseStreet frame={f} />}
      speakers={{moose: {x: 1420, y: 360}}}
      actors={[
        {
          who: 'finn',
          look: FINN_CA,
          x: 600,
          y: 930,
          facing: 1,
          pose: f < s.at('m105') ? 'point' : f < s.at('f126') ? 'hips' : f < s.at('f127') ? 'point' : ['down', 'hold'],
          holding: f >= s.at('f127') ? <g transform="translate(-60 120) scale(0.55)"><Door x={0} y={0} /></g> : undefined,
        },
      ]}
      front={
        <>
          {mooseShow > 0.01 && (
            <g>
              <TaxMoose x={1420} y={1240 - 340 * mooseShow} s={0.9} frame={f} talk={s.mouth('moose')} mood="shock" arms="up" flip />
              <path d="M 1150 1010 Q 1420 900 1700 1010 Z" fill="#fff" stroke={INK} strokeWidth={5} />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="CHEAT CODE #3: FHSA 🏠" color="#ff9ec4" dur={150} />
          {f >= s.at('f124') && f < s.at('m105') + 10 && (
            <div style={{position: 'absolute', left: '72%', top: '36%', transform: 'translate(-50%,-50%) scale(0.85)'}}>
              <svg width={900} height={520} viewBox="-450 -260 900 520">
                <g opacity={1 - ramp(f, baby, baby + 6)}>
                  <Shield x={-260 + merge * 200} y={0} s={0.9} label="TFSA" color="#5fb37a" />
                  <Shield x={260 - merge * 200} y={0} s={0.9} label="RRSP" color="#4f9dde" />
                </g>
                {f >= baby && (
                  <g transform={`scale(${pop(f - baby, 14)})`}>
                    <Shield x={0} y={0} s={1.15} label="FHSA" color="#e86a8f" sub="tax ↓ in, $0 out" />
                    <circle cx={0} cy={-170} r={0} />
                    <text x={120} y={-120} fontSize={80}>🍼</text>
                    <Sparkles x={0} y={0} t={(f - baby) % 40} r={190} />
                  </g>
                )}
              </svg>
            </div>
          )}
          <BigStat t={f - s.at('f125') - 10} dur={s.at('f126') - s.at('f125') - 6} text="IT'S THE LAW 😎" x="40%" y="20%" size={100} />
          <BigStat t={f - s.at('f126') - 10} dur={house - s.at('f126') + 30} text="$8,000 / year" sub="up to $40,000 total" x="60%" y="22%" size={110} color="#ff9ec4" />
          <Stamp t={f - house - 40} text="TORONTO PRICES 😵" x="66%" y="58%" size={70} color="#e5302f" />
          <BigStat t={f - s.at('f127') - 30} text="= the front door 🚪" x="70%" y="20%" size={100} color="#f6c945" />
          <Vignette amount={0.28} />
        </>
      }
    />
  );
};

// =============================================================== 9. BERNIE – compounding
const fv = (years: number, start: number, perYear = 7000, r = 0.07) => {
  const n = Math.max(0, years - start);
  return perYear * ((Math.pow(1 + r, n) - 1) / r);
};

/** Race chart: Bernie (starts at 25) vs cousin (starts at 35), ages 25..65. p = drawing progress 0..1 */
export const GrowthChart: React.FC<{p: number; showLate: boolean; w?: number; h?: number}> = ({p, showLate, w = 900, h = 520}) => {
  const max = 1450000;
  const X = (age: number) => 90 + ((age - 25) / 40) * (w - 140);
  const Y = (v: number) => h - 60 - (v / max) * (h - 110);
  const pts = (start: number) => {
    const out: string[] = [];
    const endAge = 25 + 40 * p;
    for (let a = 25; a <= endAge + 0.001; a += 0.5) out.push(`${X(a)},${Y(fv(a - 25 + 25, start))}`);
    return out.join(' ');
  };
  const endAge = 25 + 40 * p;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect width={w} height={h} rx={30} fill={PAPER} stroke={INK} strokeWidth={6} />
      {[0, 500000, 1000000].map((v) => (
        <g key={v}>
          <path d={`M 90 ${Y(v)} H ${w - 40}`} stroke={INK} strokeOpacity={0.15} strokeWidth={3} />
          <text x={80} y={Y(v) + 10} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK}>
            {v === 0 ? '$0' : `$${v / 1000000}M`}
          </text>
        </g>
      ))}
      {[25, 35, 45, 55, 65].map((a) => (
        <text key={a} x={X(a)} y={h - 22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK}>
          {a}
        </text>
      ))}
      <polyline points={pts(25)} fill="none" stroke="#5fb37a" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      {showLate && <polyline points={pts(35)} fill="none" stroke="#e5302f" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
      <circle cx={X(endAge)} cy={Y(fv(endAge, 25))} r={14} fill="#5fb37a" stroke={INK} strokeWidth={4} />
      <text x={X(25) + 10} y={60} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#3f8f5a">
        🦫 Bernie: starts at 25
      </text>
      {showLate && (
        <text x={X(25) + 10} y={100} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#c0392b">
          🦫 cousin: starts at 35
        </text>
      )}
    </svg>
  );
};

export const BeaverScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const damAt = s.cue('dam');
  const race = s.cue('race');
  const million = s.cue('million');
  const late = s.cue('late');
  const small = s.cue('small');
  const dam = interpolate(f, [damAt, s.at('f129') + 60, million, s.duration], [0.1, 0.4, 0.7, 1], clamp);
  const chartP = ramp(f, race + 10, million);
  const showChart = f >= race && f < s.at('b102');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.1}},
    {f: s.at('b101') - 2, cam: {x: 960, y: 560, zoom: 1.1}},
    {f: s.at('b101') + 6, cam: {x: 1560, y: 640, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f129'), cam: {x: 960, y: 560, zoom: 1.0}},
    {f: race, cam: {x: 760, y: 560, zoom: 1.05}},
    {f: s.at('b102') - 2, cam: {x: 760, y: 560, zoom: 1.05}},
    {f: s.at('b102') + 6, cam: {x: 1540, y: 660, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f133'), cam: {x: 900, y: 560, zoom: 1.2}},
    {f: small, cam: {x: 1300, y: 600, zoom: 1.2}},
  ]);
  cam = drift(cam, f, 0.6);
  const bTalk = s.mouth('bernie');
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#fff0c0"
      set={<BeaverPond frame={f} dam={dam} damX={1560} />}
      speakers={{bernie: {x: 1640, y: 560}}}
      actors={[
        {who: 'finn', look: FINN_CA, x: 300, y: 900, facing: 1, pose: f < race ? 'think' : f < million ? 'point' : f < late ? 'up' : f < s.at('f156') ? 'shrug' : 'wave', mood: f >= million && f < late ? 'surprised' : undefined},
      ]}
      front={
        <>
          <Beaver x={1640} y={900} s={1.15} frame={f} talk={bTalk} mood={f >= s.at('b102') && f < s.at('f133') ? 'wise' : 'happy'} arms={f >= small ? 'up' : 'stick'} />
          <DustPuff x={1700} y={880} t={(f - damAt) % 60} n={4} />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="HOW TO HIT $1,000,000 🦫" color="#f6c945" dur={150} />
          <InfoCard t={f - s.at('f129') - 6} dur={race - s.at('f129')} x="62%" y="26%" w={600} color="#5fb37a" title="COMPOUNDING">
            Money earns money → <b>that money earns money</b> → 🚀
          </InfoCard>
          {showChart && (
            <div style={{position: 'absolute', left: '55%', top: '50%', transform: `translate(-50%,-50%) scale(${pop(f - race, 12) * 0.92})`}}>
              <GrowthChart p={chartP} showLate={f >= late} />
            </div>
          )}
          <BigStat t={f - race - 30} dur={million - race - 30} text="$7,000/yr · age 25 → 65 · 7%/yr" x="50%" y="88%" size={54} color="#fff" rot={0} />
          <Counter t={f - million} from={280000} to={1397000} dur={40} hold={late - million + 4} x="74%" y="16%" size={110} color="#5fd38a" sub="you put in $280,000 · tax-free 🛡️" />
          {f >= million && f < late && <Confetti t={f - million} />}
          <BigStat t={f - late} dur={s.at('f133') - late} text="≈ $661,000 😬" sub="start at 35 = less than half" x="74%" y="16%" size={100} color="#ff8f73" />
          <InfoCard t={f - s.at('f133') - 6} dur={s.at('f156') - s.at('f133')} x="56%" y="24%" w={600} color="#e5302f" title="⚠️ 7% is NOT guaranteed">
            Some years go up, some go down. <b>Time</b> is your best friend.
          </InfoCard>
          <BigStat t={f - s.at('f156') - 50} text="$100/month × 40 yrs ≈ $262K" sub="(at 7% a year, not guaranteed)" x="44%" y="82%" size={80} color="#5fd38a" />
          <Vignette amount={0.28} />
        </>
      }
    />
  );
};

// =============================================================== 10. FEES – sugar shack
export const Fees: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const drip = s.cue('drip');
  const bucket = s.cue('bucket');
  const lowLvl = interpolate(f, [s.at('f136'), s.at('f136') + 90], [0.15, 0.9], clamp);
  const highLvl = interpolate(f, [s.at('f136'), s.at('f136') + 90], [0.15, 0.55], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.1}},
    {f: drip, cam: {x: 1300, y: 700, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f135'), cam: {x: 960, y: 560, zoom: 1.0}},
    {f: bucket, cam: {x: 1000, y: 600, zoom: 1.1}},
    {f: s.at('b103'), cam: {x: 1560, y: 680, zoom: 1.6}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f137'), cam: {x: 760, y: 560, zoom: 1.4}},
  ]);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#ffe0b0"
      set={<SugarShack frame={f} />}
      speakers={{bernie: {x: 1640, y: 580}}}
      actors={[{who: 'finn', look: FINN_CA, x: 480, y: 900, facing: 1, pose: f < drip ? 'point' : f < bucket ? 'think' : f < s.at('f137') ? 'up' : 'point'}]}
      front={
        <>
          <SapBucket x={900} y={940} s={1} level={lowLvl} frame={f} label="0.25%" />
          <SapBucket x={1250} y={940} s={1} level={highLvl} leak={f >= drip ? 1 : 0} frame={f} label="2%" />
          {f >= s.at('b103') - 10 && <Beaver x={1640} y={920} s={0.9} frame={f} talk={s.mouth('bernie')} mood="shock" arms="up" flip />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE SNEAKY LEAK: FEES 🍁" color="#f6c945" dur={130} />
          <SoundWord text="drip..." t={f - drip} x={1300} y={420} color="#d8a24a" size={70} />
          <InfoCard t={f - s.at('f135') - 6} dur={s.at('f136') - s.at('f135')} x="74%" y="26%" w={600} color="#d8a24a" title="Yearly fees">
            Some funds: <b>~2%</b>
            <br />
            Low-cost index funds: <b>≤ 0.25%</b>
          </InfoCard>
          {f >= s.at('f136') && f < s.at('f137') && (
            <div style={{position: 'absolute', left: '72%', top: '28%', transform: `translate(-50%,-50%) scale(${pop(f - s.at('f136'), 12)})`, background: PAPER, border: `6px solid ${INK}`, borderRadius: 30, padding: '20px 30px', fontFamily: FONT, color: INK, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 34, fontWeight: 700, marginBottom: 10}}>$100,000 · 30 years · 7%</div>
              {[
                ['0.25% fee', 710, '#5fb37a'],
                ['2% fee', 432, '#e5302f'],
              ].map(([l, v, c], i) => {
                const g = ramp(f, s.at('f136') + 10 + i * 10, s.at('f136') + 60 + i * 10);
                return (
                  <div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 16, margin: '10px 0'}}>
                    <div style={{width: 160, fontSize: 30, fontWeight: 700}}>{l}</div>
                    <div style={{width: (v as number) * 0.7 * g, height: 50, background: c as string, border: `4px solid ${INK}`, borderRadius: 10}} />
                    <div style={{fontSize: 36, fontWeight: 700}}>${Math.round((v as number) * g)}K</div>
                  </div>
                );
              })}
              <div style={{fontSize: 34, fontWeight: 700, color: '#e5302f', marginTop: 8, opacity: f > bucket ? 1 : 0}}>gap: more than $250,000 😱</div>
            </div>
          )}
          <BigStat t={f - s.at('f137') - 10} text="CHECK THE MER 🔍" sub="lower is usually better" x="62%" y="20%" size={110} />
          <Vignette amount={0.28} />
        </>
      }
    />
  );
};

// =============================================================== 11. MR. SWIPE – sled lot at sunset
const Snowmobile: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -260 0 Q -300 -10 -280 -30 L 220 -30 Q 280 -10 260 0 Z" fill="#c8ccd2" />
    <path d="M -200 -40 L -160 -150 L 60 -170 L 200 -100 L 220 -40 Z" fill="#f6c945" />
    <path d="M -40 -170 L -20 -230 L 40 -230 L 60 -170 Z" fill="#bfe6ff" />
    <path d="M -180 -160 L -100 -160 L -100 -130 L -180 -130 Z" fill="#2b2333" />
    <text x={70} y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK} stroke="none">
      $19,999
    </text>
  </g>
);

export const Debt: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const freeze = s.cue('freeze');
  const swipeIn = pop(f - 4, 14);
  const leave = interpolate(f, [s.at('s103') + 30, s.at('s103') + 60], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const iced = ramp(f, freeze, freeze + 12);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1200, y: 540, zoom: 1.5}},
    {f: s.at('f138'), cam: {x: 700, y: 540, zoom: 1.5}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('s102'), cam: {x: 1250, y: 520, zoom: 1.5}},
    {f: s.at('f139'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: freeze, cam: {x: 1250, y: 520, zoom: 1.6}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('s103') + 40, cam: {x: 1000, y: 540, zoom: 1.1}},
  ]);
  cam = shake(cam, f, freeze, 12, 8);
  cam = drift(cam, f, 0.6);
  const sx = 1280 + leave * 1100;
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#ffc9a0"
      set={<SnowStreet frame={f} time="sunset" />}
      speakers={{swipe: {x: sx, y: 400}}}
      actors={[{who: 'finn', look: FINN_CA, x: 620, y: 900, facing: 1, pose: f < s.at('f139') ? 'point' : f < freeze ? 'hips' : 'shrug'}]}
      front={
        <>
          <Snowmobile x={1000} y={930} s={1} />
          <g transform={`translate(0 ${(1 - swipeIn) * 300})`}>
            <g opacity={1}>
              <SwipeCard x={sx} y={640 + Math.sin(f / 2) * 3 * iced} s={0.75} frame={f} talk={s.mouth('swipe')} mood={f >= freeze ? 'sad' : 'sly'} arms={f >= freeze ? 'down' : f >= s.at('s102') ? 'wave' : 'rub'} hat="tophat" rot={iced * Math.sin(f) * 3} />
            </g>
            {iced > 0 && (
              <g opacity={iced * 0.8} transform={`translate(${sx} 640)`}>
                <rect x={-120} y={-80} width={240} height={160} rx={18} fill="#bff8ff" fillOpacity={0.5} stroke="#7fd3ff" strokeWidth={6} />
                {[-80, -30, 20, 70].map((ix) => (
                  <path key={ix} d={`M ${ix} 80 l 10 ${30 + (ix % 3) * 6} l 10 -${30 + (ix % 3) * 6}`} fill="#dff8ff" stroke="#7fd3ff" strokeWidth={3} />
                ))}
              </g>
            )}
          </g>
          <Sparkles x={sx} y={640} t={(f - freeze) % 40} color="#dff8ff" />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="MR. SWIPE IS IN CANADA 💳" color="#f6c945" dur={130} />
          <BigStat t={f - s.at('s102') - 20} dur={s.at('f139') - s.at('s102') - 10} text="~20% card interest" x="40%" y="20%" size={100} color="#ff8f73" />
          {f >= s.at('f139') && f < freeze && (
            <div style={{position: 'absolute', left: '50%', top: '26%', transform: `translate(-50%,-50%) scale(${pop(f - s.at('f139'), 12)})`, display: 'flex', gap: 30, fontFamily: FONT, fontWeight: 700}}>
              <div style={{background: '#e5302f', color: '#fff', border: `6px solid ${INK}`, borderRadius: 24, padding: '16px 28px', fontSize: 52, WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>Card: 20% 🔥</div>
              <div style={{alignSelf: 'center', fontSize: 70, color: '#fff', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>vs</div>
              <div style={{background: '#5fb37a', color: '#fff', border: `6px solid ${INK}`, borderRadius: 24, padding: '16px 28px', fontSize: 52, WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>Invest: ~7%? 🤷</div>
            </div>
          )}
          <Stamp t={f - s.at('f139') - 120} text="PAY THE CARD FIRST ✅" x="50%" y="46%" size={64} color="#2f8f5a" rot={-6} />
          <SoundWord text="FREEZE!" t={f - freeze} x={1300} y={280} color="#7fd3ff" size={110} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 12. AUTOMATE – outdoor rink at night
export const Auto: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const robot = s.cue('robot');
  const mall = s.cue('mall');
  const card = s.cue('card');
  const rx = interpolate(f, [robot, robot + 40], [-500, 700], {...clamp, easing: Easing.out(Easing.cubic)}) + interpolate(f, [s.at('f158'), s.at('f159')], [0, 500], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 760, y: 560, zoom: 1.5}},
    {f: robot, cam: {x: 900, y: 560, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f159'), cam: {x: 1100, y: 560, zoom: 1.1}},
    {f: mall, cam: {x: 1700, y: 480, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f160'), cam: {x: 960, y: 540, zoom: 1.05}},
    {f: s.at('b105') - 2, cam: {x: 960, y: 540, zoom: 1.05}},
    {f: s.at('b105') + 6, cam: {x: 1500, y: 640, zoom: 1.5}, ease: Easing.out(Easing.back(1.4))},
  ]);
  cam = drift(cam, f, 0.6);
  const lights = Array.from({length: 16}, (_, i) => i);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#bfe0ff"
      set={
        <g>
          <IceLake frame={f} time="night" hut={false} />
          <path d="M -300 360 Q 960 470 2220 360" fill="none" stroke={INK} strokeWidth={3} />
          {lights.map((i) => {
            const x = -300 + i * 160;
            const y = 360 + Math.sin((i / 15) * Math.PI) * 108 + 12;
            return <circle key={i} cx={x} cy={y} r={12} fill={['#f6c945', '#e5302f', '#5fd38a', '#7fd3ff'][i % 4]} opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} stroke={INK} strokeWidth={3} />;
          })}
        </g>
      }
      speakers={{swipe: {x: 1760, y: 330}, bernie: {x: 1500, y: 580}}}
      actors={[{who: 'finn', look: FINN_CA, x: 340, y: 900, facing: 1, pose: f < robot ? 'hips' : f < mall ? 'point' : f < card ? 'up' : 'wave'}]}
      front={
        <>
          {f >= robot - 2 && <RoboZamboni x={rx} y={930} s={0.9} frame={f} />}
          {f >= robot && f < s.at('f160') &&
            Array.from({length: 4}, (_, i) => {
              const t = (f - robot - i * 12) % 50;
              return <Coin key={i} x={rx - 120 + t * 4} y={760 - Math.sin((t / 50) * Math.PI) * 120} r={24} />;
            })}
          {f >= mall - 10 && f < s.at('b105') && <SwipeCard x={1760} y={560} s={0.35} frame={f} talk={s.mouth('swipe')} mood="shock" arms="up" hat="tophat" legs={false} />}
          {f >= s.at('b105') - 10 && <Beaver x={1500} y={930} s={0.9} frame={f} talk={s.mouth('bernie')} arms="wave" flip />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE LAZY TRICK: AUTOMATE 🤖" color="#7fd3ff" dur={130} />
          {f >= s.at('f158') && f < s.at('f160') && (
            <div style={{position: 'absolute', left: '50%', top: '22%', transform: `translate(-50%,-50%) scale(${pop(f - s.at('f158'), 12)})`, display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT, fontWeight: 700, fontSize: 52}}>
              {['PAYDAY 💵', '→', 'AUTO-TRANSFER 🤖', '→', 'TFSA 🛡️'].map((t, i) => (
                <div key={i} style={i % 2 ? {color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill', fontSize: 70} : {background: PAPER, border: `6px solid ${INK}`, borderRadius: 22, padding: '10px 22px', opacity: pop(f - s.at('f158') - i * 8, 10)}}>
                  {t}
                </div>
              ))}
            </div>
          )}
          {f < card && <Stamp t={f - s.at('f159') - 20} text="PAY YOURSELF FIRST" x="56%" y="44%" size={70} color="#2f8f5a" rot={-5} />}
          <BigStat t={f - s.at('f160') - 10} dur={card - s.at('f160')} text="RAISE? BUMP IT UP ⬆️" x="56%" y="20%" size={100} color="#5fd38a" />
          {f >= card && (
            <div style={{position: 'absolute', left: '30%', top: '30%', transform: `translate(-50%,-50%) rotate(-5deg) scale(${pop(f - card, 14)})`, background: '#fff6e0', border: `6px solid ${INK}`, borderRadius: 20, padding: '24px 40px', fontFamily: FONT, color: INK, textAlign: 'center', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 54, fontWeight: 700}}>THANK YOU! 💌</div>
              <div style={{fontSize: 34, fontWeight: 600}}>— Future You (age 65)</div>
            </div>
          )}
          <Vignette amount={0.35} />
        </>
      }
    />
  );
};

// =============================================================== 13. GAME PLAN – arena jumbotron
const PLAN = [
  ['🧯', 'Small emergency fund'],
  ['💳', 'Kill high-interest debt'],
  ['🎁', 'Grab the employer match'],
  ['🛡️', 'Fill TFSA (+ FHSA for a home)'],
  ['🏒', 'Use your RRSP as income grows'],
  ['🤖', 'Low fees + automate + time'],
];
export const Plan: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const cues = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((c) => s.cue(c));
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.3}},
    {f: cues[0], cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u104') - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('u104') + 6, cam: {x: 1600, y: 600, zoom: 1.5}, ease: Easing.out(Easing.back(1.4))},
  ]);
  cam = drift(cam, f, 0.4);
  return (
    <Stage
      cam={cam}
      vcam={{x: 960, zoom: 1.5}}
      rim="#ffe9a8"
      set={<Arena frame={f} />}
      actors={[
        {who: 'finn', look: {...FINN_CA, hat: 'cap', hatColor: '#e5302f'}, x: 300, y: 920, facing: 1, pose: f < cues[0] ? 'fist' : 'point'},
        {who: 'ruth', look: RUTH_CA, x: 1780, y: 920, facing: -1, pose: s.after('u104') ? 'up' : 'hips'},
      ]}
      front={
        <g>
          <g transform="translate(1130 70) scale(0.92)" stroke={INK} strokeWidth={6}>
            <path d="M -10 -200 V 0 M 10 -200 V 0" />
            <rect x={-560} y={0} width={1120} height={720} rx={30} fill="#1c1c28" />
            <rect x={-530} y={30} width={1060} height={70} rx={14} fill="#e5302f" />
            <text x={0} y={82} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff" stroke="none">
              🏒 THE GAME PLAN 🏒
            </text>
            {PLAN.map(([e, t], i) => {
              const p = pop(f - cues[i], 10);
              const active = f >= cues[i] && (i === 5 || f < cues[i + 1]);
              return (
                <g key={t} transform={`translate(-500 ${140 + i * 94}) scale(${Math.max(0.001, p)})`} opacity={p > 0 ? 1 : 0}>
                  <rect width={1000} height={80} rx={16} fill={active ? '#f6c945' : '#2f3550'} strokeWidth={4} />
                  <text x={30} y={56} fontFamily={FONT} fontWeight={700} fontSize={46} fill={active ? INK : '#7fd3ff'} stroke="none">
                    {i + 1}
                  </text>
                  <text x={90} y={58} fontSize={46}>
                    {e}
                  </text>
                  <text x={160} y={56} fontFamily={FONT} fontWeight={700} fontSize={44} fill={active ? INK : '#fff'} stroke="none">
                    {t}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE GAME PLAN 📋" color="#f6c945" dur={100} />
          {f >= s.at('u104') && <Confetti t={f - s.at('u104')} seed={4} />}
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 14. OUTRO – frozen lake at sunset
export const Outro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const sub = s.cue('sub');
  const end = s.beat('end');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.2}},
    {f: s.at('m106') - 2, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: s.at('m106') + 6, cam: {x: 1440, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f148'), cam: {x: 800, y: 560, zoom: 1.3}},
    {f: sub, cam: {x: 960, y: 560, zoom: 1.05}},
    {f: s.at('f150'), cam: {x: 700, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u105'), cam: {x: 900, y: 560, zoom: 1.1}},
  ]);
  cam = drift(cam, f, 0.5);
  const clicked = f >= s.at('f150') - 10;
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.6}}
      rim="#ffc9a0"
      set={<IceLake frame={f} time="sunset" />}
      speakers={{moose: {x: 1440, y: 340}, ruth: {x: 1900, y: 300}}}
      offscreen={{ruth: 1}}
      actors={[{who: 'finn', look: FINN_CA, x: 760, y: 920, facing: 1, pose: f < s.at('m106') ? 'wave' : f < sub ? 'shrug' : f < s.at('f150') ? 'point' : 'hold', holding: f >= s.at('f150') ? <CandyBar /> : undefined}]}
      front={
        <>
          <TaxMoose x={1440} y={920} s={0.95} frame={f} talk={s.mouth('moose')} mood={f < s.at('f148') + 40 ? 'sad' : 'happy'} arms={f >= s.at('f148') + 40 ? 'rub' : 'down'} flip />
          {f >= s.at('f148') + 40 && (
            <g transform="translate(1340 690) rotate(-20)" stroke={INK} strokeWidth={4}>
              <ellipse rx={22} ry={34} fill="#8a5a3a" />
              <path d="M -18 -20 H 18 M -20 0 H 20 M -18 20 H 18" />
            </g>
          )}
          <Beaver x={1100} y={930} s={0.7} frame={f} arms="wave" />
        </>
      }
      overlay={
        <>
          {f >= sub && f < end.start + 60 && (
            <div style={{position: 'absolute', left: '50%', top: '18%', transform: `translate(-50%,-50%) scale(${pop(f - sub, 14) * (clicked ? 0.95 : 1)})`, display: 'flex', alignItems: 'center', gap: 22, background: clicked ? '#6b6b6b' : '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '22px 52px', borderRadius: 70, border: '7px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
              {clicked ? 'SUBSCRIBED ✔' : 'SUBSCRIBE 🔔'}
            </div>
          )}
          <BigStat t={f - s.at('f150') - 10} text="NEXT: INFLATION 🍫" sub="why candy costs SO much more now" x="68%" y="16%" size={90} color="#f6c945" />
          <BigStat t={f - s.at('u105')} text="35¢?!" x="80%" y="60%" size={120} color="#ff8f73" rot={8} />
          {f >= end.start && <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [end.start + 20, end.end], [0, 1], clamp)}} />}
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

const CandyBar: React.FC = () => (
  <g stroke={INK} strokeWidth={4} transform="rotate(-20)">
    <rect x={-70} y={-24} width={140} height={48} rx={8} fill="#7a3b1e" />
    <rect x={-40} y={-26} width={80} height={52} fill="#e5302f" />
    <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#fff" stroke="none">
      CHOCO
    </text>
  </g>
);


