// fin02 scenes 1–7
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {Buildings, Ground, Sky} from '../../sets/sets';
import {Chair, Phone} from '../../props/props';
import {DustPuff, Emote, Flash, ImpactStars, Sparkles, SoundWord, SweatDrop, TitleCard, Vignette} from '../../fx/fx';
import {Character} from '../../rig/Character';
import {lookOf} from '../../cast';
import {FONT, INK, PAPER} from '../../lib/theme';
import {
  BankOffice, BigStat, Bill, CardProp, ChapterChip, Coin, CoffeeCounter, CoffeeShop, Kitchen, KitchenTable, LatteCup,
  OfficeChair, Panel, SnowHill, Studio, SwipeCard, TacoTruck, Tombstone, clamp, pop, ramp,
} from './kit';

const BARISTA = {skin: '#e0a37c', body: '#5a3a2a', legs: '#2b2333', shoes: '#2b2333', hair: 'bob' as const, hairColor: '#7a3b1e', outfit: 'shirt' as const, neck: 'none' as const, size: 0.92, blush: true};

// =============================================================== 1. COLD OPEN – the $14 latte
export const ColdOpen: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const tap = s.cue('tap');
  const startle = s.cue('startle');
  const freeze = s.cue('freeze');
  const receipt = s.cue('receipt');
  const title = s.beat('titleCard');
  const frozen = f >= freeze && f < s.at('f006');
  const h = hop(f, startle, 14, 90);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1000, y: 520, zoom: 1.0}},
    {f: tap - 10, cam: {x: 1150, y: 540, zoom: 1.25}},
    {f: s.at('f002'), cam: {x: 1300, y: 520, zoom: 1.45}},
    {f: s.at('s001') - 2, cam: {x: 1300, y: 520, zoom: 1.45}},
    {f: s.at('s001') + 6, cam: {x: 1440, y: 560, zoom: 1.9}, ease: Easing.out(Easing.cubic)},
    {f: startle, cam: {x: 1380, y: 520, zoom: 1.5}},
    {f: freeze + 1, cam: {x: 1300, y: 520, zoom: 1.3}},
    {f: s.at('f005') - 1, cam: {x: 1300, y: 520, zoom: 1.3}},
    {f: s.at('f005') + 5, cam: {x: 1360, y: 470, zoom: 1.9}, ease: Easing.out(Easing.back(2))},
    {f: s.at('f006'), cam: {x: 1250, y: 520, zoom: 1.2}},
  ]);
  cam = shake(cam, f, s.at('f005'), 12, 12);
  if (!frozen) cam = drift(cam, f, 0.5);
  const fr = frozen ? freeze : f; // freeze frame holds the animation clock
  const swipeUp = interpolate(f, [s.at('s001') - 4, s.at('s001') + 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const swipeHide = interpolate(f, [startle + 6, startle + 14], [1, 0], clamp);
  const finnPose = f < tap - 8 ? 'point' : f < tap + 20 ? 'reach' : f < startle ? 'hold' : frozen ? 'hips' : s.after('f005') && !s.after('f006') ? 'fist' : 'hold';
  return (
    <>
      <Stage
        cam={cam}
        vcam={{x: 1300, zoom: 2}}
        rim="#ffd59e"
        set={<CoffeeShop frame={fr} />}
        speakers={{swipe: {x: 1470, y: 560 - 90}}}
        actors={[
          {who: 'barista', look: BARISTA, x: 700, facing: 1, pose: f > tap ? 'wave' : 'down', mood: 'happy'},
          {
            who: 'finn',
            x: 1350,
            y: 900 + h.dy,
            squash: h.squash,
            facing: f < s.at('f002') ? -1 : 1,
            pose: finnPose as 'hold',
            holding: f < tap + 20 ? <CardProp /> : <LatteCup s={0.55} steam={fr} />,
            mood: frozen ? 'neutral' : undefined,
            look2: f >= s.at('f002') && f < s.at('s001') ? {x: 0, y: 0.1} : undefined,
          },
        ]}
        front={
          <>
            <CoffeeCounter readerLit={f >= tap ? 1 : 0} />
            {swipeUp > 0 && swipeHide > 0 && (
              <g opacity={swipeHide}>
                <SwipeCard x={1470} y={700 - 110 * swipeUp} s={0.32} frame={fr} talk={s.mouth('swipe')} mood="sly" arms="rub" legs={false} rot={-8} />
              </g>
            )}
            <Emote x={1350} y={430} t={f - startle} kind="!" dur={30} />
          </>
        }
        overlay={
          <>
            {frozen && <AbsoluteFill style={{background: 'rgba(40,60,120,0.28)', mixBlendMode: 'multiply'}} />}
            {frozen && (
              <div style={{position: 'absolute', right: 70, top: 64, fontFamily: FONT, fontWeight: 700, fontSize: 46, color: '#fff', WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill'}}>
                ❚❚ PAUSED
              </div>
            )}
            {f >= receipt && f < s.at('f006') && <Receipt t={f - receipt} />}
            <Flash t={f - freeze} dur={6} />
            <SoundWord text="BEEP!" t={f - tap} x={1050} y={330} color="#5fd38a" size={80} />
            {f >= title.start && <TitleCard t={f - title.start} dur={title.end - title.start} kicker="MONEY 101 · with Finn" title="How Credit Cards Secretly Make Money Off You" />}
            <Vignette amount={0.3} />
          </>
        }
      />
    </>
  );
};

const Receipt: React.FC<{t: number}> = ({t}) => {
  const h = interpolate(t, [0, 30], [0, 620], {...clamp, easing: Easing.out(Easing.cubic)});
  const rows: [string, string, string?][] = [
    ['Oat caramel latte', '$6.00'],
    ['Interest (min. payments)', '+$7.80', '#e8553e'],
  ];
  const total = interpolate(t, [36, 70], [6, 13.8], clamp);
  return (
    <div style={{position: 'absolute', left: 180, top: 60, width: 460, height: h, overflow: 'hidden', background: PAPER, border: `5px solid ${INK}`, borderTop: 'none', borderRadius: '0 0 12px 12px', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)', fontFamily: 'monospace', color: INK, transform: 'rotate(-3deg)'}}>
      <div style={{padding: '26px 30px', fontSize: 30}}>
        <div style={{textAlign: 'center', fontWeight: 700, fontSize: 34}}>BEAN ME UP</div>
        <div style={{textAlign: 'center', fontSize: 22, marginBottom: 20}}>receipt #00042</div>
        {rows.map(([a, b, c], i) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', color: c ?? INK, opacity: t > 10 + i * 14 ? 1 : 0, fontSize: 24, margin: '10px 0'}}>
            <span>{a}</span>
            <span>{b}</span>
          </div>
        ))}
        <div style={{borderTop: `3px dashed ${INK}`, margin: '20px 0'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 40}}>
          <span>TOTAL</span>
          <span style={{color: total > 6.01 ? '#e8553e' : INK}}>${total.toFixed(2)}</span>
        </div>
        <div style={{fontSize: 20, marginTop: 16, opacity: t > 70 ? 1 : 0}}>*paid over ~11 years. Thank you!</div>
      </div>
    </div>
  );
};

// =============================================================== 2. STUDIO INTRO – meet Mr. Swipe
const FINN_SEAT = {x: 520, y: 862};
const PANEL = {x: 960, y: 140, w: 820, h: 600};

export const Intro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const popAt = s.cue('swipePop');
  const shiny = s.cue('shiny');
  const sw = pop(f - popAt, 14);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.12}},
    {f: 20, cam: {x: 960, y: 540, zoom: 1.0}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f008') - 2, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f008') + 4, cam: {x: 600, y: 520, zoom: 1.6}, ease: Easing.out(Easing.cubic)},
    {f: s.at('f009') - 2, cam: {x: 600, y: 520, zoom: 1.6}},
    {f: s.at('f009') + 10, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: popAt + 2, cam: {x: 1200, y: 520, zoom: 1.25}, ease: Easing.out(Easing.back(1.5))},
    {f: s.at('f010'), cam: {x: 900, y: 540, zoom: 1.1}},
    {f: s.at('f011') - 2, cam: {x: 900, y: 540, zoom: 1.1}},
    {f: s.at('f011') + 6, cam: {x: 560, y: 520, zoom: 1.5}, ease: Easing.out(Easing.back(1.8))},
  ]);
  cam = drift(cam, f, 0.6);
  const lookAtShiny = f >= shiny && f < s.at('f011');
  const phase = f < s.at('f009') ? 'moth' : f < popAt ? 'card' : 'swipe';
  return (
    <Stage
      cam={cam}
      vcam={{x: 760, zoom: 1.9}}
      rim="#7ff0d0"
      set={<Studio frame={f} />}
      speakers={{swipe: {x: 1380, y: 330}}}
      actors={[
        {
          who: 'finn',
          ...FINN_SEAT,
          sitting: true,
          facing: 1,
          pose: f < s.at('f008') ? 'wave' : f < s.at('f009') ? 'shrug' : s.after('f011') ? 'fist' : f >= s.at('f010') ? 'hips' : 'point',
          look2: lookAtShiny ? {x: -0.8, y: -0.8} : undefined,
          mood: s.after('f011') ? 'determined' : undefined,
        },
      ]}
      front={
        <>
          {phase !== 'swipe' && (
            <Panel {...PANEL} title={phase === 'moth' ? 'MONEY 101' : 'Credit cards?'} color={phase === 'moth' ? '#7b5ea7' : '#f3b73c'} s={pop(f - (phase === 'moth' ? 0 : s.at('f009')), 10)}>
              {phase === 'moth' ? <MothPiggy f={f} /> : <ShinyCard f={f - s.at('f009')} />}
            </Panel>
          )}
          {phase === 'swipe' && (
            <g transform={`translate(0 ${(1 - sw) * 400})`}>
              <SwipeCard x={1380} y={560} s={1.25 * Math.max(0.01, sw)} frame={f} talk={s.mouth('swipe')} mood={f >= s.at('s003') ? 'shock' : 'happy'} arms={f >= s.at('s003') ? 'up' : 'wave'} hat="tophat" />
            </g>
          )}
          {f >= shiny && f < s.at('f011') + 10 && <Sparkles x={220} y={180} t={(f - shiny) % 40} r={80} />}
          {f >= shiny && f < s.at('f011') + 10 && (
            <g transform={`translate(220 180) rotate(${f * 3})`}>
              <path d="M 0 -40 L 10 -10 L 40 0 L 10 10 L 0 40 L -10 10 L -40 0 L -10 -10 Z" fill="#fff3a0" stroke={INK} strokeWidth={3} />
            </g>
          )}
          <DustPuff x={1380} y={760} t={f - popAt} n={8} />
        </>
      }
      overlay={
        <>
          <BigStat t={f - s.at('f008') - 6} dur={s.at('f009') - s.at('f008') - 4} text="NOT FINANCIAL ADVICE" sub="(he's literally 14)" x="68%" y="40%" size={80} color="#ff8f73" rot={-6} />
          <BigStat t={f - s.at('f011') - 10} dur={80} text="FOLLOW THE MONEY 💸" x="66%" y="16%" size={90} />
          <Vignette amount={0.35} />
        </>
      }
    >
      <OfficeChair x={FINN_SEAT.x - 10} frame={f} />
    </Stage>
  );
};

const MothPiggy: React.FC<{f: number}> = ({f}) => {
  const wing = Math.abs(Math.sin(f * 0.9));
  return (
    <g stroke={INK} strokeWidth={5}>
      <g transform={`translate(410 330) rotate(${Math.sin(f / 10) * 4})`}>
        <ellipse rx={150} ry={112} fill="#ff9ec4" />
        <ellipse cx={150} cy={10} rx={34} ry={40} fill="#ff86b2" />
        <circle cx={145} cy={0} r={6} fill={INK} />
        <circle cx={145} cy={22} r={6} fill={INK} />
        <path d="M 70 -30 q 12 -10 24 0" fill="none" />
        <rect x={-30} y={-116} width={70} height={12} rx={6} fill={INK} />
        <path d="M -70 -95 L -50 -150 L -20 -105 Z" fill="#ff86b2" />
        {[-90, -30, 40, 95].map((lx) => (
          <rect key={lx} x={lx - 16} y={88} width={32} height={46} rx={10} fill="#ff86b2" />
        ))}
      </g>
      <g transform={`translate(${410 + Math.sin(f / 7) * 60} ${180 + Math.cos(f / 5) * 20})`} strokeWidth={3}>
        <ellipse cx={-14} cy={-10} rx={22} ry={16 * wing + 3} fill="#b9ae9e" />
        <ellipse cx={14} cy={-10} rx={22} ry={16 * wing + 3} fill="#cfc4b4" />
        <ellipse rx={8} ry={18} fill="#8d8273" />
      </g>
      <text x={410} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e8553e" stroke="none">
        balance: $0.00 (and a moth)
      </text>
    </g>
  );
};

const ShinyCard: React.FC<{f: number}> = ({f}) => (
  <g>
    <g transform={`translate(410 330) rotate(${-8 + Math.sin(f / 12) * 6}) scale(2.6)`}>
      <CardProp />
    </g>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${410 + Math.cos(i * 1.3 + f / 20) * 230} ${320 + Math.sin(i * 1.7 + f / 15) * 160}) rotate(${f * 4 + i * 40}) scale(${0.6 + Math.abs(Math.sin(f / 8 + i)) * 0.6})`}>
        <path d="M 0 -30 L 8 -8 L 30 0 L 8 8 L 0 30 L -8 8 L -30 0 L -8 -8 Z" fill="#fff3a0" stroke={INK} strokeWidth={3} />
      </g>
    ))}
    <text x={410} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>
      FREE MONEY?!
    </text>
  </g>
);

// =============================================================== 3. IT'S A LOAN + Chad at the bank
export const Loan: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const bank = s.cue('bank');
  if (f >= bank) return <BankScene />;
  const flow1 = s.cue('flow1');
  const flow2 = s.cue('flow2');
  const contract = s.cue('contract');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1100, y: 500, zoom: 1.15}},
    {f: contract - 2, cam: {x: 1100, y: 500, zoom: 1.15}},
    {f: contract + 30, cam: {x: 1300, y: 700, zoom: 1.0}},
  ]);
  cam = drift(cam, f, 0.5);
  const scroll = interpolate(f, [contract, contract + 40], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <Stage
      cam={cam}
      vcam={{x: 1300, zoom: 1.6}}
      rim="#ffb36b"
      set={<Studio frame={f} a="#3b1f4a" b="#6b2f4a" c="#b3543a" />}
      actors={[{who: 'finn', ...FINN_SEAT, sitting: true, facing: 1, pose: f < flow1 ? 'shrug' : 'point', look2: {x: 0.8, y: -0.2}}]}
      front={
        <>
          <Panel {...PANEL} title="A credit card = a LOAN" color="#e8553e" s={pop(f, 12)}>
            <FlowDiagram t0={f} t1={f - flow1} t2={f - flow2} f={f} />
          </Panel>
          {scroll > 0 && (
            <g>
              <rect x={1250} y={700} width={220} height={60 + scroll * 340} fill={PAPER} stroke={INK} strokeWidth={4} />
              {Array.from({length: Math.floor(scroll * 14)}, (_, i) => (
                <path key={i} d={`M 1270 ${760 + i * 22} h ${120 + ((i * 37) % 60)}`} stroke="#9b93ab" strokeWidth={4} />
              ))}
              <ellipse cx={1360} cy={760 + scroll * 340} rx={120} ry={22} fill={PAPER} stroke={INK} strokeWidth={4} />
              <text x={1360} y={745} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={INK}>
                TERMS (page 1 of 40)
              </text>
            </g>
          )}
        </>
      }
      overlay={<Vignette amount={0.35} />}
    >
      <OfficeChair x={FINN_SEAT.x - 10} frame={f} color="#4f9dde" />
    </Stage>
  );
};

const FlowDiagram: React.FC<{t0: number; t1: number; t2: number; f: number}> = ({t0, t1, t2, f}) => {
  const nodes = [
    {x: 140, y: 330, label: 'YOU', icon: '🧒'},
    {x: 410, y: 200, label: 'BANK', icon: '🏦'},
    {x: 680, y: 330, label: 'STORE', icon: '🏪'},
  ];
  const coinT = t1 > 0 ? ((t1 % 40) / 40) : -1;
  return (
    <g>
      {nodes.map((n, i) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y}) scale(${pop(t0 - 12 - i * 6, 10)})`}>
          <circle r={80} fill="#fff" stroke={INK} strokeWidth={5} />
          <text y={22} textAnchor="middle" fontSize={70}>
            {n.icon}
          </text>
          <text y={120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={INK}>
            {n.label}
          </text>
        </g>
      ))}
      {t1 > 0 && (
        <g>
          <path d="M 480 240 Q 600 230 640 260" stroke="#2fbf71" strokeWidth={8} fill="none" markerEnd="" strokeDasharray="14 10" strokeDashoffset={-f * 2} />
          <Coin x={480 + 160 * coinT} y={240 + 30 * coinT} r={22} />
          <text x={590} y={210} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#2fbf71">pays</text>
        </g>
      )}
      {t2 > 0 && (
        <g opacity={pop(t2, 10)}>
          <path d="M 210 260 Q 260 200 340 220" stroke="#e8553e" strokeWidth={8} fill="none" strokeDasharray="14 10" strokeDashoffset={f * 2} />
          <g transform={`translate(270 ${200 + Math.sin(f / 6) * 6}) rotate(-12)`}>
            <rect x={-46} y={-26} width={92} height={52} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
            <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#e8553e">IOU</text>
          </g>
          <text x={410} y={530} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#e8553e">
            ...and now YOU owe the BANK
          </text>
        </g>
      )}
    </g>
  );
};

const BankScene: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const bank = s.cue('bank');
  let cam = camKeys(f, [
    {f: bank, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('c001') + 10, cam: {x: 1200, y: 500, zoom: 1.35}},
    {f: s.at('f015') - 1, cam: {x: 1200, y: 500, zoom: 1.35}},
    {f: s.at('f015') + 1, cam: {x: 760, y: 520, zoom: 1.5}},
    {f: s.at('c002') - 1, cam: {x: 760, y: 520, zoom: 1.5}},
    {f: s.at('c002') + 1, cam: {x: 1350, y: 470, zoom: 1.7}},
    {f: s.at('f016') - 1, cam: {x: 1350, y: 470, zoom: 1.7}},
    {f: s.at('f016') + 1, cam: {x: 960, y: 540, zoom: 1.05}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.7}}
      rim="#fff3c9"
      set={<BankOffice frame={f} />}
      actors={[
        {who: 'finn', x: 720, facing: 1, pose: s.after('f016') ? 'point' : s.after('f015') ? 'hips' : 'down', mood: s.after('f015') ? 'confused' : 'neutral'},
        {who: 'chad', x: 1420, y: 860, facing: -1, pose: s.after('c002') ? 'hold' : 'wave', mood: 'smug', lockMood: false},
      ]}
      front={
        <>
          {/* desk front so Chad stands behind it */}
          <rect x={1200} y={720} width={520} height={180} fill="#5a3322" stroke={INK} strokeWidth={4} />
          <rect x={1180} y={680} width={560} height={40} rx={8} fill="#6b3f2a" stroke={INK} strokeWidth={4} />
          {s.after('c002') &&
            Array.from({length: 10}, (_, i) => {
              const t = f - s.at('c002') - i * 6;
              if (t < 0) return null;
              return <Coin key={i} x={1250 + ((i * 97) % 420)} y={Math.min(680, -40 + t * 14)} r={22} rot={t * 8} />;
            })}
        </>
      }
      overlay={
        <>
          <BigStat t={f - s.at('c002') - 40} dur={120} text="3 WAYS" sub="(sometimes 6)" x="30%" y="28%" size={110} />
          <ChapterChip t={f - s.at('f016') - 30} label="WAY #1: THE STORE PAYS 🏪" color="#5fd38a" dur={200} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

// =============================================================== 4. ROSA'S TACO TRUCK – swipe fees
const TRUCK_X = 700;
export const Tacos: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const tap = s.cue('tap');
  const coins = s.cue('coins');
  const billion = s.cue('billion');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 520, zoom: 1.0}},
    {f: s.at('r001') + 10, cam: {x: 700, y: 520, zoom: 1.4}},
    {f: s.at('f017') - 1, cam: {x: 700, y: 520, zoom: 1.4}},
    {f: s.at('f017') + 1, cam: {x: 1300, y: 520, zoom: 1.35}},
    {f: s.at('r002'), cam: {x: 1000, y: 500, zoom: 1.15}},
    {f: coins, cam: {x: 1100, y: 460, zoom: 1.0}},
    {f: s.at('f019'), cam: {x: 1400, y: 500, zoom: 1.4}},
    {f: s.at('r004') - 1, cam: {x: 1400, y: 500, zoom: 1.4}},
    {f: s.at('r004') + 1, cam: {x: 760, y: 500, zoom: 1.5}},
    {f: s.at('f020') - 1, cam: {x: 760, y: 500, zoom: 1.5}},
    {f: s.at('f020') + 8, cam: {x: 1100, y: 520, zoom: 1.1}},
  ]);
  cam = drift(cam, f, 0.6);
  const billS = pop(f - s.at('r002'), 10);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.8}}
      rim="#fff3c9"
      set={
        <>
          <Sky frame={f} id="tacosky" />
          <Buildings base={870} seed="taco" />
          <Ground y={880} kind="street" />
          <TacoTruck x={TRUCK_X} frame={f} />
        </>
      }
      actors={[
        {who: 'rosa', x: TRUCK_X - 60, y: 900, facing: 1, pose: s.after('r004') && !s.after('f020') ? 'point' : s.after('r003') && !s.after('f019') ? 'shrug' : 'down', mood: s.after('r002') ? 'sad' : 'happy'},
        {who: 'finn', x: 1500, facing: -1, pose: f > tap - 10 && f < tap + 25 ? 'reach' : s.after('f019') && !s.after('r004') ? 'point' : 'down', holding: f < tap + 25 ? <CardProp /> : undefined},
      ]}
      front={
        <>
          {/* truck body below the window, in front of Rosa */}
          <g stroke={INK} strokeWidth={5}>
            <rect x={TRUCK_X - 480} y={690} width={960} height={150} fill="#ff8f3a" />
            <rect x={TRUCK_X - 480} y={720} width={960} height={120} rx={20} fill="#e8553e" />
            <rect x={TRUCK_X - 350} y={676} width={600} height={30} rx={6} fill="#c0c7d6" />
            {[-300, 380].map((wx) => (
              <g key={wx} transform={`translate(${TRUCK_X + wx} 850)`}>
                <circle r={62} fill="#2b2333" />
                <circle r={28} fill="#9aa3b5" />
              </g>
            ))}
            {[TRUCK_X - 200, TRUCK_X - 80].map((tx) => (
              <path key={tx} d={`M ${tx - 50} 676 q 50 -70 100 0 z`} fill="#f6c945" />
            ))}
          </g>
          {s.after('r002') && f < s.at('f019') && (
            <g>
              <Bill x={TRUCK_X + 80} y={330} s={billS} amount="10" />
              {[0, 1, 2].map((i) => {
                const t = f - coins - i * 6;
                if (t < 0) return null;
                const u = Math.min(1, t / 40);
                return <Coin key={i} x={TRUCK_X + 80 + u * (1650 - TRUCK_X - 80)} y={330 - Math.sin(u * Math.PI) * 220 + u * -80} r={26} rot={t * 10} />;
              })}
              {f >= coins && (
                <g transform={`translate(1650 230) scale(${pop(f - coins, 10)})`}>
                  <rect x={-150} y={-70} width={300} height={140} rx={20} fill={PAPER} stroke={INK} strokeWidth={5} />
                  <text y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK}>🏦 Card network</text>
                  <text y={34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={INK}>+ banks</text>
                </g>
              )}
            </g>
          )}
        </>
      }
      overlay={
        <>
          <BigStat t={f - s.at('r002') - 30} dur={s.at('r003') - s.at('r002') + 10} text="$9.70" sub="what Rosa keeps" x="40%" y="22%" size={100} color="#5fd38a" />
          <BigStat t={f - coins - 20} dur={s.at('f019') - coins - 20} text="2–3% PER SWIPE" x="50%" y="84%" size={84} color="#ff8f73" rot={2} />
          {f >= billion && f < s.at('r004') && <BillionCounter t={f - billion} />}
          <BigStat t={f - s.at('f020') - 30} dur={120} text="PRICES ↑ FOR EVERYONE" x="50%" y="20%" size={80} color="#f6c945" />
          <ChapterChip t={f} label="WAY #1: SWIPE FEES 🌮" color="#5fd38a" dur={160} />
        </>
      }
    />
  );
};

const BillionCounter: React.FC<{t: number}> = ({t}) => {
  const v = interpolate(t, [0, 50], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: '50%', top: '18%', transform: `translate(-50%, 0) scale(${pop(t, 10)})`, fontFamily: FONT, textAlign: 'center'}}>
      <div style={{fontWeight: 700, fontSize: 96, color: '#f6c945', WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill'}}>${Math.round(v)},000,000,000+</div>
      <div style={{fontWeight: 600, fontSize: 40, color: '#fff', WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>in swipe fees, every year (U.S.)</div>
    </div>
  );
};

// =============================================================== 5. GRANDMA RUTH – the proud deadbeat
export const Ruth: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const stamp = s.cue('stamp');
  const phone = s.cue('phone');
  const tomb = s.cue('tomb');
  const tombEnd = s.at('f024');
  const how = hop(f, s.at('f022'), 14, 80);
  let cam = camKeys(f, [
    {f: 0, cam: {x: 800, y: 520, zoom: 1.25}},
    {f: s.at('u001') - 1, cam: {x: 800, y: 520, zoom: 1.25}},
    {f: s.at('u001') + 12, cam: {x: 1150, y: 500, zoom: 1.5}},
    {f: s.at('f022') - 1, cam: {x: 1150, y: 500, zoom: 1.5}},
    {f: s.at('f022') + 1, cam: {x: 700, y: 480, zoom: 1.8}},
    {f: s.at('u002'), cam: {x: 960, y: 520, zoom: 1.1}},
    {f: s.at('f023'), cam: {x: 760, y: 520, zoom: 1.35}},
    {f: phone, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('u003'), cam: {x: 1150, y: 500, zoom: 1.45}},
    {f: tombEnd, cam: {x: 960, y: 540, zoom: 1.05}},
  ]);
  cam = drift(cam, f, 0.5);
  const ringing = f >= phone && f < s.at('c003');
  const onCall = f >= s.at('c003') - 10 && f < s.at('u003') + 20;
  return (
    <Stage
      cam={cam}
      vcam={{x: 950, zoom: 1.8}}
      rim="#fff6e0"
      set={<Kitchen frame={f} />}
      offscreen={{chad: -1}}
      actors={[
        {who: 'finn', x: 700, y: 900 + how.dy, squash: how.squash, facing: 1, pose: f < s.at('u001') ? 'point' : s.after('f023') && !s.after('phone') ? 'point' : 'down', mood: s.after('f022') && !s.after('u002') ? 'surprised' : undefined},
        {who: 'ruth', x: 1180, y: 900, sitting: true, facing: -1, pose: s.after('u003') ? 'up' : s.after('u002') ? 'hold' : 'wave', mood: s.after('u003') ? 'determined' : 'happy', holding: s.after('u002') && !s.after('u003') ? <StatementProp /> : undefined},
      ]}
      front={
        <>
          <KitchenTable x={1180} />
          <g transform={`translate(1000 700) rotate(${ringing ? Math.sin(f * 1.5) * 10 : 0} 0 0)`}>
            <g transform="scale(1.4)">
              <Phone lit={ringing} />
            </g>
          </g>
          {ringing && <SoundWordWorld x={1000} y={600} />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="WAY #2: … GRANDMA?" color="#e86a8f" dur={130} />
          {f >= stamp && f < s.at('f023') + 40 && <Stamp t={f - stamp} />}
          {f >= s.at('f023') + 20 && f < phone && <GraceTimeline t={f - s.at('f023') - 20} />}
          {onCall && <PhoneInset t={f - s.at('c003') + 10} f={f} talk={s.mouth('chad')} />}
          {f >= tomb && f < tombEnd && <ThoughtCloud t={f - tomb} />}
          {f >= tombEnd + 30 && <Dictionary t={f - tombEnd - 30} />}
          <Vignette amount={0.25} />
        </>
      }
    >
      <g transform="translate(1300 0)">
        <Chair x={0} y={900} color="#c98f5e" flip />
      </g>
    </Stage>
  );
};

const SoundWordWorld: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#f6c945" stroke={INK} strokeWidth={7} paintOrder="stroke">
      RING RING!
    </text>
  </g>
);

const StatementProp: React.FC = () => (
  <g transform="rotate(-10)">
    <rect x={-40} y={-56} width={80} height={104} rx={4} fill="#fff" stroke={INK} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M -28 ${-36 + i * 16} h 56`} stroke="#9b93ab" strokeWidth={3} />
    ))}
    <text y={38} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={16} fill="#2fbf71">PAID</text>
  </g>
);

const Stamp: React.FC<{t: number}> = ({t}) => {
  const s = interpolate(t, [0, 5, 9], [3, 0.9, 1], clamp);
  return (
    <div style={{position: 'absolute', left: '62%', top: '22%', transform: `translate(-50%,-50%) rotate(-12deg) scale(${s})`, opacity: Math.min(1, t / 3), fontFamily: FONT, fontWeight: 700, fontSize: 88, color: '#e8553e', border: '10px solid #e8553e', borderRadius: 20, padding: '6px 30px', background: 'rgba(255,250,241,0.85)', whiteSpace: 'nowrap'}}>
      PAID IN FULL ✓
    </div>
  );
};

const GraceTimeline: React.FC<{t: number}> = ({t}) => {
  const steps = [
    ['🛒', 'You buy stuff'],
    ['📄', 'Statement arrives'],
    ['✅', 'Pay it ALL by the due date'],
    ['🎉', '$0 interest'],
  ];
  return (
    <div style={{position: 'absolute', left: '50%', top: '14%', transform: 'translateX(-50%)', display: 'flex', gap: 18, fontFamily: FONT}}>
      {steps.map(([icon, label], i) => {
        const a = pop(t - i * 14, 10);
        return (
          <div key={label} style={{transform: `scale(${a})`, background: i === 3 ? '#5fd38a' : PAPER, border: `5px solid ${INK}`, borderRadius: 20, padding: '14px 18px', width: 230, textAlign: 'center', boxShadow: '6px 8px 0 rgba(0,0,0,0.25)'}}>
            <div style={{fontSize: 54}}>{icon}</div>
            <div style={{fontSize: 28, fontWeight: 700, color: INK}}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const PhoneInset: React.FC<{t: number; f: number; talk: number}> = ({t, f, talk}) => {
  const a = pop(t, 12);
  return (
    <div style={{position: 'absolute', left: 80, top: 160, width: 420, height: 420, borderRadius: 40, overflow: 'hidden', border: `8px solid ${INK}`, transform: `scale(${a}) rotate(-3deg)`, background: 'linear-gradient(#efe6d3, #d9ccb0)', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
      <svg width={420} height={420} viewBox="0 0 420 420">
        <rect x={40} y={40} width={50} height={380} fill="#fffaf1" stroke={INK} strokeWidth={3} />
        <rect x={330} y={40} width={50} height={380} fill="#fffaf1" stroke={INK} strokeWidth={3} />
        <g transform="translate(210 520) scale(0.95)">
          <Character uid="chad-inset" look={lookOf('chad')} frame={f} mood="smug" talk={talk} facing={1} pose={['down', 'think']} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: INK, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 28, textAlign: 'center', padding: 6}}>📞 Chad Ledger, VP</div>
    </div>
  );
};

const ThoughtCloud: React.FC<{t: number}> = ({t}) => {
  const a = pop(t, 12);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${a})`, width: 980, height: 640, borderRadius: '50%', background: 'radial-gradient(#ffe9c4, #f3c98a)', border: `8px solid ${INK}`, overflow: 'hidden', position: 'relative'}}>
        <svg width={980} height={640} viewBox="0 0 980 640">
          <rect width={980} height={640} fill="#ffb36b" opacity={0.4} />
          <circle cx={780} cy={160} r={70} fill="#fff3a0" />
          <Tombstone x={490} y={560} s={1.1} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Dictionary: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', right: 90, top: 150, width: 640, transform: `scale(${pop(t, 12)}) rotate(2deg)`, background: PAPER, border: `6px solid ${INK}`, borderRadius: 24, padding: '24px 30px', fontFamily: FONT, color: INK, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
    <div style={{fontSize: 56, fontWeight: 700}}>
      dead·beat <span style={{fontSize: 30, fontWeight: 400, fontStyle: 'italic'}}>(n.)</span>
    </div>
    <div style={{fontSize: 32, marginTop: 10}}>Card-industry slang for a customer who pays the full balance every month — so the bank earns almost no interest from them.</div>
    <div style={{fontSize: 30, marginTop: 12, color: '#2fbf71', fontWeight: 700}}>Goal: be one. 💪</div>
  </div>
);

// =============================================================== 6. SNOWBALL / AVALANCHE – interest
const slopeY = (x: number) => {
  // quadratic bezier (-400,300) (600,420) (2320,860) – solve for t by sampling
  let best = 0;
  let bd = 1e9;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const bx = (1 - t) * (1 - t) * -400 + 2 * (1 - t) * t * 600 + t * t * 2320;
    const d = Math.abs(bx - x);
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  const t = best;
  return (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 420 + t * t * 860;
};

export const Snow: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const apr = s.cue('apr');
  const push = s.cue('push');
  const aval = s.cue('avalanche');
  const bury = s.beat('bury');
  const finnX = 360;
  const rollU = interpolate(f, [push, aval], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const ballX = finnX + 120 + rollU * 1500;
  const ballR = 40 + rollU * 230;
  const ballY = slopeY(ballX) - ballR + 20;
  const avalP = interpolate(f, [aval, aval + 22], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const buried = f >= aval + 16;
  const label = rollU < 0.25 ? '$500' : rollU < 0.55 ? '$1,200' : rollU < 0.85 ? '$3,000' : '$5,000';
  let cam = camKeys(f, [
    {f: 0, cam: {x: 700, y: 440, zoom: 1.4}},
    {f: apr, cam: {x: 900, y: 460, zoom: 1.15}},
    {f: push, cam: {x: 700, y: 440, zoom: 1.3}},
    {f: aval - 10, cam: {x: 1400, y: 560, zoom: 1.0}},
    {f: aval + 30, cam: {x: 600, y: 480, zoom: 1.3}},
    {f: s.at('s004'), cam: {x: 900, y: 460, zoom: 1.05}},
    {f: s.at('f030'), cam: {x: 450, y: 400, zoom: 1.8}},
  ]);
  cam = shake(cam, f, aval, 40, 18);
  const swipeSled = f >= s.at('s004') - 10;
  const sledU = interpolate(f, [s.at('s004') - 10, s.line('s004').end + 10], [0, 1], clamp);
  const sledX = 100 + sledU * 1700;
  return (
    <Stage
      cam={cam}
      vcam={{x: 700, zoom: 1.7}}
      rim="#ffffff"
      set={<SnowHill frame={f} />}
      speakers={{swipe: {x: sledX, y: slopeY(sledX) - 220}, finn: {x: 360, y: slopeY(360) - 200}}}
      actors={
        buried
          ? []
          : [{who: 'finn', x: finnX, y: slopeY(finnX) + 12, facing: 1, pose: f >= push ? 'reach' : f >= s.at('f027') ? 'point' : 'hold', mood: f >= s.at('f028') ? 'scared' : undefined, lean: f >= push && f < aval ? 10 : 0}]
      }
      front={
        <>
          {f < aval + 20 && (
            <g transform={`translate(${f < push ? finnX + 80 : ballX} ${f < push ? slopeY(finnX + 80) - 40 : ballY})`}>
              <g transform={`rotate(${rollU * 900})`}>
                <circle r={f < push ? 32 : ballR} fill="#fff" stroke={INK} strokeWidth={5} />
                <path d={`M ${-ballR * 0.5} ${-ballR * 0.3} q ${ballR * 0.3} ${-ballR * 0.2} ${ballR * 0.5} 0`} stroke="#c8d8e8" strokeWidth={6} fill="none" />
              </g>
              {f >= s.at('f027') + 120 && f < push && (
                <g>
                  <circle cx={-10} cy={-6} r={4} fill={INK} />
                  <circle cx={10} cy={-6} r={4} fill={INK} />
                  <circle cy={10} r={8} fill="#ff8fb3" stroke={INK} strokeWidth={3} />
                </g>
              )}
              <text y={f < push ? -50 : -ballR - 20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={f < push ? 36 : 36 + rollU * 40} fill="#e8553e" stroke={INK} strokeWidth={6} paintOrder="stroke">
                {f < push ? '$500' : label}
              </text>
            </g>
          )}
          {avalP > 0 && (
            <g>
              <path d={`M -400 ${-300} L ${-400 + avalP * 2700} ${-300} Q ${-200 + avalP * 2500} ${400} ${-400 + avalP * 2600} 1300 L -400 1300 Z`} fill="#fffaf1" stroke={INK} strokeWidth={6} opacity={interpolate(f, [aval + 30, aval + 50], [1, 0], clamp)} />
            </g>
          )}
          {buried && (
            <g>
              <path d="M 120 700 Q 360 420 640 700 Z" fill="#fffaf1" stroke={INK} strokeWidth={6} transform={`translate(0 ${slopeY(360) - 700 + 60})`} />
              <g transform={`translate(${finnX} ${slopeY(finnX) - 120})`}>
                <circle r={60} fill="#f3c49c" stroke={INK} strokeWidth={5} />
                <circle cx={-20} cy={-8} r={7} fill={INK} />
                <circle cx={20} cy={-8} r={7} fill={INK} />
                <path d={`M -24 ${-30} L -6 -22 M 24 -30 L 6 -22`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
                <ellipse cy={26} rx={14} ry={6 + s.mouth('finn') * 16} fill="#7a2d3a" stroke={INK} strokeWidth={3} />
                <path d="M -50 -40 Q 0 -90 50 -40 Q 0 -60 -50 -40 Z" fill="#3b2416" stroke={INK} strokeWidth={4} />
                <circle cx={40} cy={-52} r={20} fill="#fff" stroke={INK} strokeWidth={3} />
              </g>
            </g>
          )}
          {swipeSled && sledU < 1 && (
            <g>
              <circle cx={sledX} cy={slopeY(sledX) - 90} r={90} fill="#fff" stroke={INK} strokeWidth={5} />
              <SwipeCard x={sledX} y={slopeY(sledX) - 260} s={0.55} frame={f} talk={s.mouth('swipe')} mood="happy" arms="up" legs={false} rot={-10} />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="WAY #3: INTEREST ❄️" color="#7fd3ff" dur={150} />
          <BigStat t={f - apr} dur={s.at('f027') - apr + 20} text="~22% APR" sub="average U.S. card interest rate" x="62%" y="26%" size={120} color="#e8553e" />
          {f >= s.at('f027') && f < push && <BigStat t={f - s.at('f027') - 30} dur={push - s.at('f027')} text="interest on interest" x="62%" y="86%" size={70} color="#fff" rot={3} />}
          <SoundWord text="AVALANCHE!!" t={f - aval} x={960} y={300} color="#7fd3ff" size={150} />
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

// =============================================================== 7. THE MINIMUM PAYMENT TRAP
const FINN_OLD = {...lookOf('finn'), hairColor: '#cfcfd8', mustache: true, eyeBags: true, glasses: true};

export const Minimum: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const bill = s.cue('bill');
  const chart = s.cue('chart');
  const age = s.beat('aging');
  const unage = s.cue('unage');
  const better = s.cue('better');
  const bait = s.at('f036');
  const old = f >= age.start + 20 && f < unage;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.05}},
    {f: s.at('s005'), cam: {x: 1250, y: 470, zoom: 1.3}},
    {f: chart, cam: {x: 1150, y: 480, zoom: 1.12}},
    {f: age.start, cam: {x: 1150, y: 480, zoom: 1.12}},
    {f: age.start + 20, cam: {x: 560, y: 520, zoom: 1.7}, ease: Easing.out(Easing.cubic)},
    {f: unage, cam: {x: 560, y: 520, zoom: 1.7}},
    {f: unage + 16, cam: {x: 1100, y: 500, zoom: 1.1}},
    {f: bait, cam: {x: 760, y: 520, zoom: 1.3}},
  ]);
  cam = drift(cam, f, 0.5);
  const showSwipe = f >= s.at('s005') - 10 && f < s.line('s005').end + 20;
  const hookY = interpolate(f, [bait, bait + 20], [-300, 300], {...clamp, easing: Easing.out(Easing.back(1.4))});
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.8}}
      rim="#ffb36b"
      set={<Studio frame={f} a="#4a1f2a" b="#8a3a2a" c="#d98a3a" />}
      speakers={{swipe: {x: 880, y: 330}}}
      actors={[
        {who: 'finn', ...FINN_SEAT, sitting: true, facing: 1, look: old ? FINN_OLD : undefined, lean: old ? -8 : 0, pose: old ? ['down', 'hold'] : f >= bait ? 'point' : f >= chart ? 'point' : 'think', mood: old ? 'sad' : undefined, holding: old ? <WalkingStick /> : undefined},
      ]}
      front={
        <>
          <Panel {...PANEL} title={f < chart ? 'Your statement' : f < better ? '$2,000 @ 22% – minimum only' : 'Minimum vs. $100/month'} color={f < chart ? '#4f9dde' : f < better ? '#e8553e' : '#2fbf71'} s={pop(f - (f < chart ? bill : chart), 10)}>
            {f < chart ? <Statement t={f - bill} f={f} /> : <PayoffChart t={f - chart} t2={f - better} />}
          </Panel>
          {showSwipe && <SwipeCard x={880} y={560} s={0.6 * pop(f - s.at('s005') + 10, 10)} frame={f} talk={s.mouth('swipe')} mood="happy" arms="rub" />}
          {f >= bait && (
            <g transform={`translate(1370 ${hookY})`} stroke={INK} strokeWidth={5}>
              <path d="M 0 -900 V 0" strokeWidth={3} />
              <path d="M 0 0 v 60 a 34 34 0 0 1 -68 0" fill="none" strokeWidth={8} />
              <Bill x={-20} y={110} s={0.9} rot={Math.sin(f / 6) * 10} amount="25" />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="THE SNEAKIEST TRICK 🎣" color="#ff8f73" dur={150} />
          {f >= age.start && f < unage + 10 && <Calendar t={f - age.start} back={f >= unage} />}
          <BigStat t={f - s.at('f033') - 20} dur={age.start - s.at('f033') - 20} text="11.5 YEARS" sub="+ about $2,600 in interest" x="66%" y="86%" size={110} color="#e8553e" />
          <BigStat t={f - bait - 24} dur={140} text="IT'S BAIT 🎣" x="66%" y="84%" size={90} color="#f6c945" />
          <Vignette amount={0.35} />
        </>
      }
    >
      <OfficeChair x={FINN_SEAT.x - 10} frame={f} color="#2fbf71" />
    </Stage>
  );
};

const WalkingStick: React.FC = () => <path d="M 0 0 V 150 M 0 0 q 0 -20 -20 -20" stroke="#6b4d3a" strokeWidth={10} fill="none" strokeLinecap="round" />;

const Statement: React.FC<{t: number; f: number}> = ({t, f}) => (
  <g fontFamily={FONT} fill={INK}>
    <text x={60} y={170} fontSize={38}>Balance</text>
    <text x={760} y={170} fontSize={44} fontWeight={700} textAnchor="end">$2,000.00</text>
    <text x={60} y={240} fontSize={38}>Interest rate (APR)</text>
    <text x={760} y={240} fontSize={44} fontWeight={700} textAnchor="end" fill="#e8553e">22%</text>
    <path d="M 60 280 H 760" stroke={INK} strokeWidth={3} strokeDasharray="10 8" />
    <g transform={`translate(410 400) scale(${1 + Math.sin(f / 5) * 0.03})`}>
      <rect x={-330} y={-80} width={660} height={160} rx={24} fill="#fff3a0" stroke={INK} strokeWidth={5} />
      <text y={-14} textAnchor="middle" fontSize={40} fontWeight={600}>MINIMUM PAYMENT DUE</text>
      <text y={56} textAnchor="middle" fontSize={76} fontWeight={700} fill="#2fbf71">only $25!</text>
    </g>
    {t > 20 && <Sparkles x={700} y={330} t={(t - 20) % 45} r={60} />}
  </g>
);

const PayoffChart: React.FC<{t: number; t2: number}> = ({t, t2}) => {
  // precomputed: $2,000 @ 22%, min = 1% + interest ($25 floor) → 139 months; $100/mo → 26 months
  const x0 = 90;
  const x1 = 760;
  const yb = 520;
  const yt = 140;
  const months = 144;
  const minBal = (m: number) => {
    let b = 2000;
    for (let i = 0; i < m && b > 0; i++) {
      const it = (b * 0.22) / 12;
      const p = Math.max(25, it + 0.01 * b);
      b = Math.max(0, b + it - p);
    }
    return b;
  };
  const fixBal = (m: number) => {
    let b = 2000;
    for (let i = 0; i < m && b > 0; i++) {
      const it = (b * 0.22) / 12;
      b = Math.max(0, b + it - 100);
    }
    return b;
  };
  const X = (m: number) => x0 + ((x1 - x0) * m) / months;
  const Y = (b: number) => yb - ((yb - yt) * b) / 2000;
  const draw = ramp(t, 10, 120);
  const pts = (fn: (m: number) => number, upto: number) =>
    Array.from({length: Math.floor(upto) + 1}, (_, m) => `${m ? 'L' : 'M'} ${X(m)} ${Y(fn(m))}`).join(' ');
  const interest = Math.round(2600 * draw);
  return (
    <g fontFamily={FONT}>
      <path d={`M ${x0} ${yt - 20} V ${yb} H ${x1 + 20}`} stroke={INK} strokeWidth={6} fill="none" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <text key={y} x={X(y * 12)} y={yb + 40} textAnchor="middle" fontSize={26} fill="#6b6280">
          {y}y
        </text>
      ))}
      <text x={x0 - 14} y={yt + 8} textAnchor="end" fontSize={26} fill="#6b6280">$2k</text>
      <path d={pts(minBal, months * draw)} stroke="#e8553e" strokeWidth={12} fill="none" strokeLinecap="round" />
      {t2 > 0 && <path d={pts(fixBal, Math.min(26, 26 * ramp(t2, 0, 40)))} stroke="#2fbf71" strokeWidth={12} fill="none" strokeLinecap="round" />}
      <g transform="translate(560 190)">
        <rect x={-150} y={-46} width={300} height={92} rx={16} fill="#ffe1dc" stroke={INK} strokeWidth={4} />
        <text y={-8} textAnchor="middle" fontSize={26} fill={INK}>interest paid</text>
        <text y={34} textAnchor="middle" fontSize={40} fontWeight={700} fill="#e8553e">${interest.toLocaleString('en-US')}</text>
      </g>
      {t2 > 0 && (
        <g transform={`translate(300 300) scale(${pop(t2 - 20, 10)})`}>
          <rect x={-160} y={-50} width={320} height={100} rx={16} fill="#dcf5e6" stroke={INK} strokeWidth={4} />
          <text y={-8} textAnchor="middle" fontSize={28} fill={INK}>$100/month:</text>
          <text y={32} textAnchor="middle" fontSize={34} fontWeight={700} fill="#2fbf71">~2 yrs, ~$514</text>
        </g>
      )}
    </g>
  );
};

const Calendar: React.FC<{t: number; back: boolean}> = ({t, back}) => {
  const year = back ? 2026 : Math.min(2037, 2026 + Math.floor(t / 4));
  return (
    <div style={{position: 'absolute', right: 120, top: 120, width: 300, fontFamily: FONT, transform: `rotate(${Math.sin(t / 2) * 3}deg) scale(${pop(t, 8)})`, textAlign: 'center', background: PAPER, border: `6px solid ${INK}`, borderRadius: 20, overflow: 'hidden', boxShadow: '8px 10px 0 rgba(0,0,0,0.3)'}}>
      <div style={{background: '#e8553e', color: '#fff', fontWeight: 700, fontSize: 40, padding: 8}}>YEAR</div>
      <div style={{fontWeight: 700, fontSize: 110, color: INK}}>{year}</div>
    </div>
  );
};
