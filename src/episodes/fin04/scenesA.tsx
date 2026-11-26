// fin04 scenes 1–7: corner store cold open, studio, Inflato's workshop (CPI), melting ice cream, 1985 roller rink,
// lemonade auction (why), 2022 roller coaster. Captions are 'chunks' (no speech bubbles).
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake, walk} from '../../stage/camera';
import {DustPuff, Emote, Flash, ImpactStars, Sparkles, SoundWord, SweatDrop, TitleCard, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {lookOf} from '../../cast';
import {Character} from '../../rig/Character';
import {BigStat, ChapterChip, Coin, Confetti, OfficeChair, Panel, Studio, clamp, pop, ramp} from '../fin02/kit';
import {Counter, InfoCard, Stamp} from '../fin03/scenesA';
import {
  Boardwalk, CandyBar, StoreCounter, COASTER, CoasterPark, CornerStore, FINN_04, IceCream, Inflato, KID_LOOKS, Park, PriceTag, RollerRink, RUTH_04, RUTH_85,
  ShoppingCart, Workshop, coasterPoint,
} from './kit';

const DOUG = lookOf('doug');

// =============================================================== 1. COLD OPEN – Doug's corner store
export const ColdOpen: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const coins = s.cue('coins');
  const puff = s.cue('puff');
  const title = s.beat('titleCard');
  const tagPuff = interpolate(f, [s.at('d401'), s.at('d401') + 20, puff, puff + 20], [1, 1.25, 1.25, 2.2], clamp);
  const inflatoIn = pop(f - puff - 10, 16);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1000, y: 560, zoom: 1.15}},
    {f: coins, cam: {x: 900, y: 580, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: s.at('d401'), cam: {x: 1300, y: 560, zoom: 1.55}},
    {f: s.at('u402'), cam: {x: 620, y: 560, zoom: 1.5}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('d402') - 4, cam: {x: 620, y: 560, zoom: 1.5}},
    {f: s.at('d402') + 4, cam: {x: 1300, y: 540, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f401'), cam: {x: 380, y: 540, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: puff, cam: {x: 1100, y: 500, zoom: 1.1}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f402'), cam: {x: 760, y: 540, zoom: 1.6}, ease: Easing.out(Easing.back(1.6))},
  ]);
  cam = shake(cam, f, puff + 20, 12, 10);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#ffe0b0"
      set={<CornerStore frame={f} />}
      actors={[
        {who: 'doug', look: DOUG, x: 1340, y: 650, facing: -1, pose: f < s.at('d402') ? 'cross' : 'hips', scale: 0.95},
        {who: 'ruth', look: RUTH_04, x: 610, y: 900, facing: 1, pose: f < coins ? 'hold' : f < s.at('u402') ? 'reach' : 'up', holding: f < coins + 10 ? <Coin x={0} y={0} r={14} /> : undefined, mood: s.after('u402') && !s.after('f401') ? 'surprised' : undefined},
        {who: 'finn', look: FINN_04, x: 360, y: 900, facing: 1, pose: f < s.at('f401') ? 'down' : f < puff ? 'point' : 'shrug'},
      ]}
      front={
        <>
          <StoreCounter />
          {f >= s.at('d401') && f < puff + 30 && <PriceTag x={1330} y={460 - (tagPuff - 1) * 40} s={tagPuff} text="$2.29" />}
          {f >= puff + 10 && <Inflato x={1360} y={360} s={0.9 * inflatoIn + 0.01} frame={f} talk={s.mouth('inflato')} puff={1.1} mood={f < s.at('f402') ? 'smug' : 'happy'} />}
          <Sparkles x={1360} y={360} t={f - puff - 10} r={180} />
          <Emote x={610} y={420} t={f - s.at('u402')} kind="!" dur={34} />
        </>
      }
      overlay={
        <>
          <SoundWord text="CLINK" t={f - coins} x={1050} y={420} color="#f6c945" size={70} />
          <BigStat t={f - s.at('u402') - 10} dur={s.at('f401') - s.at('u402')} text="35¢ → $2.29?!" x="50%" y="16%" size={120} color="#ff8f73" />
          <SoundWord text="PUFF!" t={f - puff - 10} x={1300} y={160} color="#ff4f6d" size={130} />
          {f >= title.start && <TitleCard t={f - title.start} dur={title.end - title.start} kicker="FINNOMICS 💸" title="Why Everything Costs More Now (Inflation Explained)" bg="#5a2a4a" />}
          <Vignette amount={0.28} />
        </>
      }
    />
  );
};

// =============================================================== 2. STUDIO (teal / yellow)
const SEAT = {x: 520, y: 862};
export const Intro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const moth = s.cue('moth');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.15}},
    {f: 20, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f404') - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f404') + 5, cam: {x: 560, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f405'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: moth, cam: {x: 1300, y: 460, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f406') + 40, cam: {x: 700, y: 520, zoom: 1.5}},
  ]);
  cam = drift(cam, f, 0.6);
  const shrink = interpolate(f, [s.at('f405') + 60, s.at('f405') + 160], [1, 0.6], clamp);
  return (
    <Stage
      cam={cam}
      vcam={{x: 760, zoom: 1.9}}
      rim="#c8fff0"
      set={<Studio frame={f} a="#0f3a3a" b="#1f8f7a" c="#f6c945" />}
      actors={[
        {who: 'finn', look: FINN_04, ...SEAT, sitting: true, facing: 1, pose: f < s.at('f404') ? 'wave' : f < s.at('f405') ? 'shrug' : f < moth ? 'point' : 'facepalm', mood: f >= moth ? 'worried' : undefined},
      ]}
      front={
        <>
          <Panel x={960} y={140} w={820} h={600} title={f < s.at('f405') ? 'FINNOMICS' : 'TODAY: INFLATION'} color={f < s.at('f405') ? '#1f8f7a' : '#ff4f6d'} s={pop(f, 10)}>
            {f < s.at('f405') ? (
              <MothPiggy f={f} />
            ) : (
              <g>
                <g transform={`translate(410 300) scale(${shrink})`}>
                  <rect x={-260} y={-110} width={520} height={220} rx={20} fill="#9fd8a0" stroke={INK} strokeWidth={6} />
                  <circle r={70} fill="#5fb37a" stroke={INK} strokeWidth={5} />
                  <text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
                    $
                  </text>
                </g>
                <text x={410} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK}>
                  your money… shrinking 😱
                </text>
              </g>
            )}
          </Panel>
          {f >= moth && (
            <g transform={`translate(${1370 + Math.sin(f / 7) * 60} ${330 + Math.cos(f / 5) * 20})`} stroke={INK} strokeWidth={3}>
              <ellipse cx={-14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#b9ae9e" />
              <ellipse cx={14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#cfc4b4" />
              <ellipse rx={8} ry={18} fill="#8d8273" />
              <circle cx={0} cy={-30} r={9} fill="#fff" />
              <text x={30} y={-30} fontSize={40} stroke="none">
                😰
              </text>
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="FINNOMICS · INFLATION 🎈" color="#5fd38a" dur={110} />
          <BigStat t={f - s.at('f404') - 4} dur={s.at('f405') - s.at('f404')} text="NOT FINANCIAL ADVICE" sub="(he's 14)" x="68%" y="30%" size={80} color="#ff8f73" rot={-6} />
          <Vignette amount={0.35} />
        </>
      }
    >
      <OfficeChair x={SEAT.x - 10} frame={f} color="#f6c945" />
    </Stage>
  );
};

const MothPiggy: React.FC<{f: number}> = ({f}) => (
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
    </g>
    <g transform={`translate(${410 + Math.sin(f / 7) * 60} ${170 + Math.cos(f / 5) * 20})`} strokeWidth={3}>
      <ellipse cx={-14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#b9ae9e" />
      <ellipse cx={14} cy={-10} rx={22} ry={16 * Math.abs(Math.sin(f * 0.9)) + 3} fill="#cfc4b4" />
      <ellipse rx={8} ry={18} fill="#8d8273" />
    </g>
    <text x={410} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e8553e" stroke="none">
      balance: $0.00 (+1 moth)
    </text>
  </g>
);

// =============================================================== 3. WHAT IS INFLATION – Inflato's workshop + CPI cart
export const What: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const pump = s.cue('pump');
  const cart = s.cue('cart');
  const items = [
    ['🍕', '$12', '$13'],
    ['🏠', '$1,500', '$1,580'],
    ['👟', '$80', '$88'],
  ];
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.15}},
    {f: pump, cam: {x: 1300, y: 480, zoom: 1.25}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f408'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('i403'), cam: {x: 1400, y: 420, zoom: 1.6}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('f410'), cam: {x: 960, y: 540, zoom: 1.05}},
    {f: s.at('i412'), cam: {x: 1380, y: 440, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.6);
  const puffing = f >= pump && f < s.at('f408');
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#ffc0d0"
      set={<Workshop frame={f} />}
      actors={[{who: 'finn', look: FINN_04, x: 420, y: 900, facing: 1, pose: f < pump ? 'point' : f < cart ? 'shrug' : 'point'}]}
      front={
        <>
          <Inflato x={1400} y={420} s={0.9} frame={f} talk={s.mouth('inflato')} puff={1 + (puffing ? Math.abs(Math.sin(f / 6)) * 0.15 : 0)} pump={puffing} mood={f >= s.at('i403') && f < s.at('f410') ? 'shock' : 'smug'} />
          {f >= cart && <ShoppingCart x={880} y={880} s={1.1 * pop(f - cart, 14) + 0.001} items={Math.min(8, Math.floor((f - cart) / 8) + 1)} frame={f} />}
          {f >= s.at('i412') && <ImpactStars x={880} y={600} t={(f - s.at('i412')) % 40} />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="WHAT IS INFLATION? 🎈" color="#ff9ec4" dur={130} />
          <InfoCard t={f - s.at('f407') - 20} dur={pump - s.at('f407') + 10} x="66%" y="22%" w={620} color="#ff4f6d" title="INFLATION =">
            prices go <b>up</b> → each dollar buys <b>less</b>
          </InfoCard>
          {puffing &&
            items.map(([e, a, b], i) => {
              const t = f - pump - 20 - i * 40;
              if (t < 0) return null;
              const up = t > 20;
              return (
                <div key={i} style={{position: 'absolute', left: 120 + i * 300, top: 150, transform: `scale(${pop(t, 10) * (up ? 1.15 : 1)})`, background: PAPER, border: `6px solid ${INK}`, borderRadius: 24, padding: '10px 22px', fontFamily: FONT, fontWeight: 700, fontSize: 46, color: INK, boxShadow: '8px 10px 0 rgba(0,0,0,0.3)'}}>
                  {e} <span style={{color: up ? '#e5302f' : INK}}>{up ? b : a}</span>
                </div>
              );
            })}
          <InfoCard t={f - s.at('f409') - 30} dur={s.at('i403') - s.at('f409') - 10} x="70%" y="20%" w={600} color="#4f9dde" title="CPI 🛒">
            <b>Consumer Price Index</b>: the price of a typical cart, checked every month
          </InfoCard>
          <BigStat t={f - s.at('f410') - 20} dur={s.at('i412') - s.at('f410')} text="cart +3% = inflation 3%" x="50%" y="14%" size={90} color="#f6c945" />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 4. MELTING ICE CREAM – cash loses value
export const Melt: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const melt = s.cue('melt');
  const rule = s.cue('rule');
  const m = interpolate(f, [melt, s.at('i404') + 60], [0, 0.26], clamp) + interpolate(f, [s.at('f457'), s.duration], [0, 0.25], clamp);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 900, y: 560, zoom: 1.2}},
    {f: melt, cam: {x: 1000, y: 600, zoom: 1.45}, ease: Easing.out(Easing.cubic)},
    {f: s.at('i404'), cam: {x: 1350, y: 460, zoom: 1.5}},
    {f: rule, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f415'), cam: {x: 640, y: 540, zoom: 1.7}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('f457'), cam: {x: 900, y: 560, zoom: 1.2}},
  ]);
  cam = drift(cam, f, 0.6);
  const value = 100 / Math.pow(1.03, interpolate(f, [s.at('f412') + 40, s.at('f412') + 200], [0, 10], clamp));
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.7}}
      rim="#fff0b0"
      set={<Boardwalk frame={f} />}
      actors={[{who: 'finn', look: FINN_04, x: 620, y: 900, facing: 1, pose: f < melt ? 'point' : f < s.at('f415') ? ['down', 'hold'] : 'facepalm', holding: f >= melt && f < s.at('f415') ? <g transform="translate(0 -20) scale(0.5)"><IceCream x={0} y={0} melt={m} frame={f} /></g> : undefined, mood: f >= s.at('f415') && f < s.at('f457') ? 'sad' : undefined}]}
      front={
        <>
          <IceCream x={1000} y={680} s={0.9} melt={m} frame={f} />
          {f >= s.at('i404') - 10 && <Inflato x={1380} y={380} s={0.7} frame={f} talk={s.mouth('inflato')} puff={1.15} mood="smug" />}
          <SweatDrop x={1000} y={520} t={(f - melt) % 50} />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="WHY CASH MELTS 🍦" color="#ffb8d6" dur={130} />
          <Counter t={f - s.at('f412') - 40} from={100} to={Math.round(value)} dur={1} hold={rule - s.at('f412') - 30} prefix="$" x="72%" y="18%" size={130} color={value < 99 ? '#ff8f73' : '#5fd38a'} sub={`buying power after ${Math.round(interpolate(f, [s.at('f412') + 40, s.at('f412') + 200], [0, 10], clamp))} yrs at 3%`} />
          {f >= rule && f < s.at('f415') && (
            <div style={{position: 'absolute', left: '50%', top: '24%', transform: `translate(-50%,-50%) rotate(-2deg) scale(${pop(f - rule, 12)})`, background: '#2f4a3a', border: `10px solid #a5703f`, borderRadius: 18, padding: '20px 44px', fontFamily: FONT, color: '#f4f1ea', textAlign: 'center', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
              <div style={{fontSize: 46, fontWeight: 700}}>RULE OF 72 ✏️</div>
              <div style={{fontSize: 58, fontWeight: 700, marginTop: 6}}>72 ÷ inflation % = years to double</div>
              {f >= s.at('f414') && (
                <div style={{fontSize: 50, fontWeight: 700, marginTop: 10, color: '#ffe94f'}}>
                  3% → ~24 yrs &nbsp;·&nbsp; 2% → ~36 yrs
                </div>
              )}
            </div>
          )}
          <BigStat t={f - s.at('f457') - 20} text="0.5% interest < 3% inflation" sub="still melting… just slower" x="50%" y="16%" size={84} color="#ff8f73" />
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

// =============================================================== 5. GRANDMA'S 1985 – roller rink flashback
export const Rink85: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const warp = s.cue('warp');
  const wage = s.cue('wage');
  const candy = s.cue('candy');
  const skate = Math.sin(f / 20);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.6, rot: 8}},
    {f: warp + 20, cam: {x: 960, y: 560, zoom: 1.05, rot: 0}, ease: Easing.out(Easing.cubic)},
    {f: wage, cam: {x: 1100, y: 540, zoom: 1.5}, ease: Easing.out(Easing.back(1.4))},
    {f: s.at('f417'), cam: {x: 900, y: 560, zoom: 1.15}},
    {f: candy, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('i405'), cam: {x: 1500, y: 420, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.6);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#ff9ef0"
      set={<RollerRink frame={f} />}
      actors={[
        {who: 'ruth', look: RUTH_85, x: 1100 + skate * 200, y: 900, facing: skate > 0 ? -1 : 1, pose: f < wage ? 'wave' : 'up', lean: skate * 0.06},
        {who: 'finn', look: FINN_04, x: 520, y: 900, facing: 1, pose: f < s.at('f417') ? 'think' : f < candy ? 'point' : 'hips'},
      ]}
      front={
        <>
          {f >= s.at('i405') - 10 && <Inflato x={1560} y={300} s={0.6} frame={f} talk={s.mouth('inflato')} puff={1.25} mood="happy" rot={-10} />}
        </>
      }
      overlay={
        <>
          <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)', mixBlendMode: 'screen'}} />
          <div style={{position: 'absolute', right: 70, top: 64, fontFamily: 'monospace', fontWeight: 700, fontSize: 44, color: '#fff', textShadow: '0 0 8px #ff4fd8'}}>▶ PLAY 1985</div>
          <ChapterChip t={f - 10} label="GRANDMA'S 1985 🛼" color="#ff9ef0" dur={130} />
          <Flash t={f - warp} dur={10} color="#ff9ef0" />
          {f >= s.at('f416') && f < candy && (
            <div style={{position: 'absolute', left: '50%', top: '20%', transform: `translate(-50%,-50%) scale(${pop(f - s.at('f416'), 12)})`, display: 'flex', gap: 26, fontFamily: FONT, fontWeight: 700}}>
              {[
                ['1985', '🍫 35¢', f >= wage ? '💼 $3.35/hr' : ''],
                ['TODAY', '🍫 ~$1.05*', f >= wage ? '💼 $7.25/hr**' : ''],
              ].map(([h, a, b], i) => (
                <div key={h} style={{background: i ? '#f4f1ea' : '#ffe0f6', border: `6px solid ${INK}`, borderRadius: 24, padding: '14px 30px', fontSize: 46, color: INK, textAlign: 'center', boxShadow: '8px 10px 0 rgba(0,0,0,0.3)'}}>
                  <div style={{color: i ? '#1f8f7a' : '#d83aa8'}}>{h}</div>
                  <div>{a}</div>
                  {b && <div>{b}</div>}
                </div>
              ))}
            </div>
          )}
          {f >= s.at('f416') && f < candy && (
            <div style={{position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)', fontFamily: FONT, fontWeight: 600, fontSize: 26, color: '#fff', textAlign: 'center', whiteSpace: 'nowrap', opacity: 0.9}}>
              *35¢ adjusted for ~3× US price growth since 1985 · **US federal minimum wage
            </div>
          )}
          <BigStat t={f - candy - 10} text="candy today: ~$2+ 🤨" sub="(more than average inflation)" x="50%" y="16%" size={96} color="#ffe94f" />
          <Vignette amount={0.35} />
        </>
      }
    />
  );
};

// =============================================================== 6. WHY IT HAPPENS – lemonade auction
export const Why: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const kids = s.cue('kids');
  const bid = s.cue('bid');
  const printer = s.cue('printer');
  const price = f < bid ? 1 : f < s.at('f422') ? [1, 5, 10][Math.min(2, Math.floor((f - bid) / 30))] : 10;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.15}},
    {f: kids, cam: {x: 1000, y: 560, zoom: 1.0}},
    {f: bid, cam: {x: 1150, y: 560, zoom: 1.35}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f422'), cam: {x: 960, y: 540, zoom: 1.0}},
    {f: printer, cam: {x: 960, y: 540, zoom: 1.0}},
  ]);
  cam = shake(cam, f, bid + 60, 10, 6);
  cam = drift(cam, f, 0.6);
  const kidX = [560, 720, 880];
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.6}}
      rim="#fff4b0"
      set={<Park frame={f} />}
      actors={[
        {who: 'finn', look: FINN_04, x: 1580, y: 900, facing: -1, pose: f < bid ? 'point' : f < s.at('f422') ? 'up' : 'shrug'},
        ...KID_LOOKS.map((look, i) => ({who: `kid${i}`, look, x: kidX[i], y: 920, facing: 1 as const, pose: (f >= bid && f < s.at('f422') ? 'up' : f >= kids ? 'hold' : 'down') as 'up', holding: f >= kids + 20 ? <BillWave t={f} i={i} /> : undefined, lockMood: true, mood: (f >= bid ? 'determined' : 'happy') as 'happy'})),
      ]}
      front={
        <>
          <g transform="translate(1160 560) rotate(6)">
            <rect x={-110} y={-60} width={220} height={120} rx={14} fill="#fff" stroke={INK} strokeWidth={6} />
            <text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={72} fill={price > 1 ? '#e5302f' : INK}>
              ${price}
            </text>
          </g>
          {f >= printer && (
            <g transform={`translate(${interpolate(f, [printer, printer + 20], [2200, 1560], clamp)} 880)`} stroke={INK} strokeWidth={5}>
              <rect x={-150} y={-240} width={300} height={240} rx={20} fill="#5fb37a" />
              <rect x={-110} y={-200} width={220} height={40} fill="#2b2333" />
              <text y={-100} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="none">
                MONEY PRINTER
              </text>
              {Array.from({length: 5}, (_, i) => {
                const t = (f * 4 + i * 40) % 200;
                return <rect key={i} x={-70 + Math.sin(i * 3) * 30} y={-200 - t} width={140} height={60} rx={6} fill="#9fd8a0" strokeWidth={3} transform={`rotate(${(t / 2) * (i % 2 ? 1 : -1)} 0 ${-170 - t})`} />;
              })}
            </g>
          )}
          {f >= printer && <Inflato x={1820} y={360} s={0.6} frame={f} talk={s.mouth('inflato')} puff={1.3} mood="happy" />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="WHY DOES IT HAPPEN? 🍋" color="#f6e27a" dur={130} />
          <InfoCard t={f - s.at('f419') - 20} dur={kids - s.at('f419') + 10} x="66%" y="22%" w={620} color="#ff8f3f" title="REASON #1">
            too much money 💵💵 chasing too few things 🍋
          </InfoCard>
          {f >= kids + 40 && f < bid && <BigStat t={f - kids - 40} text="+$10 each!" x="40%" y="18%" size={100} color="#5fd38a" />}
          <SoundWord text="SOLD!" t={f - bid - 100} x={1500} y={300} color="#ff8f73" size={120} />
          <InfoCard t={f - s.at('f422') - 120} dur={printer - s.at('f422') - 110} x="66%" y="22%" w={620} color="#e5302f" title="REASON #2">
            costs go up 🍋⬆ 🍬⬆ → prices go up
          </InfoCard>
          <InfoCard t={f - printer - 10} x="36%" y="22%" w={620} color="#5fb37a" title="REASON #3">
            print too much money → each dollar worth less 🥣💧
          </InfoCard>
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

const BillWave: React.FC<{t: number; i: number}> = ({t, i}) => (
  <g transform={`rotate(${Math.sin(t / 4 + i) * 20}) translate(0 -20)`} stroke={INK} strokeWidth={3}>
    <rect x={-40} y={-22} width={80} height={44} rx={6} fill="#9fd8a0" />
    <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#2f6a3a" stroke="none">
      $10
    </text>
  </g>
);

// =============================================================== 7. 2022 ROLLER COASTER
export const Coaster: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const climb = s.cue('climb');
  const drop = s.cue('drop');
  const t = interpolate(f, [0, climb, drop, s.duration], [0, 0.55, 0.7, 1], clamp);
  const p = coasterPoint(t);
  const p2 = coasterPoint(Math.min(1, t + 0.01));
  const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 560, zoom: 1.0}},
    {f: climb, cam: {x: p.x, y: p.y, zoom: 1.4}},
    {f: drop, cam: {x: 1300, y: 420, zoom: 1.5}},
    {f: s.at('f426'), cam: {x: 960, y: 560, zoom: 1.0}},
  ]);
  cam = shake(cam, f, drop, 20, 10);
  cam = drift(cam, f, 0.4);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1300, zoom: 1.6}}
      rim="#ffffff"
      set={<CoasterPark frame={f} />}
      actors={[]}
      front={
        <g transform={`translate(${p.x} ${p.y - 18}) rotate(${ang})`}>
          <g transform="translate(-20 -10) scale(0.45)">
            <path d="M -170 0 L 170 0 L 150 -90 L -150 -90 Z" fill="#4f9dde" stroke={INK} strokeWidth={8} />
            <g transform="translate(-70 -60) scale(0.9)">
              <ChunkActor who="finn" />
            </g>
            <g transform="translate(70 -60) scale(0.9)">
              <ChunkActor who="ruth" />
            </g>
            <circle cx={-110} cy={10} r={26} fill="#2b2333" />
            <circle cx={110} cy={10} r={26} fill="#2b2333" />
          </g>
        </g>
      }
      overlay={
        <>
          <ChapterChip t={f - 10} label="2022: THE WILD RIDE 🎢" color="#ff8f73" dur={130} />
          <BigStat t={f - climb - 30} dur={s.at('f426') - climb} text="9.1% (June 2022)" sub="US inflation · highest in ~40 years" x="50%" y="16%" size={100} color="#ff4f6d" />
          <BigStat t={f - s.at('f426') - 10} text="🛒⬆ ⛽⬆ 🏠⬆" x="50%" y="16%" size={110} color="#f6c945" />
          <div style={{position: 'absolute', left: 90, top: 150, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: INK, background: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '6px 14px', border: `4px solid ${INK}`}}>US inflation per year (CPI, %)</div>
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

/** A rider (head + torso) for the coaster car, with live lip-sync. */
const ChunkActor: React.FC<{who: 'finn' | 'ruth'}> = ({who}) => {
  const s = useScene();
  return (
    <Character uid={`coaster-${who}`} look={who === 'finn' ? FINN_04 : RUTH_04} frame={s.frame} mood={who === 'ruth' ? 'happy' : s.frame > s.at('f425') ? 'scared' : 'surprised'} talk={s.mouth(who)} facing={1} pose="up" sitting />
  );
};

