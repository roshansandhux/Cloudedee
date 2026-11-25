// fin02 scenes 8–13
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useScene} from '../../engine/SceneContext';
import {Stage} from '../../stage/Stage';
import {camKeys, drift, hop, shake} from '../../stage/camera';
import {Room} from '../../sets/sets';
import {Chair, Plant} from '../../props/props';
import {Emote, Flash, Sparkles, SoundWord, SweatDrop, Vignette} from '../../fx/fx';
import {FONT, INK, PAPER} from '../../lib/theme';
import {
  BigStat, Bill, CardProp, ChapterChip, Coin, CoffeeCounter, CoffeeShop, Confetti, FeeCard, GameShow, LatteCup, Mall,
  OfficeChair, Panel, Podium, ScoreGauge, Studio, SwipeCard, Wheel, clamp, pop, ramp,
} from './kit';

// =============================================================== 8. WHEEL OF POINTS – rewards
export const Rewards: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const lights = s.cue('lights');
  const spin = s.cue('spin');
  const math = s.cue('math');
  const chomp = s.cue('chomp');
  const wheelSpin = interpolate(f, [spin, spin + 80], [0, 1440 + 67], {...clamp, easing: Easing.out(Easing.cubic)});
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.25}},
    {f: lights + 20, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f037'), cam: {x: 520, y: 520, zoom: 1.5}},
    {f: s.at('s007'), cam: {x: 900, y: 500, zoom: 1.4}},
    {f: spin, cam: {x: 1300, y: 500, zoom: 1.2}},
    {f: s.at('f038'), cam: {x: 520, y: 520, zoom: 1.55}},
    {f: math, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('s008'), cam: {x: 900, y: 480, zoom: 1.6}},
  ]);
  cam = drift(cam, f, 0.6);
  const hostMood = s.after('s008') ? 'sad' : s.after('f038') ? 'shock' : 'happy';
  return (
    <Stage
      cam={cam}
      vcam={{x: 800, zoom: 1.8}}
      rim="#ff9ad5"
      set={<GameShow frame={f} lights={s.after('math') && !s.after('f040') ? 0.3 : 1} />}
      speakers={{swipe: {x: 900, y: 330}}}
      actors={[{who: 'finn', x: 480, y: 900, facing: 1, pose: s.after('f038') ? (s.after('f039') ? 'point' : 'think') : s.after('f037') ? 'up' : 'down', mood: s.after('math') && !s.after('f039') ? 'confused' : undefined}]}
      front={
        <>
          <Podium x={480} label={s.after('math') ? '−$98' : '2% BACK'} color="#4f9dde" />
          <Wheel x={1400} y={470} r={230} spin={wheelSpin} />
          <SwipeCard x={900} y={560} s={0.9} frame={f} talk={s.mouth('swipe')} mood={hostMood as 'happy'} arms={s.after('s008') ? 'down' : 'mic'} hat="host" />
        </>
      }
      overlay={
        <>
          <ChapterChip t={f - 30} label="REWARDS: WHO PAYS? 🎁" color="#a98bff" dur={150} />
          <Confetti t={f - s.line('s006').end + 10} />
          <Confetti t={f - s.at('s008') - 20} n={8} seed={3} />
          {f >= math && f < s.at('f039') + 10 && <Equation t={f - math} />}
          {f >= s.at('f039') + 10 && f < s.at('f040') && <WhoPays t={f - s.at('f039') - 10} />}
          {f >= s.at('f040') && f < s.at('s008') && <Chomp t={f - s.at('f040')} chompT={f - chomp} />}
          <Vignette amount={0.35} />
        </>
      }
    />
  );
};

const Equation: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: '50%', top: '24%', transform: `translate(-50%,-50%) scale(${pop(t, 10)})`, display: 'flex', gap: 22, alignItems: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 80, whiteSpace: 'nowrap'}}>
    {[
      ['$100 spent', '#fff'],
      ['−', '#fff'],
      ['$2 back', '#5fd38a'],
      ['=', '#fff'],
      ['$98 GONE', '#e8553e'],
    ].map(([txt, c], i) => (
      <span key={i} style={{color: c, WebkitTextStroke: `8px ${INK}`, paintOrder: 'stroke fill', opacity: t > i * 8 ? 1 : 0}}>
        {txt}
      </span>
    ))}
  </div>
);

const WhoPays: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: '50%', top: 110, transform: `translateX(-50%) scale(${pop(t, 10)})`, display: 'flex', gap: 30, alignItems: 'center', fontFamily: FONT}}>
    {[
      ['🌮', 'Swipe fees', 'from stores like Rosa’s'],
      ['💳', 'Interest', 'from people who carry a balance'],
    ].map(([icon, a, b], i) => (
      <div key={a} style={{background: PAPER, border: `6px solid ${INK}`, borderRadius: 22, padding: '16px 24px', width: 380, textAlign: 'center', opacity: t > i * 18 ? 1 : 0, boxShadow: '8px 10px 0 rgba(0,0,0,0.3)'}}>
        <div style={{fontSize: 70}}>{icon}</div>
        <div style={{fontSize: 44, fontWeight: 700, color: INK}}>{a}</div>
        <div style={{fontSize: 28, color: '#6b6280'}}>{b}</div>
      </div>
    ))}
    <div style={{fontSize: 90, color: '#fff', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill', fontWeight: 700}}>→ 🎁</div>
  </div>
);

const Chomp: React.FC<{t: number; chompT: number}> = ({t, chompT}) => {
  const mouth = Math.abs(Math.sin(t / 4)) * 40;
  const prey = interpolate(t, [0, 60], [0, 1], clamp);
  const eaten = chompT > 0;
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <g transform={`translate(${700 + prey * 200} 300)`}>
          <path d={`M 0 0 L ${Math.cos((mouth * Math.PI) / 180) * 170} ${-Math.sin((mouth * Math.PI) / 180) * 170} A 170 170 0 1 0 ${Math.cos((mouth * Math.PI) / 180) * 170} ${Math.sin((mouth * Math.PI) / 180) * 170} Z`} fill="#e8553e" stroke={INK} strokeWidth={8} />
          <circle cx={30} cy={-90} r={18} fill={INK} />
          <text x={-60} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">22%</text>
        </g>
        {!eaten && (
          <g transform={`translate(${1250 - prey * 150} 300)`}>
            <Coin x={0} y={0} r={70} face />
            <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#5fd38a" stroke={INK} strokeWidth={6} paintOrder="stroke">2%</text>
          </g>
        )}
        {eaten && (
          <text x={1150} y={330} fontFamily={FONT} fontWeight={700} fontSize={110} fill="#f6c945" stroke={INK} strokeWidth={10} paintOrder="stroke" transform={`rotate(-8 1150 330)`}>
            CHOMP!
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// =============================================================== 9. FEES – rapid-fire treadmill montage
export const Fees: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const cues = ['fee1', 'fee2', 'fee3', 'fee4'].map((c) => s.cue(c));
  const tired = s.cue('tired');
  const kinds = ['late', 'annual', 'atm', 'paris'] as const;
  let cur = -1;
  cues.forEach((c, i) => {
    if (f >= c && f < tired) cur = i;
  });
  const running = f < tired;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.1}},
    {f: cues[0], cam: {x: 960, y: 540, zoom: 1.0}},
    {f: tired, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: tired + 10, cam: {x: 700, y: 560, zoom: 1.35}},
    {f: s.at('s009'), cam: {x: 1000, y: 540, zoom: 1.1}},
  ]);
  cues.forEach((c) => (cam = shake(cam, f, c, 8, 10)));
  return (
    <Stage
      cam={cam}
      vcam={{x: 700, zoom: 1.8}}
      rim="#fff3c9"
      set={cur >= 0 ? <FeeCard kind={kinds[cur]} frame={f} t={f - cues[cur]} /> : <Studio frame={f} a="#14324a" b="#1f5f8a" c="#3fa0c0" />}
      speakers={{swipe: {x: 1450, y: 380}}}
      actors={[
        {who: 'finn', x: 360, y: 860, facing: 1, walking: running, run: running, walkPhase: f * 0.55, sitting: !running, pose: running ? 'down' : 'down', mood: running ? 'determined' : 'sleepy', lockMood: !running, scale: cur >= 0 ? 0.75 : 1},
      ]}
      front={
        <>
          <Treadmill x={360} f={running ? f : 0} s={cur >= 0 ? 0.75 : 1} />
          {!running && <SweatDrop x={420} y={420} t={(f - tired) % 30} />}
          {f >= s.at('s009') - 10 && (
            <g>
              {Array.from({length: 14}, (_, i) => (
                <Coin key={i} x={1380 + ((i * 53) % 220)} y={860 - Math.floor(i / 4) * 40} r={30} />
              ))}
              <SwipeCard x={1450} y={560} s={0.8} frame={f} talk={s.mouth('swipe')} mood="happy" arms="rub" />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="FEES, FEES, FEES 🏃" color="#ff8f73" dur={80} />
          <SoundWord text="KA-CHING!" t={f - s.at('s009') - 10} x={1500} y={200} color="#5fd38a" size={110} />
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

const Treadmill: React.FC<{x: number; f: number; s?: number}> = ({x, f, s = 1}) => (
  <g transform={`translate(${x} 900) scale(${s}) translate(0 -900)`} stroke={INK} strokeWidth={5}>
    <rect x={-170} y={870} width={340} height={40} rx={20} fill="#2b2b33" />
    {Array.from({length: 8}, (_, i) => (
      <path key={i} d={`M ${-160 + ((i * 45 + f * 12) % 320)} 880 v 20`} stroke="#6b7385" strokeWidth={4} />
    ))}
    <path d="M 150 870 L 190 620 L 140 600" fill="none" strokeWidth={10} stroke="#45455a" />
    <rect x={100} y={580} width={90} height={40} rx={8} fill="#2b2b33" />
    <text x={145} y={608} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={20} fill="#e8553e" stroke="none">-$$$</text>
  </g>
);

// =============================================================== 10. CARD BRAIN – the mall at night
export const Brain: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const cashPain = s.cue('cashPain');
  const cardTap = s.cue('cardTap');
  const auction = s.cue('auction');
  const whisper = s.cue('whisper');
  const flick = s.line('f052').start + 20;
  const walkX = interpolate(f, [0, 70], [-200, 760], {...clamp, easing: Easing.out(Easing.quad)});
  const bags = f >= cardTap + 20;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 760, y: 520, zoom: 1.15}},
    {f: cashPain, cam: {x: 760, y: 500, zoom: 1.5}},
    {f: cardTap, cam: {x: 900, y: 520, zoom: 1.2}},
    {f: auction, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: s.at('f051'), cam: {x: 760, y: 480, zoom: 1.7}},
    {f: whisper, cam: {x: 820, y: 440, zoom: 2.0}},
  ]);
  cam = drift(cam, f, 0.6);
  const swipeShoulder = f >= whisper - 6 && f < flick + 40;
  const flyT = Math.max(0, f - flick);
  return (
    <Stage
      cam={cam}
      vcam={{x: 800, zoom: 1.9}}
      rim="#c4a8ff"
      set={<Mall frame={f} />}
      speakers={{swipe: {x: 900, y: 360}}}
      actors={[
        {
          who: 'finn',
          x: walkX,
          facing: 1,
          walking: f < 70,
          walkPhase: walkX * 0.03,
          pose: f >= cardTap && f < s.at('f050') ? ['hold', 'hold'] : f >= cashPain && f < cardTap ? 'hold' : f >= s.at('f051') && f < whisper ? 'facepalm' : f >= s.at('f052') ? 'point' : 'down',
          holding: f >= cashPain && f < cardTap ? <Wallet /> : f >= cardTap && f < cardTap + 20 ? <CardProp /> : undefined,
          mood: f >= cashPain && f < cardTap ? 'sad' : f >= cardTap && f < auction ? 'happy' : undefined,
        },
      ]}
      front={
        <>
          {f >= cashPain && f < cardTap &&
            [0, 1, 2].map((i) => {
              const t = f - cashPain - i * 12;
              if (t < 0) return null;
              return <Bill key={i} x={860 + t * 6} y={560 - t * 4 + Math.sin(t / 4) * 20} s={0.6} rot={t * 3} amount="20" />;
            })}
          {bags && f < auction + 10 &&
            ['#e86a8f', '#4f9dde', '#f6c945', '#a98bff'].map((c, i) => (
              <g key={c} transform={`translate(${walkX + (i % 2 ? 90 : -90) + (i > 1 ? 30 : 0)} ${700 + (i > 1 ? 60 : 0)}) scale(${pop(f - cardTap - 20 - i * 6, 8)})`} stroke={INK} strokeWidth={4}>
                <rect x={-45} y={-40} width={90} height={100} rx={8} fill={c} />
                <path d="M -20 -40 q 20 -40 40 0" fill="none" />
              </g>
            ))}
          {swipeShoulder && (
            <g transform={`translate(${880 + flyT * 40} ${520 - flyT * 30 + flyT * flyT * 0.8}) rotate(${flyT * 25})`}>
              <SwipeCard x={0} y={0} s={0.28} frame={f} talk={s.mouth('swipe')} mood="sly" arms="rub" hat="tophat" legs={false} />
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="YOUR BRAIN ON CARDS 🧠" color="#c4a8ff" dur={150} />
          <BigStat t={f - cashPain - 20} dur={cardTap - cashPain - 10} text="“PAIN OF PAYING”" x="62%" y="24%" size={90} color="#ff8f73" />
          <SoundWord text="OUCH!" t={f - cashPain} x={1150} y={420} color="#e8553e" size={100} />
          <SoundWord text="TAP ✨" t={f - cardTap} x={1100} y={380} color="#5fd38a" size={100} />
          {f >= auction && f < s.at('f051') + 20 && <Auction t={f - auction} />}
          {f >= s.at('f051') && f < whisper && <ScamBrain t={f - s.at('f051')} />}
          <Vignette amount={0.4} />
        </>
      }
    />
  );
};

const Wallet: React.FC = () => (
  <g transform="rotate(-10)">
    <rect x={-40} y={-28} width={80} height={56} rx={10} fill="#8a5a3c" stroke={INK} strokeWidth={4} />
    <path d="M -40 -6 h 80" stroke={INK} strokeWidth={3} />
  </g>
);

const Auction: React.FC<{t: number}> = ({t}) => {
  const a = ramp(t, 20, 80);
  return (
    <div style={{position: 'absolute', left: '50%', top: 100, transform: `translateX(-50%) scale(${pop(t, 12)})`, width: 980, background: PAPER, border: `7px solid ${INK}`, borderRadius: 30, padding: '20px 40px', fontFamily: FONT, boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
      <div style={{fontSize: 44, fontWeight: 700, color: INK, textAlign: 'center'}}>🏀 MIT experiment: bids for game tickets</div>
      {[
        ['💵 Paying cash', 28, '#4f9dde'],
        ['💳 Paying by card', 60, '#e8553e'],
      ].map(([label, v, c]) => (
        <div key={label as string} style={{display: 'flex', alignItems: 'center', gap: 20, margin: '18px 0'}}>
          <div style={{width: 280, fontSize: 34, fontWeight: 700, color: INK}}>{label}</div>
          <div style={{height: 60, width: (v as number) * 9 * a, background: c as string, border: `5px solid ${INK}`, borderRadius: 14}} />
          <div style={{fontSize: 44, fontWeight: 700, color: INK, opacity: a}}>~${Math.round((v as number) * a)}</div>
        </div>
      ))}
      <div style={{fontSize: 26, color: '#6b6280', textAlign: 'center'}}>Prelec & Simester (2001) – average bids, roughly double with a card</div>
    </div>
  );
};

const ScamBrain: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', right: 140, top: 120, transform: `scale(${pop(t, 10)}) rotate(4deg)`}}>
    <svg width={420} height={340} viewBox="-210 -170 420 340">
      <path d="M -150 20 C -190 -60 -120 -140 -40 -130 C 0 -170 80 -150 110 -110 C 180 -100 190 -10 150 30 C 160 100 60 130 0 110 C -60 140 -150 100 -150 20 Z" fill="#ff9ec4" stroke={INK} strokeWidth={8} />
      <path d="M -100 -40 q 30 30 60 0 q 30 -30 60 0 q 30 30 60 0" fill="none" stroke="#e86a8f" strokeWidth={7} />
      <rect x={-140} y={-30} width={280} height={60} rx={30} fill={INK} />
      <circle cx={-60} cy={0} r={18} fill="#fff" />
      <circle cx={60} cy={0} r={18} fill="#fff" />
      <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#f6c945" stroke={INK} strokeWidth={6} paintOrder="stroke">SCAMMER 🦹</text>
    </svg>
  </div>
);

// =============================================================== 11. CREDIT SCORE – the video game
const GameWorld: React.FC<{frame: number}> = ({frame}) => (
  <g stroke={INK} strokeWidth={4}>
    <rect x={-400} y={-300} width={2720} height={1400} fill="#5c94fc" stroke="none" />
    {[200, 900, 1500].map((cx, i) => (
      <g key={cx} transform={`translate(${(cx + frame * 0.4) % 2200 - 100} ${130 + i * 40})`} fill="#fff" stroke="none">
        <rect x={-80} y={0} width={160} height={40} />
        <rect x={-50} y={-30} width={100} height={30} />
      </g>
    ))}
    <path d="M -400 700 L 100 700 L 100 600 L 300 600 L 300 700 L 2320 700 L 2320 900 L -400 900 Z" fill="#3fa34d" stroke="none" />
    {Array.from({length: 40}, (_, i) => (
      <rect key={i} x={-400 + i * 70} y={900} width={70} height={70} fill={i % 2 ? '#c84c0c' : '#e0703a'} />
    ))}
    {[1100, 1170, 1240].map((bx, i) => (
      <g key={bx}>
        <rect x={bx} y={420} width={70} height={70} fill={i === 1 ? '#f6c945' : '#c84c0c'} />
        {i === 1 && <text x={bx + 35} y={472} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#fff" stroke="none">?</text>}
      </g>
    ))}
    <path d="M 1700 900 V 760 h -40 v -60 h 160 v 60 h -40 V 900 Z" fill="#3fa34d" />
  </g>
);

export const Score: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const powerup = s.cue('powerup');
  const meter = s.cue('meter');
  const xp = s.cue('xp');
  const ruthIn = s.cue('ruthIn');
  const jump = hop(f, powerup - 10, 20, 160);
  const ruthY = interpolate(f, [ruthIn - 20, ruthIn + 10], [-500, 900], {...clamp, easing: Easing.out(Easing.bounce)});
  const score = interpolate(f, [meter, meter + 90], [300, 742], {...clamp, easing: Easing.out(Easing.cubic)});
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: powerup, cam: {x: 1000, y: 520, zoom: 1.2}},
    {f: meter, cam: {x: 960, y: 540, zoom: 1.0}},
    {f: ruthIn, cam: {x: 1300, y: 520, zoom: 1.3}},
    {f: s.at('f057'), cam: {x: 900, y: 500, zoom: 1.6}},
  ]);
  cam = shake(cam, f, ruthIn + 10, 14, 14);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1000, zoom: 1.8}}
      rim="#fff3a0"
      set={<GameWorld frame={f} />}
      actors={[
        {who: 'finn', x: 900, y: 900 + jump.dy, squash: jump.squash, facing: 1, pose: f >= powerup - 10 && f < powerup + 10 ? 'up' : s.after('xp') && !s.after('ruthIn') ? 'fist' : 'down', mood: s.after('f057') ? 'surprised' : undefined},
        ...(f >= ruthIn - 20 ? [{who: 'ruth', x: 1450, y: ruthY, facing: -1 as const, pose: 'hips' as const, mood: 'smug' as const}] : []),
      ]}
      front={
        <>
          {f >= powerup && (
            <g transform={`translate(1205 ${380 - Math.min(60, (f - powerup) * 4)}) scale(${pop(f - powerup, 10)})`}>
              <path d="M 0 -50 L 14 -16 L 50 -14 L 22 10 L 30 46 L 0 26 L -30 46 L -22 10 L -50 -14 L -14 -16 Z" fill="#f6c945" stroke={INK} strokeWidth={4} />
            </g>
          )}
          {f >= ruthIn && (
            <g transform={`translate(1450 ${ruthY - 400})`} stroke={INK} strokeWidth={4}>
              <path d="M -50 0 L -40 -50 L -15 -20 L 0 -60 L 15 -20 L 40 -50 L 50 0 Z" fill="#f6c945" />
            </g>
          )}
          {f >= ruthIn + 10 && <Sparkles x={1450} y={600} t={(f - ruthIn) % 40} r={180} />}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="LEVEL UP: CREDIT SCORE 🎮" color="#5fd38a" dur={150} />
          <Hud f={f} xpT={f - xp} />
          {f >= meter && f < ruthIn && (
            <div style={{position: 'absolute', left: 120, top: 180}}>
              <svg width={560} height={420} viewBox="-280 -300 560 420">
                <ScoreGauge x={0} y={0} r={240} score={score} />
              </svg>
            </div>
          )}
          {f >= s.at('f055') && f < xp + 20 && <Factors t={f - s.at('f055')} />}
          {f >= xp && f < ruthIn && (
            <>
              <BigStat t={f - xp} dur={60} text="+10 XP" x="40%" y="40%" size={90} color="#5fd38a" />
              <BigStat t={f - xp - 50} dur={60} text="−50 HP" x="44%" y="48%" size={90} color="#e8553e" />
            </>
          )}
          {f >= ruthIn && <BossBar t={f - ruthIn} />}
          <Vignette amount={0.25} />
        </>
      }
    />
  );
};

const Hud: React.FC<{f: number; xpT: number}> = ({f, xpT}) => {
  const hp = xpT > 50 ? interpolate(xpT, [50, 60], [1, 0.5], clamp) : 1;
  return (
    <div style={{position: 'absolute', right: 60, top: 60, fontFamily: 'monospace', fontWeight: 700, color: '#fff', textShadow: `3px 3px 0 ${INK}`, fontSize: 30}}>
      <div>FINN · LV 14</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
        HP
        <div style={{width: 260, height: 26, border: `4px solid ${INK}`, background: '#2b2333'}}>
          <div style={{width: `${hp * 100}%`, height: '100%', background: hp > 0.6 ? '#5fd38a' : '#e8553e'}} />
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
        XP
        <div style={{width: 260, height: 20, border: `4px solid ${INK}`, background: '#2b2333'}}>
          <div style={{width: `${Math.min(100, 30 + (xpT > 0 ? 25 : 0) + (f % 1) * 0)}%`, height: '100%', background: '#4f9dde'}} />
        </div>
      </div>
    </div>
  );
};

const Factors: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', right: 80, top: 260, width: 640, fontFamily: FONT, transform: `scale(${pop(t, 12)})`, background: PAPER, border: `6px solid ${INK}`, borderRadius: 26, padding: '20px 28px', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)'}}>
    <div style={{fontSize: 40, fontWeight: 700, color: INK, marginBottom: 10}}>What builds your score</div>
    {[
      ['Pay on time, every time', '35%', '#2fbf71'],
      ['How much of your limit you use', '30%', '#4f9dde'],
      ['Everything else', '35%', '#c0c7d6'],
    ].map(([a, b, c], i) => (
      <div key={a} style={{display: 'flex', alignItems: 'center', gap: 14, margin: '12px 0', opacity: t > i * 20 ? 1 : 0}}>
        <div style={{width: 90, textAlign: 'center', fontSize: 34, fontWeight: 700, background: c, border: `4px solid ${INK}`, borderRadius: 12}}>{b}</div>
        <div style={{fontSize: 32, color: INK}}>{a}</div>
      </div>
    ))}
    <div style={{fontSize: 30, fontWeight: 700, color: '#2fbf71', marginTop: 8, opacity: t > 120 ? 1 : 0}}>Use under 30% of your limit (under 10% ⭐)</div>
  </div>
);

const BossBar: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: '50%', bottom: 90, transform: `translateX(-50%) scale(${pop(t, 10)})`, width: 900, fontFamily: 'monospace', fontWeight: 700, color: '#fff', textShadow: `3px 3px 0 ${INK}`}}>
    <div style={{fontSize: 40, textAlign: 'center'}}>FINAL BOSS · GRANDMA RUTH</div>
    <div style={{height: 36, border: `5px solid ${INK}`, background: '#2b2333', marginTop: 8}}>
      <div style={{width: '100%', height: '100%', background: 'linear-gradient(#ff7a5c,#e8553e)'}} />
    </div>
    <div style={{fontSize: 34, textAlign: 'center', marginTop: 6}}>CREDIT SCORE: 820</div>
  </div>
);

// =============================================================== 12. FIVE RULES – the chalkboard
const RULES = ['Pay the FULL statement balance', 'Autopay the full balance', 'Only buy what you could pay in cash', 'Keep your balance way below the limit', 'Don’t chase points'];

export const Rules: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const rc = ['r1', 'r2', 'r3', 'r4', 'r5'].map((c) => s.cue(c));
  const melt = s.cue('meltdown');
  const shown = rc.filter((c) => f >= c).length;
  let cam = camKeys(f, [
    {f: 0, cam: {x: 960, y: 520, zoom: 1.05}},
    {f: rc[0], cam: {x: 820, y: 420, zoom: 1.15}},
    {f: s.at('u005'), cam: {x: 1450, y: 520, zoom: 1.5}},
    {f: rc[1], cam: {x: 820, y: 420, zoom: 1.15}},
    {f: rc[4], cam: {x: 900, y: 500, zoom: 1.12}},
    {f: melt, cam: {x: 1600, y: 600, zoom: 1.5}, ease: Easing.out(Easing.cubic)},
  ]);
  cam = drift(cam, f, 0.5);
  const meltP = ramp(f - melt, 0, 80);
  return (
    <Stage
      cam={cam}
      vcam={{x: 900, zoom: 1.8}}
      rim="#fff3c9"
      set={<Room wall="#3d6b8a" trim="#2b4a63" floor="#8a6a4a" wallpaper="plain" />}
      speakers={{swipe: {x: 1650, y: 520}}}
      actors={[
        {who: 'finn', x: 360, facing: 1, pose: 'point', holding: <path d="M 0 0 L 120 -60" stroke="#8a5a3c" strokeWidth={8} strokeLinecap="round" />},
        {who: 'ruth', x: 1350, y: 900, sitting: true, facing: -1, pose: s.after('u005') && f < rc[1] + 20 ? 'up' : 'cross', mood: 'happy'},
      ]}
      front={
        <>
          {f >= melt - 20 && (
            <g>
              <ellipse cx={1650} cy={880} rx={60 + meltP * 160} ry={14 + meltP * 20} fill="#f3b73c" stroke={INK} strokeWidth={4} />
              <g transform={`translate(1650 ${640 + meltP * 160}) scale(${0.7} ${0.7 * (1 - meltP * 0.6)})`}>
                <SwipeCard x={0} y={0} frame={f} talk={s.mouth('swipe')} mood="cry" arms="up" legs={meltP < 0.3} />
              </g>
            </g>
          )}
        </>
      }
      overlay={
        <>
          <ChapterChip t={f} label="HOW TO WIN 🏆" color="#f6c945" dur={120} />
          <Vignette amount={0.3} />
        </>
      }
    >
      <g stroke={INK} strokeWidth={6}>
        <rect x={560} y={60} width={900} height={440} rx={16} fill="#8a5a3c" />
        <rect x={585} y={85} width={850} height={390} rx={8} fill="#2f4a3a" />
        <text x={1010} y={145} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#fffaf1" stroke="none">
          5 RULES TO BEAT MR. SWIPE
        </text>
        {RULES.map((r, i) =>
          i < shown ? (
            <g key={r} opacity={pop(f - rc[i], 8)} stroke="none" fontFamily={FONT}>
              <text x={630} y={210 + i * 58} fontSize={38} fill="#f6c945" fontWeight={700}>{i + 1}.</text>
              <text x={680} y={210 + i * 58} fontSize={38} fill="#fffaf1">{r}</text>
              <text x={1400} y={210 + i * 58} fontSize={38} fill="#5fd38a" textAnchor="end">✓</text>
            </g>
          ) : null,
        )}
      </g>
      <Chair x={1430} y={900} color="#c98f5e" flip />
      <Plant x={180} y={900} />
    </Stage>
  );
};

// =============================================================== 13. OUTRO – back at the coffee shop (sunset)
export const Outro: React.FC = () => {
  const s = useScene();
  const f = s.frame;
  const tap = s.cue('tap');
  const sub = s.cue('sub');
  const end = s.beat('end');
  let cam = camKeys(f, [
    {f: 0, cam: {x: 1100, y: 520, zoom: 1.0}},
    {f: tap, cam: {x: 1200, y: 520, zoom: 1.3}},
    {f: s.at('s012'), cam: {x: 1050, y: 560, zoom: 1.6}},
    {f: s.at('f066'), cam: {x: 1250, y: 520, zoom: 1.4}},
    {f: s.at('f067'), cam: {x: 1330, y: 480, zoom: 1.35}},
    {f: s.line('f067').end, cam: {x: 1340, y: 460, zoom: 1.75}, ease: Easing.inOut(Easing.sin)},
    {f: sub, cam: {x: 1200, y: 520, zoom: 1.2}},
  ]);
  cam = drift(cam, f, 0.5);
  return (
    <Stage
      cam={cam}
      vcam={{x: 1300, zoom: 2}}
      rim="#ffb36b"
      set={<CoffeeShop frame={f} evening />}
      speakers={{swipe: {x: 1000, y: 470}}}
      offscreen={{ruth: -1}}
      actors={[
        {who: 'barista', look: {skin: '#e0a37c', body: '#5a3a2a', legs: '#2b2333', shoes: '#2b2333', hair: 'bob', hairColor: '#7a3b1e', outfit: 'shirt', size: 0.92, blush: true}, x: 560, facing: 1, pose: f > tap ? 'wave' : 'down', mood: 'happy'},
        {who: 'finn', x: 1350, facing: f < s.at('f065') ? -1 : 1, pose: f < tap + 20 ? 'reach' : s.after('sub') ? 'wave' : 'hold', holding: f < tap + 20 ? <CardProp /> : <LatteCup s={0.55} steam={f} />, mood: s.after('f067') && !s.after('f068') ? 'neutral' : 'happy'},
      ]}
      front={
        <>
          <CoffeeCounter readerLit={f >= tap ? 1 : 0} />
          {f >= s.at('s012') - 10 && <SwipeCard x={1000} y={540} s={0.45} frame={f} talk={s.mouth('swipe')} mood="cry" arms="down" rot={-6} />}
        </>
      }
      overlay={
        <>
          <BigStat t={f - tap - 10} dur={s.at('s012') - tap} text="$6.00 · PAID IN FULL ✓" x="50%" y="18%" size={80} color="#5fd38a" />
          <BigStat t={f - s.at('f067') - 60} dur={s.line('f067').end - s.at('f067') - 40} text="A TOOL, NOT FREE MONEY" x="34%" y="22%" size={80} color="#f6c945" />
          {f >= sub && f < end.start + 10 && <SubscribeButton t={f - sub} />}
          {f >= s.at('f069') && f < end.start && <NextTime t={f - s.at('f069')} />}
          {f >= end.start && <EndCard t={f - end.start} />}
          <Vignette amount={0.3} />
        </>
      }
    />
  );
};

const SubscribeButton: React.FC<{t: number}> = ({t}) => {
  const clicked = t > 40;
  const cx = interpolate(t, [10, 38], [1500, 1060], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(t, [10, 38], [1000, 930], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      <div style={{position: 'absolute', left: '50%', bottom: 110, transform: `translateX(-50%) scale(${pop(t, 10) * (clicked && t < 46 ? 0.92 : 1)})`, display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT, fontWeight: 700}}>
        <div style={{background: clicked ? '#6b6280' : '#ff0033', color: '#fff', fontSize: 52, padding: '16px 44px', borderRadius: 50, border: '5px solid #fff', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>{clicked ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</div>
        <div style={{fontSize: 64, transform: `rotate(${clicked ? Math.sin(t) * 20 : 0}deg)`}}>🔔</div>
      </div>
      <svg style={{position: 'absolute', left: cx, top: cy}} width={60} height={80} viewBox="0 0 60 80">
        <path d="M 4 4 L 4 64 L 20 50 L 32 76 L 42 72 L 30 46 L 52 46 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

const NextTime: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 90, top: 140, width: 560, transform: `scale(${pop(t, 12)}) rotate(-3deg)`, background: '#2b2333', color: '#fff', border: `6px solid #f6c945`, borderRadius: 26, padding: '20px 28px', fontFamily: FONT, boxShadow: '10px 12px 0 rgba(0,0,0,0.35)'}}>
    <div style={{fontSize: 34, color: '#f6c945', fontWeight: 700}}>NEXT TIME ON MONEY 101</div>
    <div style={{fontSize: 56, fontWeight: 700}}>INFLATION 🍫</div>
    <div style={{fontSize: 30, marginTop: 6}}>Why candy costs 3× more than in Grandma’s day</div>
  </div>
);

const EndCard: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: `rgba(43,35,51,${Math.min(0.92, t / 20)})`, alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
    <div style={{transform: `scale(${pop(t - 6, 12)})`, textAlign: 'center'}}>
      <div style={{fontSize: 56, color: '#f6c945', fontWeight: 700, letterSpacing: 4}}>MONEY 101 · with Finn</div>
      <div style={{fontSize: 110, color: PAPER, fontWeight: 700}}>Thanks for watching!</div>
      <div style={{fontSize: 36, color: '#c9c2d9', marginTop: 10}}>Not financial advice. Finn is 14.</div>
    </div>
  </AbsoluteFill>
);
