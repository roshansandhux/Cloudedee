// fin05 scenes 8–14 (new neon look): gas station (true cost), observatory (future money), Grandma's Betsy,
// driving school playbook, lease carousel, car-wash recap, Tyler's comeback outro.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {Emote, Flash, Sparkles, SoundWord} from '../../fx/fx';
import {FONT, INK} from '../../lib/theme';
import {Confetti, clamp, pop, ramp} from '../fin02/kit';
import {
  BarRow, Betsy, CarWash, Carousel, Cone, Driveway, DrivingSchool, FINN_05, GasStation, GlassCard, Gremlin, Hatchback, NEON, NeonChip, NeonGrade, NeonStat, NeonTag,
  Observatory, RUTH_05, RuthStreet, SavingsJar, ShinyCar, TYLER, VINNY,
} from './kit';

/** Neon money counter (screen space). */
export const NeonCounter: React.FC<{t: number; from: number; to: number; dur?: number; x: string | number; y: string | number; size?: number; color?: string; sub?: string; hold?: number}> = ({t, from, to, dur = 40, x, y, size = 140, color = NEON.lime, sub, hold = 99999}) => {
  if (t < 0 || t > hold) return null;
  const v = interpolate(t, [0, dur], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
  return <NeonStat t={t} text={`$${Math.round(v).toLocaleString('en-US')}`} x={x} y={y} size={size} color={color} sub={sub} dur={hold} />;
};

// =============================================================== 8. TRUE COST – gas station at sunset
const BILLS = ['⛽ gas', '🛡️ insurance', '🛢️ oil changes', '🛞 tires', '🔧 repairs', '📋 registration', '🅿️ parking', '❓ that one noise: $800'];
export const TrueCost: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const gas = s.cue('gas');
  const receipts = s.cue('receipts');
  const f532 = s.at('f532');
  const tick = interpolate(f, [gas, gas + 300], [0, 98.4], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: gas, cam: {x: 820, y: 540, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
    {f: receipts, cam: {x: 640, y: 540, zoom: 1.4}},
    {f: s.at('t512'), cam: {x: 1120, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f564'), cam: {x: 600, y: 540, zoom: 1.5}},
    {f: s.at('f534'), cam: {x: 900, y: 540, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
    {f: s.at('t507'), cam: {x: 1120, y: 520, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.5);
  const shown = Math.min(BILLS.length, Math.floor(Math.max(0, f - f532) / 22) + (f >= f532 ? 1 : 0));
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.5}}
      rim="#ffc08a"
      set={<GasStation frame={f} tick={tick} />}
      actors={[
        {who: 'tyler', look: TYLER, x: 1120, y: 900, facing: -1, pose: f < s.at('t512') ? 'hold' : f < s.at('t507') ? 'shrug' : 'facepalm', mood: 'worried'},
        {who: 'finn', look: FINN_05, x: 280, y: 900, facing: 1, pose: f < gas ? 'point' : f < s.at('f533') ? 'up' : f < s.at('f534') ? 'think' : 'point', mood: f >= s.at('f534') && f < s.at('t507') ? 'surprised' : undefined},
      ]}
      overlay={
        <>
          <NeonChip t={f - 8} label="The true cost of owning a car" color={NEON.orange} />
          {f >= f532 && f < s.at('f533') + 30 && (
            <div style={{position: 'absolute', right: 120, top: 120, width: 560, fontFamily: FONT}}>
              {BILLS.slice(0, shown).map((b, i) => (
                <div key={b} style={{transform: `translateX(${(1 - pop(f - f532 - i * 22, 10)) * 300}px) rotate(${(i % 2 ? 1 : -1) * 2}deg)`, margin: '6px 0', padding: '8px 22px', background: '#fffaf1', color: INK, border: `4px solid ${INK}`, borderRadius: 8, fontSize: 36, fontWeight: 700, boxShadow: `0 0 16px ${i === 7 ? NEON.red : NEON.orange}`}}>
                  🧾 {b}
                </div>
              ))}
            </div>
          )}
          <GlassCard t={f - s.at('f533') - 6} dur={s.at('t512') + 10 - s.at('f533')} x="66%" y="30%" w={700} color={NEON.cyan} title="got a car loan?">
            <div>lender usually requires 🛡️ FULL COVERAGE</div>
            <div style={{color: NEON.cyan}}>→ more expensive than basic insurance</div>
          </GlassCard>
          <NeonStat t={f - s.at('t512') - 10} dur={s.at('f564') - s.at('t512')} text="~$300/mo" sub="Tyler's insurance 😬" x="40%" y="22%" size={110} color={NEON.red} />
          <NeonTag t={f - s.at('f564') - 10} dur={s.at('f534') - s.at('f564')} text="PRICIER CAR = PRICIER INSURANCE" x="60%" y="22%" color={NEON.orange} size={56} />
          <NeonStat t={f - s.at('f534') - 10} text="$11–12k / year" sub="AAA: all-in cost to own a new car" x="50%" y="20%" size={120} color={NEON.gold} />
          <NeonStat t={f - s.at('f534') - 170} text="≈ $1,000 / month" x="50%" y="40%" size={80} color={NEON.red} rot={-3} />
          <NeonGrade warm />
        </>
      }
    />
  );
};

// =============================================================== 9. WHAT $750/MONTH COULD BECOME – observatory
const Curve: React.FC<{t: number; prog: number}> = ({t, prog}) => {
  if (t < 0) return null;
  const pts = Array.from({length: 41}, (_, i) => {
    const yrs = i;
    const fv = 750 * ((Math.pow(1 + 0.07 / 12, yrs * 12) - 1) / (0.07 / 12));
    return [120 + i * 18, 520 - (fv / 2000000) * 440] as const;
  });
  const n = Math.max(2, Math.round(prog * 41));
  const d = pts.slice(0, n).map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const last = pts[n - 1];
  return (
    <svg style={{position: 'absolute', left: 1130, top: 360, opacity: pop(t, 10)}} width={740} height={516} viewBox="0 0 860 600">
      <rect x={0} y={0} width={860} height={600} rx={26} fill="rgba(14,10,36,0.86)" stroke={NEON.lime} strokeWidth={4} />
      <line x1={120} y1={520} x2={840} y2={520} stroke="#fff" strokeOpacity={0.4} strokeWidth={3} />
      <line x1={120} y1={60} x2={120} y2={520} stroke="#fff" strokeOpacity={0.4} strokeWidth={3} />
      {[10, 20, 30, 40].map((y) => (
        <text key={y} x={120 + y * 18} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#fff" opacity={0.7}>
          {y}y
        </text>
      ))}
      <path d={d} fill="none" stroke={NEON.lime} strokeWidth={10} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${NEON.lime})`}} />
      <circle cx={last[0]} cy={last[1]} r={14} fill="#fff" stroke={NEON.lime} strokeWidth={5} />
      <text x={40} y={50} fontFamily={FONT} fontWeight={700} fontSize={30} fill={NEON.lime}>
        $750/mo invested @ ~7% (not guaranteed)
      </text>
    </svg>
  );
};

export const Future: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const scope = s.cue('scope');
  const forty = s.cue('forty');
  const prog = f < forty ? interpolate(f, [scope, scope + 60], [0, 0.25], clamp) : interpolate(f, [forty, forty + 60], [0.25, 1], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 500, zoom: 1.0}},
    {f: 40, cam: {x: 600, y: 560, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
    {f: scope, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('t508'), cam: {x: 640, y: 560, zoom: 1.25}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f538'), cam: {x: 760, y: 540, zoom: 1.4}},
    {f: s.at('f539'), cam: {x: 960, y: 540, zoom: 1.05}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.5}}
      rim="#a8b8ff"
      set={<Observatory frame={f} />}
      actors={[
        {who: 'tyler', look: TYLER, x: 360, y: 900, facing: 1, pose: f < s.at('t508') ? 'down' : f < s.at('f539') ? 'up' : 'cross', mood: f >= forty && f < s.at('f538') ? 'surprised' : undefined},
        {who: 'finn', look: FINN_05, x: 680, y: 900, facing: f < s.at('f538') ? 1 : -1, pose: f < scope ? 'think' : f < s.at('f538') ? 'point' : f < s.at('f539') ? 'facepalm' : 'shrug'},
      ]}
      front={<>{f >= scope && <Sparkles x={1650} y={260} t={(f - scope) % 50} r={200} color="#d8ffb0" />}</>}
      overlay={
        <>
          <NeonChip t={f - 8} label="What $750 a month could become" color={NEON.lime} />
          {f >= scope && f < s.at('f539') + 40 && <Curve t={f - scope} prog={prog} />}
          <NeonCounter t={f - scope - 10} from={0} to={130000} dur={60} x="28%" y="20%" size={120} sub="after 10 years" hold={forty - scope - 10} />
          <NeonCounter t={f - forty} from={130000} to={1970000} dur={70} x="28%" y="20%" size={120} color={NEON.gold} sub="after 40 years" hold={s.at('f539') - forty} />
          <NeonStat t={f - s.at('t508') - 20} dur={s.at('f539') - s.at('t508')} text="= 40 trucks?!" x="30%" y="42%" size={80} color={NEON.red} rot={-6} />
          <NeonTag t={f - s.at('f539') - 6} dur={s.at('f540') - s.at('f539')} text="~7% IS NOT GUARANTEED" x="50%" y="18%" color={NEON.orange} size={64} />
          <GlassCard t={f - s.at('f540') - 6} x="50%" y="28%" w={900} color={NEON.red} title="the forever loop 🔁">
            <div style={{textAlign: 'center', fontSize: 40}}>pay off → trade in → new loan → repeat…</div>
          </GlassCard>
          <NeonGrade />
        </>
      }
    />
  );
};

// =============================================================== 10. GRANDMA'S CAR PAYMENT TRICK – Betsy
export const RuthScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const betsy = s.cue('betsy');
  const jar = s.cue('jar');
  const fill = interpolate(f, [jar, jar + 200], [0.1, 0.85], clamp);
  const h = hop(f, betsy, 14, 30);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 540, zoom: 1.1}},
    {f: 30, cam: {x: 760, y: 540, zoom: 1.4}, ease: Easing.out(Easing.cubic)},
    {f: betsy, cam: {x: 1100, y: 560, zoom: 1.2}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f541'), cam: {x: 450, y: 540, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('u502'), cam: {x: 720, y: 540, zoom: 1.6}},
    {f: jar, cam: {x: 1100, y: 540, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u503'), cam: {x: 720, y: 540, zoom: 1.6}},
    {f: s.at('v506'), cam: {x: 1900, y: 560, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u504'), cam: {x: 720, y: 540, zoom: 1.75}, ease: Easing.out(Easing.back(1.5))},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.6}}
      rim="#fff4c8"
      set={
        <>
          <RuthStreet frame={f} />
          <g transform={`translate(0 ${h.dy})`}>
            <Betsy x={1200} y={900} s={0.95} frame={f} puff={f >= betsy && f < betsy + 90 ? 1 : 0} />
          </g>
        </>
      }
      actors={[
        {who: 'vinny', look: VINNY, x: 2200, y: 870, facing: -1, pose: 'wave', scale: 0.7},
        {who: 'ruth', look: RUTH_05, x: 720, y: 900, facing: -1, pose: f < betsy ? 'wave' : f < s.at('u502') ? 'point' : f < s.at('u504') ? 'hips' : 'cross', mood: f >= s.at('u504') ? 'smug' : undefined},
        {who: 'finn', look: FINN_05, x: 420, y: 900, facing: 1, pose: f < s.at('f541') ? 'down' : f < jar ? 'shrug' : f < s.at('u503') ? 'point' : 'up'},
      ]}
      front={
        <>
          {f >= jar && <SavingsJar x={1600} y={900} s={pop(f - jar, 14) * 0.9 + 0.01} fill={fill} />}
          <SoundWord text="HONK!" t={f - betsy} x={1500} y={480} color={NEON.gold} size={100} />
          <SoundWord text="*cough*" t={f - betsy - 30} x={900} y={640} color="#c9c3d6" size={70} rot={6} />
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="Grandma's car payment trick" color={NEON.pink} />
          <NeonStat t={f - s.at('u501') - 40} dur={s.at('f541') - s.at('u501') - 20} text="2009 · used · paid CASH" x="62%" y="20%" size={80} color={NEON.lime} />
          <GlassCard t={f - s.at('f542') - 6} dur={s.at('v506') - s.at('f542')} x="36%" y="28%" w={720} color={NEON.lime} title="pay yourself a car payment">
            <div>✅ car paid off</div>
            <div>➡️ keep sending the payment… to SAVINGS</div>
            <div style={{color: NEON.lime}}>🚗 next car: pay cash · no loan · no interest</div>
          </GlassCard>
          <NeonTag t={f - s.at('u503') - 20} dur={s.at('v506') - s.at('u503')} text="THE BANK PAYS HER 💅" x="40%" y="60%" color={NEON.pink} size={60} rot={-5} />
          <NeonStat t={f - s.at('v506') - 10} dur={s.at('u504') - s.at('v506')} text="0% FINANCING!!" sub="(on a brand-new SUV)" x="50%" y="22%" size={90} color={NEON.red} rot={4} />
          <NeonGrade warm amount={0.5} />
        </>
      }
    />
  );
};

// =============================================================== 11. THE SMART-BUYER PLAYBOOK – driving school
export const Playbook: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const r = ['r1', 'r2', 'r3', 'r4'].map((c) => s.cue(c));
  const knocked = (i: number) => ramp(f, r[i], r[i] + 10);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 540, zoom: 1.05}},
    {f: r[0], cam: {x: 900, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('g503'), cam: {x: 1500, y: 600, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: r[2], cam: {x: 900, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: r[3] + 60, cam: {x: 700, y: 540, zoom: 1.4}},
  ]);
  cam = drift(cam, f, 0.5);
  const ruleCard = (i: number, title: string, color: string, body: React.ReactNode, until: number) => (
    <GlassCard t={f - r[i] - 4} dur={until - r[i]} x="66%" y="34%" w={760} color={color} title={title}>
      {body}
    </GlassCard>
  );
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.5}}
      rim="#fff4c8"
      set={<DrivingSchool frame={f} />}
      actors={[{who: 'finn', look: FINN_05, x: 680, y: 900, facing: 1, pose: f < r[0] ? 'wave' : f < r[1] ? 'point' : f < r[2] ? 'think' : f < r[3] ? 'cross' : 'hips'}]}
      front={
        <>
          {[1100, 1300, 1500, 1700].map((cx, i) => (
            <Cone key={cx} x={cx} y={910} s={1.1} down={knocked(i)} />
          ))}
          {f >= s.at('g503') - 6 && f < r[2] + 20 && <Gremlin x={1500} y={760} s={0.6 * pop(f - s.at('g503') + 6, 10) + 0.01} frame={f} talk={s.mouth('gremlin')} mood="sulk" />}
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="How to buy a car the smart way" color={NEON.lime} />
          {ruleCard(
            0,
            'rule 1 · the 20/4/10 rule',
            NEON.lime,
            <>
              <div>
                <b style={{color: NEON.lime}}>20%</b> down (at least)
              </div>
              <div>
                <b style={{color: NEON.lime}}>4</b> years or less on the loan
              </div>
              <div>
                <b style={{color: NEON.lime}}>10%</b> of income max for ALL car costs
              </div>
              {f >= s.at('f545') && <div style={{marginTop: 10, color: NEON.gold}}>$60k/yr → ≈ $500/mo total (payment + insurance + gas)</div>}
            </>,
            r[1],
          )}
          {ruleCard(1, 'rule 2 · reliable & a few years old', NEON.cyan, <div>someone else already fed the gremlin 🦷</div>, r[2])}
          {ruleCard(
            2,
            'rule 3 · say no to extras',
            NEON.pink,
            <>
              <div>🚫 paint protection · fabric spray · pricey add-ons</div>
              <div style={{color: NEON.pink}}>read every line before you sign ✍️</div>
            </>,
            r[3],
          )}
          {ruleCard(3, 'rule 4 · be ready to walk away', NEON.gold, <div>thousands of cars 🚗🚗🚗 · ONE bank account 🏦</div>, 99999)}
          <NeonGrade amount={0.5} />
        </>
      }
    />
  );
};

// =============================================================== 12. SHOULD YOU LEASE? – the lease-go-round
export const Lease: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const spin = s.cue('spin');
  const ph = f >= spin ? (f - spin) / 40 : 0;
  const cars = [0, 1, 2, 3].map((i) => {
    const a = ph + (i * Math.PI) / 2;
    return {x: 900 + Math.cos(a) * 480, y: 880 + Math.sin(a) * 40, front: Math.sin(a) > 0, i};
  });
  const tyA = ph + Math.PI * 0.1;
  const tyX = 900 + Math.cos(tyA) * 360;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1300, y: 540, zoom: 1.2}},
    {f: spin, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('v507'), cam: {x: 500, y: 540, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f550'), cam: {x: 1300, y: 540, zoom: 1.2}},
    {f: s.at('t509'), cam: {x: tyX, y: 540, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.5);
  const colors = [NEON.pink, NEON.cyan, NEON.lime, NEON.gold];
  const CarOn = (c: (typeof cars)[0]) => <ShinyCar key={c.i} x={c.x} y={c.y} s={0.45} color={colors[c.i]} flip={Math.cos(ph + (c.i * Math.PI) / 2) > 0} />;
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.5}}
      rim="#ffb8f0"
      set={
        <>
          <Carousel frame={f} spin={ph} />
          {cars.filter((c) => !c.front).map(CarOn)}
        </>
      }
      actors={[
        {who: 'tyler', look: TYLER, x: tyX, y: 840 + Math.sin(f / 6) * 10, sitting: true, facing: Math.sin(tyA) > 0 ? -1 : 1, pose: 'up', mood: 'sleepy', scale: 0.8, opacity: f >= spin ? 1 : 0},
        ...(f >= s.at('v507') - 10 ? [{who: 'vinny', look: VINNY, x: 200, y: 900, facing: 1 as const, pose: 'wave' as const}] : []),
        {who: 'finn', look: FINN_05, x: 1680, y: 900, facing: -1, pose: f < spin ? 'point' : f < s.at('f551') ? 'think' : 'hips'},
      ]}
      front={<>{cars.filter((c) => c.front).map(CarOn)}</>}
      overlay={
        <>
          <NeonChip t={f - 8} label="Should you lease?" color={NEON.pink} />
          <NeonStat t={f - s.at('f549') - 60} dur={s.at('v507') - s.at('f549') - 50} text="LEASE = RENTING 🔑" x="50%" y="20%" size={100} color={NEON.pink} />
          <GlassCard t={f - s.at('f550') - 10} dur={s.at('f551') + 10 - s.at('f550')} x="66%" y="30%" w={700} color={NEON.red} title="the catch">
            <div>✗ give it back · you own nothing</div>
            <div>⚠️ mileage limits</div>
            <div>💸 wear &amp; tear fees</div>
          </GlassCard>
          <GlassCard t={f - s.at('f551') - 6} dur={s.at('t509') - s.at('f551') + 10} x="62%" y="28%" w={720} color={NEON.cyan} title="fair is fair">
            <div>can make sense for some people (like some business owners)</div>
          </GlassCard>
          <NeonTag t={f - s.at('f551') - 140} text="LEASE FOREVER = PAYMENT FOREVER" x="50%" y="60%" color={NEON.red} size={60} />
          <NeonGrade />
        </>
      }
    />
  );
};

// =============================================================== 13. RECAP – the car wash of rules
const RULES = ['Negotiate the TOTAL price', 'Keep the loan short (≤ 4 yrs)', 'Get pre-approved + protect your credit', 'Buy reliable, maybe used, keep it long', 'Paid off? Keep paying YOURSELF'];
export const Recap: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const w = ['w1', 'w2', 'w3', 'w4', 'w5'].map((c) => s.cue(c));
  const shine = s.cue('shine');
  const carX = interpolate(f, [w[0] - 20, shine], [-200, 1150], clamp);
  const foam = f < shine ? interpolate(f, [w[0], w[0] + 30], [0, 1], clamp) : interpolate(f, [shine, shine + 30], [1, 0], clamp);
  const gx = carX + (f >= s.at('g504') ? (f - s.at('g504')) * 30 : 0);
  const gy = 560 - (f >= s.at('g504') ? (f - s.at('g504')) * 22 : 0);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 520, zoom: 1.15}},
    {f: w[0], cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: shine, cam: {x: 1100, y: 600, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: s.at('g504'), cam: {x: 1250, y: 520, zoom: 1.2}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.5}}
      rim="#c8f0ff"
      set={
        <>
          <CarWash frame={f} foam={foam} />
          <ShinyCar x={carX} y={880} s={0.9} color={f >= shine ? '#3ff0ff' : '#8a8478'} moving={f < shine} frame={f} />
        </>
      }
      actors={[{who: 'finn', look: FINN_05, x: 1780, y: 900, facing: -1, pose: f < w[0] ? 'wave' : f < shine ? 'point' : 'up'}]}
      front={
        <>
          {f >= w[0] - 20 && f < s.at('g504') + 50 && <Gremlin x={gx} y={gy} s={0.45} frame={f} talk={s.mouth('gremlin')} mood={f >= s.at('g504') ? 'scream' : 'gleeful'} />}
          {f >= shine && <Sparkles x={1150} y={700} t={(f - shine) % 40} r={260} color="#fff" />}
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="5 rules · car wash edition 🫧" color={NEON.cyan} />
          <div style={{position: 'absolute', left: 90, top: 150, width: 860, fontFamily: FONT}}>
            {RULES.map((r, i) =>
              f >= w[i] ? (
                <div key={r} style={{transform: `scale(${pop(f - w[i], 10)})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 18, margin: '10px 0', padding: '10px 24px', background: 'rgba(14,10,36,0.86)', border: `4px solid ${[NEON.lime, NEON.cyan, NEON.pink, NEON.gold, NEON.orange][i]}`, borderRadius: 18, boxShadow: `0 0 16px ${[NEON.lime, NEON.cyan, NEON.pink, NEON.gold, NEON.orange][i]}`, color: '#fff', fontSize: 38, fontWeight: 700}}>
                  <span style={{fontSize: 44, color: [NEON.lime, NEON.cyan, NEON.pink, NEON.gold, NEON.orange][i]}}>{i + 1}</span>
                  {r} {f >= shine ? '✨' : ''}
                </div>
              ) : null,
            )}
          </div>
          <Flash t={f - shine} dur={10} />
          <SoundWord text="SPARKLE!" t={f - shine} x={1300} y={300} color={NEON.cyan} size={100} />
          <NeonGrade />
        </>
      }
    />
  );
};

// =============================================================== 14. OUTRO – Tyler's comeback (morning)
export const Outro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const hatch = s.cue('hatch');
  const sub = s.cue('sub');
  const end = s.beat('end');
  const clicked = f >= s.at('u505') - 20;
  const betsyX = interpolate(f, [s.at('u505') - 10, end.end], [2500, 1300], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 540, zoom: 1.05}},
    {f: 30, cam: {x: 900, y: 560, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: hatch, cam: {x: 1100, y: 560, zoom: 1.2}},
    {f: s.at('f558'), cam: {x: 460, y: 540, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('t511'), cam: {x: 820, y: 540, zoom: 1.6}},
    {f: s.at('f559'), cam: {x: 460, y: 520, zoom: 1.9}, ease: Easing.out(Easing.cubic)},
    {f: sub, cam: {x: 900, y: 560, zoom: 1.1}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 800, zoom: 1.6}}
      rim="#ffe9c0"
      set={
        <>
          <Driveway frame={f} time="day" />
          <Hatchback x={1200} y={900} s={1} />
        </>
      }
      actors={[
        {who: 'tyler', look: TYLER, x: 820, y: 900, facing: -1, pose: f < hatch ? 'up' : f < s.at('t511') ? 'point' : f < sub ? 'hold' : 'wave', holding: f >= s.at('t511') + 60 && f < sub ? <text fontSize={60} y={10}>🌮</text> : undefined, mood: 'happy'},
        {who: 'finn', look: FINN_05, x: 440, y: 900, facing: 1, pose: f < s.at('f558') ? 'down' : f < s.at('f559') ? 'up' : f < sub ? 'point' : 'wave'},
      ]}
      front={<>{f >= s.at('u505') - 10 && <Betsy x={betsyX} y={990} s={0.8} frame={f} puff={1} flip />}</>}
      overlay={
        <>
          <NeonChip t={f - 8} label="Tyler's comeback" color={NEON.lime} />
          <NeonTag t={f - hatch - 10} dur={s.at('t511') - hatch} text="USED · PAID IN CASH ✅" x="64%" y="22%" color={NEON.lime} size={66} />
          <NeonStat t={f - s.at('t511') - 10} dur={s.at('f559') - s.at('t511')} text="$500/mo → investing 📈" sub="automatic" x="56%" y="22%" size={84} color={NEON.lime} />
          <NeonStat t={f - s.at('t511') - 90} dur={s.at('f559') - s.at('t511') - 80} text="🍜 → 🌮" x="56%" y="42%" size={110} color={NEON.gold} />
          {f >= sub && f < end.start + 60 && (
            <div style={{position: 'absolute', left: '50%', top: '18%', transform: `translate(-50%,-50%) scale(${pop(f - sub, 14) * (clicked ? 0.95 : 1)})`, display: 'flex', alignItems: 'center', gap: 22, background: clicked ? '#3a3456' : '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '22px 52px', borderRadius: 70, border: `6px solid ${clicked ? NEON.lime : '#fff'}`, boxShadow: `0 0 30px ${clicked ? NEON.lime : '#ff0033'}`}}>
              {clicked ? 'SUBSCRIBED ✔' : 'SUBSCRIBE 🔔'}
            </div>
          )}
          <NeonStat t={f - sub - 60} dur={s.at('u505') - sub - 40} text="$0/mo · 0% APR" sub="best deal on the lot" x="50%" y="38%" size={70} color={NEON.cyan} />
          {clicked && <Confetti t={f - s.at('u505') + 20} />}
          {f >= end.start && <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [end.start + 20, end.end], [0, 1], clamp)}} />}
          <NeonGrade warm amount={0.5} />
        </>
      }
    />
  );
};
