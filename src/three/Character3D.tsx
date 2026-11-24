// 3D CHARACTER RIG – stylised-realistic ("feature animation") humans built from primitives in code.
// Physically based materials: subsurface-ish skin, matte fabric, glossy wet eyes with cornea highlight.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';
import type {Mood} from '../engine/timeline';
import {fabricBump} from './materials';

export type Look3D = {
  skin: string;
  hair: string;
  hairStyle: 'swoop' | 'curly' | 'tuft';
  top: string;
  topStyle: 'hoodie' | 'tee' | 'sweater';
  pants: string;
  shoes: string;
  iris: string;
  glasses?: boolean;
  build: 'slim' | 'big' | 'small';
  freckles?: boolean;
};

type V3 = [number, number, number];

/** A capsule "limb" from a to b. */
const Limb: React.FC<{a: V3; b: V3; r: number; mat: THREE.Material}> = ({a, b, r, mat}) => {
  const {pos, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const l = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return {pos: va.add(vb).multiplyScalar(0.5), quat: q, len: l};
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return (
    <mesh position={pos} quaternion={quat} castShadow receiveShadow material={mat}>
      <capsuleGeometry args={[r, Math.max(0.001, len), 8, 16]} />
    </mesh>
  );
};

const BROW: Record<string, [number, number]> = {
  // [inner raise, outer raise] in metres-ish
  neutral: [0, 0],
  happy: [0.006, 0.004],
  angry: [-0.012, 0.006],
  sad: [0.012, -0.004],
  surprised: [0.018, 0.016],
  worried: [0.014, -0.002],
  smug: [-0.004, 0.01],
  confused: [0.012, -0.008],
  determined: [-0.01, 0.004],
  sleepy: [-0.004, -0.004],
  scared: [0.02, 0.008],
};
const SMILE: Record<string, number> = {happy: 1, smug: 0.7, neutral: 0.25, sad: -0.8, angry: -0.6, worried: -0.4, determined: -0.1, confused: -0.2, surprised: 0, sleepy: 0, scared: -0.5};

export const Character3D: React.FC<{
  look: Look3D;
  seed: string;
  frame: number;
  position: V3;
  rotY?: number;
  pose?: 'stand' | 'sit';
  talk?: number;
  mood?: Mood;
  gesture?: number; // 0..1 front-arm talk gesture
  fist?: number; // 0..1 raise fist
  headTurn?: number; // radians
  lookX?: number; // eye look -1..1
}> = (p) => {
  const L = p.look;
  const f = p.frame;
  const mood = p.mood ?? 'neutral';
  const talk = Math.min(1, Math.max(0, p.talk ?? 0));
  const sit = p.pose === 'sit';

  const mats = useMemo(() => {
    const bump = fabricBump();
    const skin = new THREE.MeshPhysicalMaterial({color: L.skin, roughness: 0.52, sheen: 0.4, sheenColor: new THREE.Color('#ffb08a'), sheenRoughness: 0.6, clearcoat: 0.06});
    return {
      skin,
      lips: new THREE.MeshPhysicalMaterial({color: new THREE.Color(L.skin).lerp(new THREE.Color('#b0505a'), 0.35), roughness: 0.4}),
      hair: new THREE.MeshPhysicalMaterial({color: L.hair, roughness: 0.55, sheen: 0.8, sheenColor: new THREE.Color(L.hair).offsetHSL(0, 0, 0.25)}),
      top: new THREE.MeshStandardMaterial({color: L.top, roughness: 0.88, bumpMap: bump, bumpScale: 0.6}),
      pants: new THREE.MeshStandardMaterial({color: L.pants, roughness: 0.85, bumpMap: bump, bumpScale: 0.5}),
      shoes: new THREE.MeshPhysicalMaterial({color: L.shoes, roughness: 0.45, clearcoat: 0.3}),
      sole: new THREE.MeshStandardMaterial({color: '#f2efe8', roughness: 0.7}),
      sclera: new THREE.MeshPhysicalMaterial({color: '#fbf8f2', roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05}),
      iris: new THREE.MeshPhysicalMaterial({color: L.iris, roughness: 0.3, clearcoat: 1}),
      pupil: new THREE.MeshPhysicalMaterial({color: '#0b0b0e', roughness: 0.1, clearcoat: 1}),
      mouth: new THREE.MeshStandardMaterial({color: '#3a1216', roughness: 0.9}),
      teeth: new THREE.MeshStandardMaterial({color: '#f6f1e6', roughness: 0.35}),
      tongue: new THREE.MeshStandardMaterial({color: '#c95a66', roughness: 0.6}),
      frame: new THREE.MeshPhysicalMaterial({color: '#2b2333', roughness: 0.3, metalness: 0.2, clearcoat: 0.6}),
      lens: new THREE.MeshPhysicalMaterial({color: '#ffffff', roughness: 0.02, transmission: 0.95, transparent: true, opacity: 0.25, thickness: 0.002}),
      white: new THREE.MeshStandardMaterial({color: '#f4f4f6', roughness: 0.8}),
      freckle: new THREE.MeshStandardMaterial({color: new THREE.Color(L.skin).offsetHSL(0, 0.1, -0.22), roughness: 0.8}),
    };
  }, [L.skin, L.hair, L.top, L.pants, L.shoes, L.iris]);

  // body proportions
  const big = L.build === 'big';
  const scale = L.build === 'small' ? 0.94 : 1;
  const torsoR = big ? 0.25 : L.build === 'slim' ? 0.15 : 0.16;
  const legLen = big ? 0.78 : 0.86;
  const hipY = sit ? 0.48 : legLen;
  const breathe = Math.sin(f / 22 + random(p.seed) * 6);
  const neckY = hipY + 0.55 + breathe * 0.004;
  const headR = 0.165;
  const headY = neckY + headR + 0.05;

  // blink
  const period = 100 + Math.floor(random(`${p.seed}b`) * 60);
  const bt = (f + Math.floor(random(`${p.seed}o`) * 90)) % period;
  const blink = bt < 5 ? [0.5, 0.95, 1, 0.7, 0.3][bt] : mood === 'sleepy' ? 0.45 : 0;

  // legs
  const hipX = big ? 0.12 : 0.09;
  const legs = [-1, 1].map((s) => {
    const hip: V3 = [s * hipX, hipY, 0];
    const knee: V3 = sit ? [s * (hipX + 0.02), hipY + 0.02, 0.42] : [s * hipX, hipY * 0.5, 0.02];
    const ankle: V3 = sit ? [s * (hipX + 0.03), 0.1, 0.46] : [s * hipX, 0.08, 0];
    return {hip, knee, ankle, s};
  });

  // arms
  const shY = neckY - 0.07;
  const shX = torsoR + 0.04;
  const g = p.gesture ?? 0;
  const fist = p.fist ?? 0;
  const arms = [-1, 1].map((s) => {
    const sh: V3 = [s * shX, shY, 0];
    let elbow: V3 = sit ? [s * (shX + 0.05), shY - 0.26, 0.12] : [s * (shX + 0.04), shY - 0.28, 0.02];
    let hand: V3 = sit ? [s * (shX - 0.02), shY - 0.42, 0.32] : [s * (shX + 0.05), shY - 0.55, 0.06];
    if (s === 1 && g > 0) {
      const w = Math.sin(f / 5) * 0.03 * g;
      elbow = [shX + 0.08, shY - 0.25, 0.12];
      hand = [shX + 0.02 + w, shY - 0.12 + g * 0.06 + w, 0.32];
    }
    if (s === 1 && fist > 0) {
      elbow = [shX + 0.12, shY - 0.05 + fist * 0.15, 0.06];
      hand = [shX + 0.08, shY + 0.1 + fist * 0.3, 0.1];
    }
    return {sh, elbow, hand, s};
  });

  // ── head features ──
  const brow = BROW[mood] ?? BROW.neutral;
  const smile = SMILE[mood] ?? 0;
  const open = Math.max(talk, mood === 'surprised' || mood === 'scared' ? 0.45 : 0);
  const eyeY = 0.025;
  const eyeX = 0.058;
  const eyeZ = Math.sqrt(headR * headR - eyeX * eyeX - eyeY * eyeY) - 0.022;
  const lookX = (p.lookX ?? 0) * 0.008;

  const lidGeo = useMemo(() => new THREE.SphereGeometry(0.0315, 24, 16, 0, Math.PI * 2, 0, Math.PI * (0.32 + 0.68 * Math.round(blink * 8) / 8)), [Math.round(blink * 8)]);

  const hair = () => {
    if (L.hairStyle === 'curly') {
      const out: React.ReactNode[] = [];
      for (let i = 0; i < 26; i++) {
        const a = random(`ca${i}`) * Math.PI * 2;
        const el = 0.15 + random(`ce${i}`) * 1.05;
        const r = headR * 1.02;
        const x = Math.cos(a) * Math.sin(el) * r;
        const z = Math.sin(a) * Math.sin(el) * r * (Math.sin(a) > 0 ? 0.75 : 1);
        const y = Math.cos(el) * r + 0.02;
        out.push(
          <mesh key={i} position={[x, y, z]} castShadow material={mats.hair}>
            <sphereGeometry args={[0.048 + random(`cr${i}`) * 0.018, 16, 12]} />
          </mesh>,
        );
      }
      return out;
    }
    if (L.hairStyle === 'swoop')
      return (
        <>
          <mesh position={[0, 0.06, -0.015]} scale={[1.04, 0.85, 1.06]} castShadow material={mats.hair}>
            <sphereGeometry args={[headR, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          </mesh>
          <mesh position={[0.04, 0.15, 0.085]} rotation={[0.5, 0, -0.45]} scale={[1.5, 0.5, 0.85]} castShadow material={mats.hair}>
            <sphereGeometry args={[0.07, 20, 14]} />
          </mesh>
          <mesh position={[-0.05, 0.16, 0.05]} rotation={[0.3, 0, 0.3]} scale={[1.2, 0.5, 1]} castShadow material={mats.hair}>
            <sphereGeometry args={[0.07, 20, 14]} />
          </mesh>
        </>
      );
    // tuft (Milo)
    return (
      <>
        <mesh position={[0, 0.05, -0.012]} scale={[1.03, 0.8, 1.04]} castShadow material={mats.hair}>
          <sphereGeometry args={[headR, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
        </mesh>
        <mesh position={[0.0, headR + 0.03, 0.03]} rotation={[0.5, 0, 0.2]} castShadow material={mats.hair}>
          <coneGeometry args={[0.025, 0.08, 12]} />
        </mesh>
      </>
    );
  };

  const torso = () => {
    const chestY = (hipY + neckY) / 2;
    const h = neckY - hipY;
    return (
      <group>
        <mesh position={[0, chestY, 0]} scale={[1, 1, big ? 0.85 : 0.72]} castShadow receiveShadow material={mats.top}>
          <capsuleGeometry args={[torsoR, Math.max(0.05, h - torsoR * 1.4), 12, 24]} />
        </mesh>
        {big && (
          <mesh position={[0, hipY + 0.16, 0.08]} scale={[1, 0.85, 0.9]} castShadow material={mats.top}>
            <sphereGeometry args={[0.22, 24, 18]} />
          </mesh>
        )}
        {/* hips / pants */}
        <mesh position={[0, hipY + 0.02, 0]} scale={[1, 0.6, big ? 0.85 : 0.75]} castShadow material={mats.pants}>
          <sphereGeometry args={[torsoR + 0.015, 24, 16]} />
        </mesh>
        {L.topStyle === 'hoodie' && (
          <>
            <mesh position={[0, neckY - 0.02, -0.05]} rotation={[Math.PI / 2.4, 0, 0]} castShadow material={mats.top}>
              <torusGeometry args={[0.1, 0.045, 12, 24]} />
            </mesh>
            <mesh position={[0, hipY + 0.16, torsoR * 0.7]} castShadow material={mats.top}>
              <boxGeometry args={[0.2, 0.1, 0.02]} />
            </mesh>
            {[-0.03, 0.03].map((x) => (
              <mesh key={x} position={[x, neckY - 0.1, torsoR * 0.74]} material={mats.white}>
                <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
              </mesh>
            ))}
          </>
        )}
        {L.topStyle === 'sweater' &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.035, neckY - 0.02, 0.1]} rotation={[0.4, 0, s * 0.6]} material={mats.white} castShadow>
              <coneGeometry args={[0.035, 0.08, 3]} />
            </mesh>
          ))}
        {/* neck */}
        <Limb a={[0, neckY - 0.04, 0]} b={[0, neckY + 0.06, 0.005]} r={0.045} mat={mats.skin} />
      </group>
    );
  };

  return (
    <group position={p.position} rotation={[0, p.rotY ?? 0, 0]} scale={scale}>
      {/* legs */}
      {legs.map((l) => (
        <group key={`l${l.s}`}>
          <Limb a={l.hip} b={l.knee} r={big ? 0.085 : 0.068} mat={mats.pants} />
          <Limb a={l.knee} b={l.ankle} r={big ? 0.07 : 0.058} mat={mats.pants} />
          <group position={[l.ankle[0], 0.045, l.ankle[2] + 0.05]}>
            <mesh castShadow receiveShadow material={mats.shoes} scale={[1, 0.62, 1.6]}>
              <sphereGeometry args={[0.07, 20, 14]} />
            </mesh>
            <mesh position={[0, -0.03, 0]} scale={[1.05, 0.25, 1.65]} material={mats.sole}>
              <sphereGeometry args={[0.07, 20, 10]} />
            </mesh>
          </group>
        </group>
      ))}
      {torso()}
      {/* arms */}
      {arms.map((a) => (
        <group key={`a${a.s}`}>
          <Limb a={a.sh} b={a.elbow} r={big ? 0.06 : 0.048} mat={L.topStyle === 'tee' ? mats.top : mats.top} />
          <Limb a={a.elbow} b={a.hand} r={big ? 0.05 : 0.04} mat={L.topStyle === 'tee' ? mats.skin : mats.top} />
          <group position={a.hand}>
            <mesh castShadow material={mats.skin} scale={[0.85, 1.05, 0.7]}>
              <sphereGeometry args={[0.048, 18, 14]} />
            </mesh>
            <mesh position={[a.s * -0.035, 0.01, 0.02]} rotation={[0, 0, a.s * 0.7]} castShadow material={mats.skin}>
              <capsuleGeometry args={[0.014, 0.03, 6, 10]} />
            </mesh>
          </group>
        </group>
      ))}
      {/* head */}
      <group position={[0, headY, 0.01]} rotation={[0.04 + breathe * 0.01, p.headTurn ?? 0, Math.sin(f / 40) * 0.02]}>
        <mesh castShadow receiveShadow material={mats.skin} scale={[0.94, 1.08, 0.97]}>
          <sphereGeometry args={[headR, 48, 36]} />
        </mesh>
        {/* jaw / cheeks volume */}
        <mesh position={[0, -0.055, 0.03]} scale={[0.92, 0.6, 0.85]} material={mats.skin} castShadow>
          <sphereGeometry args={[headR * 0.85, 32, 24]} />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * headR * 0.98, -0.005, -0.01]} scale={[0.45, 1, 0.75]} castShadow material={mats.skin}>
            <sphereGeometry args={[0.04, 16, 12]} />
          </mesh>
        ))}
        {/* nose */}
        <mesh position={[0, -0.025, headR * 0.98]} scale={[1, 0.85, 1.05]} castShadow material={mats.skin}>
          <sphereGeometry args={[0.024, 20, 14]} />
        </mesh>
        {/* eyes */}
        {[-1, 1].map((s) => (
          <group key={`e${s}`} position={[s * eyeX, eyeY, eyeZ]}>
            <mesh material={mats.sclera}>
              <sphereGeometry args={[0.03, 24, 18]} />
            </mesh>
            <group rotation={[0, lookX * 18, 0]}>
              <mesh position={[0, 0, 0.0232]} scale={[1, 1, 0.45]} material={mats.iris}>
                <sphereGeometry args={[0.0175, 20, 14]} />
              </mesh>
              <mesh position={[0, 0, 0.0295]} scale={[1, 1, 0.4]} material={mats.pupil}>
                <sphereGeometry args={[0.0085, 14, 10]} />
              </mesh>
            </group>
            {/* eyelid (closes from the top) */}
            <mesh geometry={lidGeo} material={mats.skin} rotation={[-0.35, 0, 0]} />
          </group>
        ))}
        {/* eyebrows */}
        {[-1, 1].map((s) => (
          <mesh
            key={`b${s}`}
            position={[s * eyeX, eyeY + 0.052 + (brow[0] + brow[1]) / 2, eyeZ + 0.01]}
            rotation={[0, 0, Math.PI / 2 + s * ((brow[0] - brow[1]) * 14)]}
            castShadow
            material={mats.hair}
          >
            <capsuleGeometry args={[0.0075, 0.04, 4, 8]} />
          </mesh>
        ))}
        {/* freckles */}
        {L.freckles &&
          [-1, 1].flatMap((s) =>
            [0, 1, 2].map((k) => (
              <mesh key={`fr${s}${k}`} position={[s * (0.07 + k * 0.012), -0.02 - (k % 2) * 0.01, headR * 0.9]} material={mats.freckle}>
                <sphereGeometry args={[0.0035, 6, 4]} />
              </mesh>
            )),
          )}
        {/* mouth */}
        <group position={[0, -0.075, headR * 0.9]}>
          {open > 0.06 ? (
            <>
              <mesh scale={[0.045 * (1 - open * 0.2), 0.006 + open * 0.028, 0.02]} material={mats.mouth}>
                <sphereGeometry args={[1, 24, 16]} />
              </mesh>
              <mesh position={[0, 0.004 + open * 0.016, 0.006]} scale={[0.03, 0.006, 0.01]} material={mats.teeth}>
                <sphereGeometry args={[1, 16, 8]} />
              </mesh>
              <mesh position={[0, -0.006 - open * 0.014, 0.004]} scale={[0.024, 0.008, 0.012]} material={mats.tongue}>
                <sphereGeometry args={[1, 16, 8]} />
              </mesh>
            </>
          ) : (
            <mesh rotation={[0, 0, smile >= 0 ? Math.PI : 0]} position={[0, smile >= 0 ? 0.012 : -0.012, 0]} material={mats.lips}>
              <torusGeometry args={[0.035, 0.0055, 8, 24, Math.PI * (0.3 + Math.abs(smile) * 0.35)]} />
            </mesh>
          )}
        </group>
        {hair()}
        {L.glasses && (
          <group position={[0, eyeY, eyeZ + 0.03]}>
            {[-1, 1].map((s) => (
              <group key={`g${s}`} position={[s * eyeX, 0, 0]}>
                <mesh material={mats.frame}>
                  <torusGeometry args={[0.045, 0.0045, 10, 32]} />
                </mesh>
                <mesh material={mats.lens}>
                  <circleGeometry args={[0.044, 32]} />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 0.005, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.frame}>
              <capsuleGeometry args={[0.003, 0.02, 4, 6]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={`t${s}`} position={[s * 0.1, 0, -0.07]} rotation={[Math.PI / 2, 0, 0]} material={mats.frame}>
                <capsuleGeometry args={[0.0035, 0.13, 4, 6]} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};
