// fin05 scenes 1–7 (new neon look): driveway cold open, neon garage studio, Vinny's showroom, stretch-limo highway,
// loan drive-thru, depreciation gremlin car lot, underwater negative equity. Chunk captions (no bubbles).
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {DustPuff, Emote, Flash, ImpactStars, Sparkles, SoundWord, SweatDrop} from '../../fx/fx';
import {FONT, INK} from '../../lib/theme';
import {OfficeChair, SwipeCard, clamp, pop, ramp} from '../fin02/kit';
import {
  BarRow, BeastTruck, CarLot, Driveway, DriveThru, FINN_05, GarageScreen, GlassCard, Gremlin, Highway, Limo, MenuBoard, NEON, NeonChip, NeonGarage, NeonGrade,
  NeonStat, NeonTag, NeonTitle, RamenBowl, ShinyCar, Showroom, Snorkel, SpeakerPost, TYLER, Underwater, VINNY, ValueTag,
} from './kit';

const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;

// =============================================================== 1. COLD OPEN – Tyler's driveway at night
export const ColdOpen: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const noodles = s.cue('noodles');
  const title = s.beat('titleCard');
  const sat = f >= noodles;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1150, y: 520, zoom: 0.95}},
    {f: s.at('t501') + 30, cam: {x: 1000, y: 560, zoom: 1.15}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f501'), cam: {x: 560, y: 560, zoom: 1.55}, ease: Easing.out(Easing.cubic)},
    {f: s.at('t502'), cam: {x: 860, y: 520, zoom: 1.45}},
    {f: s.at('f502'), cam: {x: 520, y: 560, zoom: 1.7}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('t503'), cam: {x: 860, y: 500, zoom: 1.7}},
    {f: noodles, cam: {x: 930, y: 600, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f503'), cam: {x: 520, y: 540, zoom: 1.75}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 800, zoom: 1.6}}
      rim="#b8a8ff"
      set={
        <>
          <Driveway frame={f} time="night" />
          <BeastTruck x={1260} s={0.9} />
        </>
      }
      actors={[
        sat
          ? {who: 'tyler', look: TYLER, x: 930, y: 760, sitting: true, facing: -1, pose: ['down', 'hold'], holding: <RamenBowl steam={1} />, mood: 'sad'}
          : {who: 'tyler', look: TYLER, x: 820, y: 900, facing: -1, pose: f < s.at('f501') ? 'up' : f < s.at('t503') ? 'hips' : 'shrug'},
        {who: 'finn', look: FINN_05, x: 420, y: 900, facing: 1, pose: f < s.at('f501') ? 'down' : f < s.at('f503') ? 'think' : 'point', mood: f >= s.at('t503') && f < s.at('f503') ? 'surprised' : undefined},
      ]}
      front={<>{f >= s.at('t501') && f < s.at('f501') && <Sparkles x={1300} y={560} t={(f - s.at('t501')) % 50} r={260} color="#ffe7a0" />}</>}
      overlay={
        <>
          <NeonStat t={f - s.at('t502') - 10} dur={s.at('f502') - s.at('t502')} text="ONLY $1,000?" x="70%" y="22%" size={100} color={NEON.lime} rot={-4} />
          <NeonStat t={f - s.at('t503') - 20} dur={s.at('f503') - s.at('t503')} text="$1,000 × 84 MONTHS" sub="= $84,000 in payments" x="62%" y="20%" size={96} color={NEON.red} rot={-3} />
          <SoundWord text="SLURP" t={f - noodles - 30} x={1050} y={360} color="#ffd84a" size={90} />
          <NeonGrade />
          {f >= title.start && <NeonTitle t={f - title.start} dur={title.end - title.start} kicker="FINNOMICS 🚗" title="Why Car Payments Are Keeping You Poor" />}
        </>
      }
    />
  );
};

// =============================================================== 2. STUDIO – neon garage
const MothPiggy: React.FC<{f: number}> = ({f}) => (
  <g stroke={INK} strokeWidth={5}>
    <g transform={`translate(380 300) rotate(${Math.sin(f / 10) * 4})`}>
      <ellipse rx={140} ry={104} fill="#ff9ec4" />
      <ellipse cx={140} cy={10} rx={32} ry={38} fill="#ff86b2" />
      <circle cx={136} cy={0} r={6} fill={INK} />
      <circle cx={136} cy={22} r={6} fill={INK} />
      <rect x={-30} y={-108} width={70} height={12} rx={6} fill={INK} />
      <path d="M -70 -88 L -50 -140 L -20 -98 Z" fill="#ff86b2" />
      {[-84, -28, 36, 88].map((lx) => (
        <rect key={lx} x={lx - 16} y={82} width={32} height={42} rx={10} fill="#ff86b2" />
      ))}
      {/* tiny racing helmet on the moth's house */}
    </g>
    <g transform={`translate(${380 + Math.sin(f / 7) * 70} ${140 + Math.cos(f / 5) * 18})`} strokeWidth={3}>
      <ellipse cx={-14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#b9ae9e" />
      <ellipse cx={14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#cfc4b4" />
      <ellipse rx={8} ry={18} fill="#8d8273" />
      <path d="M -12 -26 Q 0 -44 12 -26 Z" fill="#ff7a1a" />
    </g>
    <text x={380} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={NEON.pink} stroke="none">
      balance: $0.00 (+1 moth)
    </text>
  </g>
);

const SEAT = {x: 470, y: 862};
export const Intro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const moth = s.cue('moth');
  const stat = s.cue('stat');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 480, zoom: 1.25}},
    {f: 24, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: moth - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: moth + 6, cam: {x: 1180, y: 470, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f505'), cam: {x: 560, y: 540, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f506'), cam: {x: 960, y: 540, zoom: 1.05}},
    {f: stat, cam: {x: 1000, y: 520, zoom: 1.15}},
    {f: s.at('f508'), cam: {x: 540, y: 560, zoom: 1.8}, ease: Easing.out(Easing.back(1.4))},
  ]);
  cam = drift(cam, f, 0.6);
  const screen = f < s.at('f506') ? 'piggy' : f < stat ? 'q' : 'stat';
  return (
    <Stage
      cam={cam}
      vcam={{x: 760, zoom: 1.9}}
      rim="#ff9be8"
      set={
        <>
          <NeonGarage frame={f} />
          <OfficeChair x={SEAT.x} frame={f} color="#ff7a1a" />
        </>
      }
      actors={[{who: 'finn', look: FINN_05, ...SEAT, sitting: true, facing: 1, pose: f < moth ? 'wave' : f < s.at('f505') ? 'facepalm' : f < s.at('f506') ? 'shrug' : f < stat ? 'think' : 'point'}]}
      front={
        <GarageScreen x={820} y={250} w={760} h={540} s={pop(f - 6, 12)} color={screen === 'stat' ? NEON.red : NEON.cyan} title={screen === 'piggy' ? 'FINNOMICS GARAGE' : screen === 'q' ? 'TODAY' : 'U.S. CAR PAYMENTS'}>
          {screen === 'piggy' && <MothPiggy f={f} />}
          {screen === 'q' && (
            <g>
              <text x={380} y={240} textAnchor="middle" fontSize={130}>
                🚗💸
              </text>
              <text x={380} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff">
                Why do car payments
              </text>
              <text x={380} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill={NEON.pink}>
                keep people poor?
              </text>
            </g>
          )}
          {screen === 'stat' && (
            <g>
              <text x={380} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={130} fill="#fff" filter="url(#nglow)">
                ~$750
              </text>
              <text x={380} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NEON.cyan}>
                average new-car payment / month
              </text>
              {f >= s.at('f507') + 100 &&
                Array.from({length: 5}, (_, i) => (
                  <text key={i} x={180 + i * 100} y={420} textAnchor="middle" fontSize={70} opacity={pop(f - s.at('f507') - 100 - i * 4, 8)}>
                    {i === 4 ? '😱' : '🙂'}
                  </text>
                ))}
              {f >= s.at('f507') + 100 && (
                <text x={380} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={NEON.red}>
                  1 in 5 pays $1,000+ a month
                </text>
              )}
            </g>
          )}
        </GarageScreen>
      }
      overlay={
        <>
          <NeonChip t={f - 10} label="Finnomics · car payments 🚗" color={NEON.pink} dur={120} />
          <NeonTag t={f - s.at('f505') - 6} dur={s.at('f506') - s.at('f505')} text="NOT FINANCIAL ADVICE" x="66%" y="24%" color={NEON.orange} size={62} rot={-6} />
          <NeonTag t={f - s.at('f508') - 30} text="= A SECOND RENT 🏠" x="68%" y="20%" color={NEON.red} size={72} rot={-5} />
          <NeonGrade />
        </>
      }
    />
  );
};

// =============================================================== 3. TRICK #1 – the monthly payment question
export const Monthly: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const freeze = s.cue('freeze');
  const total = s.cue('total');
  const frozen = f >= freeze && f < s.at('v502');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1100, y: 520, zoom: 1.0}},
    {f: 30, cam: {x: 1180, y: 520, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f509'), cam: {x: 600, y: 540, zoom: 1.8}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('f510'), cam: {x: 900, y: 540, zoom: 1.15}},
    {f: s.at('v508'), cam: {x: 1220, y: 520, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f561'), cam: {x: 620, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f511'), cam: {x: 960, y: 540, zoom: 1.1}},
    {f: s.at('v503'), cam: {x: 1220, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f512'), cam: {x: 620, y: 540, zoom: 1.8}, ease: Easing.out(Easing.back(1.6))},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.6}}
      rim="#fff0c8"
      set={
        <>
          <Showroom frame={f} freeze={frozen} />
          <ShinyCar x={950} y={880} s={0.95} color="#e5302f" />
          <g transform="translate(950 600)">
            <rect x={-120} y={-40} width={240} height={70} rx={12} fill="#fff" stroke={INK} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#e5302f">
              ONLY $299/mo*
            </text>
          </g>
        </>
      }
      actors={[
        {who: 'vinny', look: VINNY, x: 1350, y: 900, facing: -1, pose: f < s.at('f509') ? 'wave' : f < s.at('v508') ? 'hips' : f < s.at('f561') ? 'up' : f < s.at('v503') ? 'cross' : 'shrug', mood: f >= s.at('v503') && f < s.at('f512') ? 'worried' : undefined},
        {who: 'finn', look: FINN_05, x: 560, y: 900, facing: 1, pose: f < s.at('f509') ? 'down' : f < s.at('f511') ? 'point' : f < s.at('f512') ? 'think' : 'hips'},
      ]}
      front={
        <>
          {f >= s.at('v508') && f < s.at('f511') && <Sparkles x={1350} y={430} t={(f - s.at('v508')) % 40} r={140} />}
          <Emote x={1350} y={400} t={f - s.at('v503')} kind="..." dur={50} />
          <SweatDrop x={1410} y={440} t={f - s.at('v503') - 8} />
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="Trick #1: the monthly question" color={NEON.gold} />
          {frozen && <div style={{position: 'absolute', inset: 0, background: 'rgba(30,20,80,0.35)', mixBlendMode: 'multiply'}} />}
          <NeonTag t={f - freeze} dur={s.at('f510') - freeze + 10} text="⏸ TRICK #1" x="50%" y="18%" color={NEON.gold} size={90} rot={-4} />
          <GlassCard t={f - s.at('f510') - 10} dur={s.at('v502') - s.at('f510')} x="68%" y="34%" w={680} color={NEON.gold} title="you say $300/mo…">
            <div>⏩ they stretch the loan longer</div>
            {f >= s.at('f510') + 110 && <div style={{marginTop: 8}}>➕ they add stuff you didn't ask for</div>}
          </GlassCard>
          <GlassCard t={f - s.at('v508') - 10} dur={s.at('f511') - s.at('v508')} x="30%" y="30%" w={620} color={NEON.pink} title="+ $12 / month">
            <div>🛡️ rust-proof undercoating</div>
            <div>🫧 nitrogen in the tires</div>
            <div>🌲 air fresheners (lifetime!)</div>
          </GlassCard>
          <NeonStat t={f - s.at('f561') - 6} dur={s.at('f511') - s.at('f561')} text="$12 × 72 = $864" sub="for air fresheners 🌲" x="68%" y="22%" size={100} color={NEON.red} />
          <GlassCard t={f - total + 4} dur={s.at('f512') + 20 - total} x="50%" y="26%" w={900} color={NEON.lime} title="negotiate THIS number">
            <div style={{fontSize: 52, fontWeight: 700, textAlign: 'center', color: NEON.lime, textShadow: `0 0 14px ${NEON.lime}`}}>OUT-THE-DOOR PRICE</div>
            <div style={{textAlign: 'center', fontSize: 32}}>car + every fee + taxes → then talk loans</div>
          </GlassCard>
          <Emote x={600} y={420} t={f - s.at('f512')} kind="heart" dur={50} />
          <NeonGrade amount={0.6} />
        </>
      }
    />
  );
};

// =============================================================== 4. THE LONGER-LOAN TRAP – stretch limo on the highway
export const Stretch: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const m48 = s.cue('m48');
  const m72 = s.cue('m72');
  const m84 = s.cue('m84');
  const len = interpolate(f, [m48, m48 + 20, m72, m72 + 24, m84, m84 + 24], [120, 260, 260, 640, 640, 1000], {...clamp, easing: Easing.out(Easing.back(1.3))});
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: s.at('f513') + 40, cam: {x: 500, y: 560, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
    {f: m48, cam: {x: 1000, y: 560, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
    {f: m84, cam: {x: 1060, y: 540, zoom: 0.95}},
    {f: s.at('v504'), cam: {x: 1260, y: 560, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f517'), cam: {x: 520, y: 560, zoom: 1.55}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = shake(cam, f, m84, 14, 8);
  cam = drift(cam, f, 0.5);
  const row = (fr: number) => f - fr - 4;
  return (
    <Stage
      cam={cam}
      vcam={{x: 960, zoom: 1.4}}
      rim="#ffb27a"
      set={<Highway frame={f} speed={0.6} />}
      actors={[
        {who: 'vinny', look: VINNY, x: 1250, y: 930, facing: -1, pose: f < s.at('v504') ? 'wave' : 'up', scale: 0.85},
        {who: 'finn', look: FINN_05, x: 260, y: 960, facing: 1, pose: f < m48 ? 'think' : f < s.at('f516') ? 'point' : f < s.at('f517') ? 'facepalm' : 'hips', mood: f >= m84 && f < s.at('v504') ? 'surprised' : undefined},
      ]}
      front={
        <>
          <Limo x={1200} y={960} len={len} frame={f} s={0.8} />
          <DustPuff x={1200 - (len / 2 + 140) * 0.8} y={950} t={(f % 24)} dir={-1} n={4} />
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="The longer-loan trap" color={NEON.orange} />
          <NeonStat t={f - s.at('f513') - 10} dur={m48 - s.at('f513')} text="$40,000 @ 7%" sub="car loan" x="60%" y="24%" size={110} color={NEON.cyan} />
          {f >= m48 && (
            <GlassCard t={f - m48} x="64%" y="25%" w={760} color={NEON.orange} title="same car · longer loan">
              <BarRow t={row(m48)} label="4 yrs · $958/mo" value="$5,977 interest" frac={0.56} color={NEON.lime} dim={f >= m72} />
              <BarRow t={row(m72)} label="6 yrs · $682/mo" value="$9,101 interest" frac={0.85} color={NEON.gold} dim={f >= m84} />
              <BarRow t={row(m84)} label="7 yrs · $604/mo" value="$10,711 interest" frac={1} color={NEON.red} />
            </GlassCard>
          )}
          <NeonTag t={f - s.at('f517') - 20} text="LOWER PAYMENT ≠ CHEAPER CAR" x="58%" y="62%" color={NEON.red} size={62} rot={-4} />
          <NeonGrade warm />
        </>
      }
    />
  );
};

// =============================================================== 5. THE INTEREST RATE MENU – loan drive-thru
export const Rates: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const menu = s.cue('menu');
  const compare = s.cue('compare');
  const f519 = s.at('f519');
  const hi = f < menu ? 0 : f < f519 + 60 ? 1 : f < f519 + 120 ? 2 : f < s.at('s501') ? 3 : 3;
  const swipeIn = pop(f - s.at('s501') + 6, 14);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 700, y: 540, zoom: 1.05}},
    {f: menu, cam: {x: 1450, y: 480, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
    {f: s.at('s501') - 4, cam: {x: 1450, y: 480, zoom: 1.5}},
    {f: s.at('s501') + 4, cam: {x: 1140, y: 470, zoom: 1.9}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f520'), cam: {x: 920, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('s502'), cam: {x: 1140, y: 470, zoom: 1.9}},
    {f: compare, cam: {x: 900, y: 540, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f562'), cam: {x: 800, y: 540, zoom: 1.3}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.5}}
      rim="#ffcf9a"
      set={
        <>
          <DriveThru frame={f} />
          <MenuBoard x={1520} y={500} s={0.85} frame={f} highlight={hi} />
          <SpeakerPost x={1140} />
        </>
      }
      actors={[{who: 'finn', look: FINN_05, x: 920, y: 900, facing: 1, pose: f < menu ? 'wave' : f < s.at('f520') ? 'point' : f < compare ? 'hips' : f < s.at('f522') ? 'think' : 'up', mood: f >= s.at('f520') && f < compare ? 'angry' : undefined}]}
      front={
        <>
          {f >= s.at('s501') - 6 && (
            <g transform={`translate(1140 ${460 + (1 - swipeIn) * 120})`}>
              <SwipeCard x={0} y={0} s={0.42 * swipeIn + 0.01} frame={f} talk={s.mouth('swipe')} mood="sly" arms={f < s.at('s502') ? 'mic' : 'rub'} legs={false} hat="host" />
            </g>
          )}
          <SoundWord text="DING!" t={f - menu} x={1520} y={110} color={NEON.gold} size={80} />
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="The interest rate menu" color={NEON.orange} />
          <GlassCard t={f - compare} dur={s.at('f522') + 10 - compare} x="66%" y="30%" w={760} color={NEON.red} title="$20,000 used car · 6 years">
            <BarRow t={f - compare - 10} label="11% APR" value="≈ $7,409 interest" frac={0.48} color={NEON.gold} />
            <BarRow t={f - compare - 90} label="21% APR" value="≈ $15,332 interest" frac={1} color={NEON.red} />
            {f >= compare + 160 && <div style={{fontSize: 32, marginTop: 6, color: NEON.red}}>≈ the price of a second car 😬</div>}
          </GlassCard>
          <GlassCard t={f - s.at('f522') - 4} dur={s.at('f562') + 20 - s.at('f522')} x="66%" y="28%" w={720} color={NEON.lime} title="pro tip">
            <div>🏦 get pre-approved at a bank or credit union first</div>
            <div style={{marginTop: 6, color: NEON.lime}}>→ the dealer must BEAT that rate</div>
          </GlassCard>
          <GlassCard t={f - s.at('f562') - 6} x="66%" y="30%" w={720} color={NEON.cyan} title="better credit = cheaper loan">
            <div>✅ pay every bill on time</div>
            <div>✅ keep card balances low</div>
            <div style={{marginTop: 6, color: NEON.cyan}}>→ could save you thousands</div>
          </GlassCard>
          <NeonGrade warm />
        </>
      }
    />
  );
};

// =============================================================== 6. THE DEPRECIATION GREMLIN – car lot at dusk
export const GremlinScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const grem = s.cue('gremlin');
  const chomp = s.cue('chomp');
  const half = s.at('f525') + 130;
  const value = f < chomp ? 48000 : interpolate(f, [chomp, chomp + 30, half, half + 40], [48000, 38400, 38400, 24000], clamp);
  const bite = interpolate(f, [chomp, chomp + 30, half, half + 40], [0, 0.4, 0.4, 0.9], clamp);
  const gIn = pop(f - grem, 14);
  const chewing = f >= chomp;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 540, zoom: 1.05}},
    {f: grem, cam: {x: 1250, y: 560, zoom: 1.55}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f524'), cam: {x: 960, y: 540, zoom: 1.1}, ease: Easing.out(Easing.cubic)},
    {f: s.at('g502'), cam: {x: 1250, y: 560, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f563'), cam: {x: 820, y: 540, zoom: 1.2}},
    {f: s.at('f526'), cam: {x: 520, y: 540, zoom: 1.55}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = shake(cam, f, chomp, 12, 12);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.5}}
      rim="#c8a8ff"
      set={
        <>
          <CarLot frame={f} />
          <ShinyCar x={1050} y={880} s={1} color="#3ff0ff" bite={bite} />
          <ValueTag x={1050} y={520} value={value} s={0.9} color={value < 40000 ? NEON.red : NEON.lime} />
        </>
      }
      actors={[{who: 'finn', look: FINN_05, x: 420, y: 900, facing: 1, pose: f < grem ? 'point' : f < chomp ? 'shrug' : f < s.at('f526') ? 'point' : 'hips', mood: f >= grem && f < s.at('f524') ? 'scared' : undefined}]}
      front={
        <>
          {f >= grem && <Gremlin x={1280} y={640} s={0.85 * gIn + 0.01} frame={f} talk={s.mouth('gremlin')} chew={chewing && !s.activeLine('gremlin')} />}
          <ImpactStars x={900} y={720} t={f - chomp} color={NEON.lime} />
          <SoundWord text="CHOMP!" t={f - chomp} x={1250} y={380} color={NEON.lime} size={110} />
          <SoundWord text="CHOMP!" t={f - half} x={900} y={420} color={NEON.red} size={90} />
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="The depreciation gremlin" color={NEON.lime} />
          <NeonStat t={f - s.at('f524') - 60} dur={s.at('f525') - s.at('f524') - 40} text="−20%" sub="in year one (typical new car)" x="72%" y="22%" size={130} color={NEON.red} />
          <GlassCard t={f - s.at('f525') - 6} dur={s.at('f563') - s.at('f525')} x="72%" y="28%" w={640} color={NEON.red} title="$48,000 new car">
            <div>
              after 1 year: <b style={{color: NEON.gold}}>≈ $38,400</b>
            </div>
            <div style={{color: NEON.red}}>gone: ≈ $9,600 🫠</div>
            {f >= half && (
              <div style={{marginTop: 6}}>
                after ~5 years: <b style={{color: NEON.red}}>≈ half</b>
              </div>
            )}
          </GlassCard>
          <GlassCard t={f - s.at('f563') - 6} dur={s.at('f526') + 10 - s.at('f563')} x="72%" y="26%" w={640} color={NEON.cyan} title="used cars">
            <div>also lose value… but usually slower 🐢</div>
            <div style={{color: NEON.cyan}}>the biggest bite is already taken</div>
          </GlassCard>
          <NeonTag t={f - s.at('f526') - 10} text="A CAR IS NOT AN INVESTMENT" x="60%" y="20%" color={NEON.pink} size={64} rot={-5} />
          <NeonGrade />
        </>
      }
    />
  );
};

// =============================================================== 7. UNDERWATER ON YOUR CAR
export const UnderwaterScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const owe = s.cue('owe');
  const roll = s.cue('roll');
  const bob = (k: number) => Math.sin(f / 18 + k) * 14;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 380, zoom: 1.1}},
    {f: 30, cam: {x: 700, y: 560, zoom: 1.35}, ease: Easing.inOut(Easing.cubic)},
    {f: owe, cam: {x: 900, y: 560, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f528'), cam: {x: 960, y: 540, zoom: 1.05}},
    {f: roll, cam: {x: 1500, y: 540, zoom: 1.4}, ease: Easing.out(Easing.back(1.3))},
    {f: s.at('f529'), cam: {x: 960, y: 540, zoom: 1.05}, ease: Easing.out(Easing.cubic)},
    {f: s.at('t506'), cam: {x: 820, y: 560, zoom: 1.5}},
    {f: s.at('f530'), cam: {x: 760, y: 560, zoom: 1.3}},
  ]);
  cam = drift(cam, f, 0.8);
  const vinnyX = interpolate(f, [roll - 10, roll + 30], [2300, 1720], {...clamp, easing: Easing.out(Easing.cubic)});
  const FINN = {x: 470, y: 880 + bob(0)};
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.5}}
      rim="#bff3ff"
      set={
        <>
          <Underwater frame={f} />
          <BeastTruck x={1250} y={900} s={0.75} />
        </>
      }
      actors={[
        {who: 'tyler', look: TYLER, x: 800, y: 870 + bob(1), facing: -1, pose: f < owe ? 'up' : f < s.at('t506') ? 'shrug' : 'facepalm', mood: 'worried', lean: Math.sin(f / 20) * 4},
        ...(f >= roll - 10 ? [{who: 'vinny', look: VINNY, x: vinnyX, y: 820 + bob(2), facing: -1 as const, pose: 'wave' as const}] : []),
        {who: 'finn', look: FINN_05, ...FINN, facing: 1, pose: f < s.at('f528') ? 'point' : f < s.at('f530') ? 'think' : 'reach', lean: Math.sin(f / 22) * 3},
      ]}
      front={
        <>
          <Snorkel x={FINN.x + 18} y={FINN.y - 336} s={0.85} />
          {Array.from({length: 4}, (_, i) => {
            const k = ((f + i * 12) % 48) / 48;
            return <circle key={i} cx={800 + Math.sin(k * 6 + i) * 10} cy={420 - k * 200} r={8 + k * 10} fill="none" stroke="#fff" strokeWidth={3} opacity={1 - k} />;
          })}
        </>
      }
      overlay={
        <>
          <NeonChip t={f - 8} label="Underwater on your car" color={NEON.cyan} />
          <NeonStat t={f - s.at('f527') - 70} dur={owe - s.at('f527') - 60} text="NEGATIVE EQUITY" sub="you owe more than it's worth" x="50%" y="20%" size={100} color={NEON.cyan} />
          <GlassCard t={f - owe - 10} dur={roll - owe} x="70%" y="28%" w={620} color={NEON.cyan} title="the truck math">
            <BarRow t={f - owe - 14} label="you owe" value="$30,000" frac={1} color={NEON.red} />
            <BarRow t={f - owe - 40} label="it's worth" value="$24,000" frac={0.8} color={NEON.lime} />
            {f >= s.at('f528') && <div style={{fontSize: 48, fontWeight: 700, textAlign: 'center', color: NEON.red, textShadow: `0 0 12px ${NEON.red}`}}>−$6,000 underwater</div>}
          </GlassCard>
          <GlassCard t={f - roll - 20} dur={s.at('f529') + 140 - roll} x="30%" y="30%" w={660} color={NEON.red} title="the snowball ❄️">
            <div>next loan = new car + old $6,000</div>
            <div style={{color: NEON.red}}>→ underwater on day one</div>
          </GlassCard>
          <NeonStat t={f - s.at('f529') - 140} dur={s.at('t506') - s.at('f529') - 120} text="≈ 1 in 4" sub="trade-ins come with negative equity" x="50%" y="20%" size={120} color={NEON.red} />
          <NeonTag t={f - s.at('t506') - 30} dur={s.at('f530') + 20 - s.at('t506')} text="🛻 + 🛻 = 1 🛻 ?!" x="60%" y="18%" color={NEON.gold} size={70} />
          <NeonGrade amount={0.5} />
        </>
      }
    />
  );
};
