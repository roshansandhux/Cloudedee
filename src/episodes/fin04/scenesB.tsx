// fin04 scenes 8–14: shrinkflation (grocery), hyperinflation museum, thermostat control room, Doug's raise (store at night),
// down escalator (fight back), bowling game plan, sunset boardwalk outro.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk} from '../../stage/camera';
import {DustPuff, Emote, Flash, ImpactStars, MotionLines, Sparkles, SoundWord, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {lookOf} from '../../cast';
import {BigStat, ChapterChip, Coin, Confetti, SwipeCard, clamp, pop, ramp} from '../fin02/kit';
import {InfoCard, Stamp} from '../fin03/scenesA';
import {StoreCounter, Boardwalk, Bowling, CandyBar, CerealBox, ChipBag, ControlRoom, CornerStore, Escalator, FINN_04, Frame, Grocery, IceCream, Inflato, Museum, PriceTag, RUTH_04} from './kit';

const DOUG = lookOf('doug');

// =============================================================== 8. SHRINKFLATION – grocery aisle
export const Shrink: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const chips = s.cue('chips');
  const cereal = s.cue('cereal');
  const unit = s.cue('unit');
  const thin = ramp(f, cereal + 10, cereal + 60);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 700, y: 540, zoom: 1.6}},
    {f: chips, cam: {x: 1000, y: 600, zoom: 1.3}, ease: Easing.out(Easing.cubic)},
    {f: s.at('i407'), cam: {x: 1500, y: 440, zoom: 1.5}},
    {f: cereal, cam: {x: 1100, y: 600, zoom: 1.2}},
    {f: unit, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('u406'), cam: {x: 600, y: 560, zoom: 1.4}},
  ]);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.6}}
      rim="#e0f0ff"
      set={<Grocery frame={f} />}
      actors={[
        {who: 'finn', look: FINN_04, x: 520, y: 920, facing: 1, pose: f < chips ? 'think' : f < unit ? 'point' : 'hold', holding: f >= unit && f < s.at('u406') ? <MagGlass /> : undefined},
        ...(f >= s.at('u406') - 20 ? [{who: 'ruth', look: RUTH_04, x: 300, y: 920, facing: 1 as const, pose: 'hips' as const}] : []),
      ]}
      front={
        <>
          {f >= chips && <ChipBag x={980} y={900} s={0.9} open={ramp(f, chips + 30, chips + 50)} frame={f} />}
          {f >= cereal && (
            <>
              <CerealBox x={1300} y={900} s={0.9} thin={0} />
              <CerealBox x={1560} y={900} s={0.9} thin={thin} />
              <text x={1300} y={980} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK}>
                2019
              </text>
              <text x={1560} y={980} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#e5302f">
                now
              </text>
            </>
          )}
          {f >= s.at('i407') - 10 && f < cereal + 20 && <Inflato x={1560} y={380} s={0.55} frame={f} talk={s.mouth('inflato')} puff={1.1} mood="smug" />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="SNEAKY COUSIN: SHRINKFLATION 🕵️" color="#7fd3ff" dur={130} />
          <BigStat t={f - chips - 20} dur={cereal - chips - 10} text="SAME PRICE · LESS STUFF" x="62%" y="16%" size={84} color="#ff8f73" />
          {f >= unit && (
            <div style={{position: 'absolute', left: '62%', top: '30%', transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f - unit, 12)})`, background: '#fff', border: `6px solid ${INK}`, borderRadius: 14, padding: '16px 30px', fontFamily: FONT, color: INK, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)', minWidth: 520}}>
              <div style={{fontSize: 40, fontWeight: 700}}>O’s Cereal 340 g</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6}}>
                <div style={{fontSize: 74, fontWeight: 700}}>$4.99</div>
                <div style={{fontSize: 44, fontWeight: 700, color: '#e5302f', border: '5px solid #e5302f', borderRadius: 10, padding: '2px 12px'}}>$1.47 / 100 g</div>
              </div>
              <div style={{fontSize: 30, fontWeight: 600, color: '#e5302f', textAlign: 'right'}}>⬆ unit price — it can’t hide!</div>
            </div>
          )}
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

const MagGlass: React.FC = () => (
  <g stroke={INK} strokeWidth={5} transform="rotate(-30)">
    <rect x={-6} y={0} width={12} height={70} rx={4} fill="#6b4d3a" />
    <circle cx={0} cy={-36} r={38} fill="#bfe6ff" fillOpacity={0.6} />
  </g>
);

// =============================================================== 9. HYPERINFLATION – museum
export const Hyper: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const germany = s.cue('germany');
  const zim = s.cue('zim');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: germany, cam: {x: 560, y: 480, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: zim, cam: {x: 1380, y: 480, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: s.at('i408'), cam: {x: 1500, y: 520, zoom: 1.3}},
    {f: s.at('f434'), cam: {x: 960, y: 540, zoom: 1.0}},
  ]);
  cam = drift(cam, f, 0.4);
  return (
    <Stage
      cam={cam}
      vcam={{x: 960, zoom: 1.6}}
      rim="#fff4d0"
      set={<Museum frame={f} />}
      actors={[{who: 'finn', look: FINN_04, x: 960, y: 920, facing: f < zim ? -1 : 1, pose: f < germany ? 'point' : f < s.at('f434') ? 'up' : 'hips', mood: f >= s.at('f434') ? 'happy' : undefined}]}
      front={
        <>
          <Frame x={540} y={480} w={520} h={300} title="GERMANY · 1923">
            <g transform="translate(260 200)" stroke={INK} strokeWidth={4}>
              <path d="M -160 20 L 120 20 L 160 -60 L -120 -60 Z" fill="#8a6a4a" />
              {Array.from({length: 14}, (_, i) => (
                <rect key={i} x={-110 + (i % 7) * 34} y={-110 - Math.floor(i / 7) * 26} width={44} height={24} rx={3} fill="#c8d8a0" strokeWidth={2} />
              ))}
              <circle cx={-90} cy={40} r={26} fill="#2b2333" />
              <path d="M 120 -20 L 220 -80" strokeWidth={8} />
              <text x={0} y={-150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={INK} stroke="none">
                🍞 = a wheelbarrow of cash
              </text>
            </g>
          </Frame>
          <Frame x={1380} y={480} w={560} h={300} title="ZIMBABWE · 2009">
            <g transform="translate(280 150)" stroke={INK} strokeWidth={4}>
              <rect x={-240} y={-90} width={480} height={180} rx={10} fill="#d8e8b0" />
              <rect x={-220} y={-70} width={440} height={140} rx={6} fill="none" strokeWidth={2} />
              <text y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#3a5a2a" stroke="none">
                ONE HUNDRED TRILLION
              </text>
              <text y={46} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#3a5a2a" stroke="none">
                $100,000,000,000,000
              </text>
            </g>
          </Frame>
          {/* velvet ropes */}
          {[340, 760, 1160, 1600].map((x) => (
            <g key={x} stroke={INK} strokeWidth={4}>
              <rect x={x - 6} y={760} width={12} height={130} fill="#c9a24a" />
              <circle cx={x} cy={756} r={12} fill="#c9a24a" />
            </g>
          ))}
          <path d="M 340 770 Q 550 830 760 770 M 1160 770 Q 1380 830 1600 770" fill="none" stroke="#a8222b" strokeWidth={10} />
          {f >= s.at('i408') - 10 && f < s.at('f434') + 30 && <Inflato x={1660} y={300} s={0.55} frame={f} talk={s.mouth('inflato')} puff={1.2} mood="happy" />}
          {f >= s.at('f458') && f < zim && (
            <g transform="translate(560 700)">
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${-30 + i * 30} 0 Q ${-40 + i * 30} -40 ${-20 + i * 30} -70 Q ${-10 + i * 30} -40 ${10 + i * 30} 0 Z`} fill={['#ff8f3f', '#f6c945', '#e5302f'][i]} stroke={INK} strokeWidth={3} transform={`scale(1 ${0.8 + 0.2 * Math.sin(f / 3 + i)})`} />
              ))}
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="WHEN IT GOES WILD 🏛️" color="#d8b24a" dur={130} />
          <BigStat t={f - s.at('f431') - 10} dur={germany - s.at('f431') + 10} text="HYPERinflation" x="50%" y="16%" size={110} color="#ff4f6d" />
          <BigStat t={f - germany - 30} dur={zim - germany - 20} text="prices doubled every few days" x="50%" y="7%" size={56} color="#f6c945" />
          <BigStat t={f - zim - 30} dur={s.at('f434') - zim - 20} text="100 TRILLION = not much 🤯" x="50%" y="7%" size={60} color="#f6c945" />
          <Stamp t={f - s.at('f434') - 20} text="SUPER RARE ✅" x="50%" y="16%" size={70} color="#2f8f5a" rot={-5} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 10. THE THERMOSTAT – central banks & interest rates
export const Thermo: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const hot = s.cue('hot');
  const cold = s.cue('cold');
  const heat = interpolate(f, [0, s.at('f436'), hot, hot + 40, cold, cold + 30, s.at('f438') + 60, s.duration], [0, 0, 0, 0.9, 0.9, -0.9, -0.9, 0], clamp);
  const infPuff = interpolate(heat, [-0.9, 0, 0.9], [0.55, 1, 1.4]);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.1}},
    {f: s.at('f436'), cam: {x: 1180, y: 540, zoom: 1.3}},
    {f: hot, cam: {x: 1100, y: 540, zoom: 1.0}},
    {f: cold, cam: {x: 1560, y: 460, zoom: 1.4}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f438'), cam: {x: 960, y: 540, zoom: 1.05}},
  ]);
  cam = shake(cam, f, hot + 20, 12, 6);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1100, zoom: 1.6}}
      rim="#bfe0ff"
      set={<ControlRoom frame={f} heat={heat} />}
      actors={[{who: 'finn', look: FINN_04, x: 560, y: 920, facing: 1, pose: f < hot ? 'point' : f < cold ? 'reach' : 'shrug'}]}
      front={
        <>
          <Inflato x={1640} y={420} s={0.6} frame={f} talk={s.mouth('inflato')} puff={infPuff} mood={heat < -0.3 ? 'cold' : heat > 0.3 ? 'happy' : 'smug'} />
          {heat < -0.3 && <Sparkles x={1640} y={420} t={(f - cold) % 40} color="#e6f6ff" r={160} />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="WHO FIGHTS INFLATO? 🌡️" color="#7fd3ff" dur={130} />
          <InfoCard t={f - s.at('f435') - 30} dur={s.at('f436') - s.at('f435') + 10} x="36%" y="22%" w={620} color="#4f9dde" title="CENTRAL BANKS 🏦">
            🇺🇸 the Fed · 🇨🇦 Bank of Canada
          </InfoCard>
          <BigStat t={f - s.at('f436') - 20} dur={hot - s.at('f436') - 10} text="target ≈ 2% a year" x="36%" y="16%" size={96} color="#5fd38a" />
          {f >= hot + 10 && f < cold && (
            <div style={{position: 'absolute', left: '34%', top: '22%', transform: `translate(-50%,-50%) scale(${pop(f - hot - 10, 12)})`, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 44}}>
              {['interest rates ⬆', 'borrowing costs more 💳', 'people spend less 🛍️', 'prices cool down ❄️'].map((t, i) => (
                <div key={t} style={{background: PAPER, border: `5px solid ${INK}`, borderRadius: 18, padding: '6px 20px', color: INK, opacity: f - hot - 10 > i * 25 ? 1 : 0}}>
                  {t}
                </div>
              ))}
            </div>
          )}
          <InfoCard t={f - s.at('f438') - 20} dur={s.at('f459') - s.at('f438')} x="36%" y="22%" w={620} color="#7fd3ff" title="DEFLATION ❄️">
            prices fall → people wait → businesses struggle
          </InfoCard>
          <BigStat t={f - s.at('f459') - 10} text="📰 “rates raised” = heat turned down" x="50%" y="14%" size={64} color="#f6c945" />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 11. DOUG'S RAISE – store at night (+ Mr. Swipe)
export const Raise: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const shrinkDoug = s.cue('shrinkDoug');
  const swipe = s.cue('swipe');
  const dougScale = interpolate(f, [shrinkDoug, shrinkDoug + 14, s.at('f440') + 40, s.at('f440') + 60], [0.95, 0.7, 0.7, 0.95], clamp);
  const swipeIn = pop(f - swipe, 12) * (1 - ramp(f, s.at('f441') + 60, s.at('f441') + 80));
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1300, y: 540, zoom: 1.5}},
    {f: s.at('f439'), cam: {x: 960, y: 560, zoom: 1.1}},
    {f: shrinkDoug, cam: {x: 1340, y: 600, zoom: 1.6}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f440'), cam: {x: 960, y: 560, zoom: 1.1}},
    {f: s.at('f460'), cam: {x: 700, y: 540, zoom: 1.5}},
    {f: s.at('u410'), cam: {x: 520, y: 520, zoom: 1.6}},
    {f: swipe, cam: {x: 960, y: 540, zoom: 1.05}},
  ]);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#c0a0ff"
      set={<CornerStore frame={f} night />}
      actors={[
        {who: 'doug', look: DOUG, x: 1340, y: 650, facing: -1, pose: f < shrinkDoug ? 'hips' : f < s.at('f440') ? 'up' : 'cross', scale: dougScale},
        {who: 'finn', look: FINN_04, x: 600, y: 900, facing: f >= s.at('f460') && f < swipe ? -1 : 1, pose: f < s.at('f460') ? 'point' : f < swipe ? 'hold' : 'fist'},
        {who: 'ruth', look: RUTH_04, x: 330, y: 900, facing: 1, pose: f >= s.at('u410') && f < swipe ? 'cross' : 'hips'},
      ]}
      front={
        <>
          <StoreCounter />
          {swipeIn > 0.02 && <SwipeCard x={1060} y={520} s={0.55 * swipeIn} frame={f} talk={s.mouth('swipe')} mood="sly" arms="wave" hat="tophat" legs={false} />}
          <ImpactStars x={1060} y={520} t={f - s.at('f441') - 60} />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE RAISE THAT ISN'T 💼" color="#c0a0ff" dur={130} />
          {f >= s.at('f439') && f < s.at('f440') + 20 && (
            <div style={{position: 'absolute', left: '50%', top: '11%', transform: `translate(-50%,-50%) scale(${pop(f - s.at('f439'), 12)})`, display: 'flex', gap: 24, alignItems: 'center', fontFamily: FONT, fontWeight: 700}}>
              <div style={{background: '#5fd38a', border: `6px solid ${INK}`, borderRadius: 20, padding: '10px 26px', fontSize: 50, color: '#fff', WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>raise +3%</div>
              <div style={{fontSize: 60, color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>−</div>
              <div style={{background: '#e5302f', border: `6px solid ${INK}`, borderRadius: 20, padding: '10px 26px', fontSize: 50, color: '#fff', WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>prices +5%</div>
              <div style={{fontSize: 60, color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>≈</div>
              <div style={{background: PAPER, border: `6px solid ${INK}`, borderRadius: 20, padding: '10px 26px', fontSize: 50, color: '#e5302f'}}>−2% 😩</div>
            </div>
          )}
          <BigStat t={f - s.at('f440') - 30} dur={s.at('f460') - s.at('f440') - 20} text="real pay = raise − inflation" x="50%" y="16%" size={80} color="#f6c945" />
          {f < swipe && <Stamp t={f - s.at('u410')} text="DENIED" x="30%" y="24%" size={90} rot={-12} />}
          <BigStat t={f - s.at('f441') - 20} text="card ~20%+ > inflation ~3%" sub="double ouch 💳🔥" x="50%" y="14%" size={78} color="#ff8f73" />
          <Vignette amount={0.35} />
        </>
      }
    />
  );
};

// =============================================================== 12. FIGHT BACK – the down escalator
export const Fight: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const cash = s.cue('cash');
  const invest = s.cue('invest');
  const skills = s.cue('skills');
  // Finn's position on the escalator: standing still drifts down; running climbs up
  const t = interpolate(f, [0, cash, invest, skills, skills + 60, s.duration], [0.5, 0.25, 0.25, 0.4, 0.85, 0.85], clamp);
  const ex = 500 + t * 1200;
  const ey = 860 - t * 500;
  const running = f > skills && f < skills + 60;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1100, y: 560, zoom: 1.0}},
    {f: cash, cam: {x: 900, y: 640, zoom: 1.25}},
    {f: invest, cam: {x: 1100, y: 560, zoom: 1.05}},
    {f: skills, cam: {x: 1100, y: 500, zoom: 1.05}},
    {f: skills + 60, cam: {x: 1300, y: 400, zoom: 1.0}},
    {f: s.at('u407'), cam: {x: 1150, y: 420, zoom: 0.95}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1100, zoom: 1.6}}
      rim="#fff0d0"
      set={<Escalator frame={f} />}
      actors={[
        {who: 'finn', look: FINN_04, x: ex, y: ey, facing: 1, pose: running ? 'fist' : f < cash ? 'point' : 'shrug', walking: running, run: running, walkPhase: f * 1.2},
        {who: 'doug', look: DOUG, x: 240, y: 900, facing: 1, pose: s.after('d405') ? 'think' : 'cross', scale: 0.95},
        {who: 'ruth', look: RUTH_04, x: 1880, y: 380, facing: -1, pose: s.after('u407') ? 'point' : 'wave'},
      ]}
      front={running ? <MotionLines x={ex - 120} y={ey - 200} frame={f} dir={-1} len={160} /> : null}
      overlay={
        <>
          <ChapterChip t={f - 10} label="HOW TO FIGHT BACK 🏃" color="#5fd38a" dur={130} />
          <InfoCard t={f - cash - 10} dur={invest - cash} x="70%" y="20%" w={560} color="#4f9dde" title="STEP 1 🧯">
            emergency fund in a <b>high-interest savings account</b>
          </InfoCard>
          <InfoCard t={f - invest - 10} dur={skills - invest} x="70%" y="22%" w={600} color="#5fb37a" title="STEP 2 📈">
            invest long-term money — usually beat inflation over long periods (<b>not every year</b>)
            {f >= s.at('f445') && <div style={{fontSize: 32, marginTop: 8}}>🇺🇸 also: I bonds &amp; TIPS</div>}
          </InfoCard>
          <InfoCard t={f - skills - 10} dur={s.at('u407') - skills} x="34%" y="20%" w={560} color="#ff8f3f" title="STEP 3 🚀">
            grow your income: skills, side hustle, ask for a raise
          </InfoCard>
          <InfoCard t={f - s.at('u407') - 10} x="34%" y="20%" w={560} color="#a98bff" title="STEP 4 🛒">
            unit prices · store brands · wait for sales
          </InfoCard>
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

// =============================================================== 13. GAME PLAN – bowling scoreboard
const PLAN = ['🎈 prices rise, cash shrinks', '🏦 savings → high-interest account', '📈 invest long-term money', '🔍 check unit prices', '🚀 grow your income'];
export const Plan: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const cues = ['p1', 'p2', 'p3', 'p4', 'p5'].map((c) => s.cue(c));
  const strike = s.cue('strike');
  const ballT = ramp(f, strike - 30, strike);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.2}},
    {f: cues[0], cam: {x: 960, y: 520, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: strike - 30, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: strike, cam: {x: 960, y: 600, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = shake(cam, f, strike, 16, 12);
  cam = drift(cam, f, 0.4);
  return (
    <Stage
      cam={cam}
      vcam={{x: 960, zoom: 1.5}}
      rim="#ffe9a8"
      set={<Bowling frame={f} />}
      actors={[{who: 'finn', look: FINN_04, x: 380, y: 980, facing: 1, pose: f < strike - 30 ? 'point' : 'fist'}]}
      front={
        <>
          {f >= strike - 30 && f < strike + 10 && <circle cx={960} cy={1000 - ballT * 380} r={50 - ballT * 30} fill="#4f2a9a" stroke={INK} strokeWidth={5} />}
          {f >= s.at('i410') - 20 && <Inflato x={960 + (f > strike ? (f - strike) * 10 : 0)} y={520 - (f > strike ? (f - strike) * 6 : 0)} s={0.45} frame={f} talk={s.mouth('inflato')} puff={1} mood="shock" rot={f > strike ? (f - strike) * 12 : 0} />}
          <ImpactStars x={960} y={600} t={f - strike} s={1.4} />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="THE ANTI-INFLATO PLAN 🎳" color="#ffe94f" dur={100} />
          <div style={{position: 'absolute', left: '50%', top: 70, transform: 'translateX(-50%)', width: 1100, background: '#1c1c28', border: `7px solid ${INK}`, borderRadius: 26, padding: '16px 24px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
            <div style={{background: '#e5302f', borderRadius: 12, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 42, color: '#fff', padding: 6}}>🎳 SCOREBOARD 🎳</div>
            {PLAN.map((t, i) => {
              const p = pop(f - cues[i], 10);
              const active = f >= cues[i] && (i === 4 || f < cues[i + 1]);
              return (
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 10, transform: `scale(${p})`, opacity: p > 0 ? 1 : 0, background: active ? '#ffe94f' : '#2f3550', borderRadius: 12, padding: '8px 18px', fontFamily: FONT, fontWeight: 700, fontSize: 42, color: active ? INK : '#fff'}}>
                  <span style={{color: active ? INK : '#7fd3ff'}}>{i + 1}</span>
                  <span>{t}</span>
                  <span style={{marginLeft: 'auto'}}>{f >= cues[i] + 20 ? '✖' : ''}</span>
                </div>
              );
            })}
          </div>
          <SoundWord text="STRIKE!" t={f - strike} x={960} y={760} color="#ffe94f" size={140} />
          {f >= strike && <Confetti t={f - strike} seed={7} />}
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 14. OUTRO – boardwalk at sunset
export const Outro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const pin = s.cue('pin');
  const sub = s.cue('sub');
  const end = s.beat('end');
  const fly = f > pin + 6 ? f - pin - 6 : 0;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.2}},
    {f: pin, cam: {x: 1250, y: 460, zoom: 1.4}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f462'), cam: {x: 900, y: 560, zoom: 1.05}},
    {f: s.at('u408'), cam: {x: 760, y: 540, zoom: 1.4}},
    {f: sub, cam: {x: 960, y: 560, zoom: 1.05}},
    {f: s.at('f456'), cam: {x: 640, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: s.at('u409'), cam: {x: 900, y: 560, zoom: 1.1}},
  ]);
  cam = drift(cam, f, 0.5);
  const clicked = f >= s.at('f456') - 10;
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.6}}
      rim="#ffc9a0"
      set={<Boardwalk frame={f} time="sunset" />}
      actors={[
        {who: 'finn', look: FINN_04, x: 640, y: 920, facing: 1, pose: f < pin ? 'point' : f < s.at('u408') ? 'shrug' : f < sub ? 'hold' : 'wave', holding: f >= s.at('f454') && f < sub ? <CandyBar s={0.6} /> : undefined},
        {who: 'ruth', look: RUTH_04, x: 900, y: 920, facing: -1, pose: f < s.at('u408') ? 'hips' : 'reach'},
      ]}
      front={
        <>
          {f < pin + 140 && (
            <g transform={`translate(${1250 + fly * 14 + Math.sin(fly / 2) * 30} ${400 - fly * 9}) rotate(${fly * 25})`}>
              <Inflato x={0} y={0} s={0.7} frame={f} talk={s.mouth('inflato')} puff={interpolate(f, [pin + 6, pin + 60], [1.2, 0.5], clamp)} mood={f > pin + 6 ? 'shock' : 'smug'} />
            </g>
          )}
          {f >= pin - 10 && f < pin + 10 && (
            <g transform={`translate(${interpolate(f, [pin - 10, pin], [1000, 1180], clamp)} 420) rotate(-20)`} stroke={INK} strokeWidth={4}>
              <path d="M 0 0 L 80 0" strokeWidth={5} />
              <circle cx={-6} cy={0} r={12} fill="#e5302f" />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <SoundWord text="POP!" t={f - pin} x={1250} y={260} color="#ff4f6d" size={130} />
          <BigStat t={f - s.at('f462') - 10} dur={s.at('u408') - s.at('f462')} text="little bit every year → have a plan 📋" x="50%" y="14%" size={70} color="#f6c945" />
          {f >= sub && f < end.start + 60 && (
            <div style={{position: 'absolute', left: '50%', top: '16%', transform: `translate(-50%,-50%) scale(${pop(f - sub, 14) * (clicked ? 0.95 : 1)})`, display: 'flex', alignItems: 'center', gap: 22, background: clicked ? '#6b6b6b' : '#ff0033', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 64, padding: '22px 52px', borderRadius: 70, border: '7px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
              {clicked ? 'SUBSCRIBED ✔' : 'SUBSCRIBE 🔔'}
            </div>
          )}
          <BigStat t={f - s.at('f456') - 10} text="NEXT: YOUR FIRST $1,000 💵" sub="how a teenager can make money" x="64%" y="34%" size={84} color="#5fd38a" />
          <BigStat t={f - s.at('u409')} text="🧶 knitting empire?" x="78%" y="56%" size={70} color="#ff9ec4" rot={6} />
          {f >= end.start && <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [end.start + 20, end.end], [0, 1], clamp)}} />}
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};


