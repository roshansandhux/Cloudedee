// 3D messy apartment in afternoon sun. All geometry & textures built in code.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {random} from 'remotion';
import {fabricBump, pizzaLidTex, posterTex, tvScreen, wallPaper, woodFloor} from './materials';

const WALL_Z = -2.2;

export const Apartment3D: React.FC<{frame: number}> = ({frame}) => {
  const m = useMemo(() => {
    const bump = fabricBump();
    return {
      floor: new THREE.MeshStandardMaterial({map: woodFloor(), roughness: 0.5, metalness: 0}),
      wall: new THREE.MeshStandardMaterial({map: wallPaper(), roughness: 0.92}),
      trim: new THREE.MeshStandardMaterial({color: '#f3e9d8', roughness: 0.6}),
      couch: new THREE.MeshStandardMaterial({color: '#4c6684', roughness: 0.95, bumpMap: bump, bumpScale: 1}),
      cushion: new THREE.MeshStandardMaterial({color: '#5d7a9a', roughness: 0.95, bumpMap: bump, bumpScale: 1}),
      wood: new THREE.MeshStandardMaterial({color: '#7a4e2e', roughness: 0.55}),
      dark: new THREE.MeshStandardMaterial({color: '#18171d', roughness: 0.35, metalness: 0.3}),
      glass: new THREE.MeshBasicMaterial({color: '#ffe3b0'}),
      blind: new THREE.MeshStandardMaterial({color: '#f7eedf', roughness: 0.7}),
      poster: new THREE.MeshStandardMaterial({map: posterTex(), roughness: 0.7}),
      pizza: new THREE.MeshStandardMaterial({map: pizzaLidTex(), roughness: 0.85}),
      box: new THREE.MeshStandardMaterial({color: '#e2cda0', roughness: 0.9}),
      can: new THREE.MeshPhysicalMaterial({color: '#c0392b', roughness: 0.25, metalness: 0.8, clearcoat: 0.5}),
      can2: new THREE.MeshPhysicalMaterial({color: '#3d7fd1', roughness: 0.25, metalness: 0.8, clearcoat: 0.5}),
      plant: new THREE.MeshStandardMaterial({color: '#3f8f4a', roughness: 0.7}),
      pot: new THREE.MeshStandardMaterial({color: '#c4643a', roughness: 0.8}),
      rug: new THREE.MeshStandardMaterial({color: '#6b4f96', roughness: 1, bumpMap: bump, bumpScale: 2}),
      controller: new THREE.MeshPhysicalMaterial({color: '#25252d', roughness: 0.4, clearcoat: 0.4}),
      beam: new THREE.MeshBasicMaterial({color: '#ffd59a', transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide}),
      dust: new THREE.MeshBasicMaterial({color: '#fff1c8', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending}),
    };
  }, []);

  const tv = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 288;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {c, t, mat: new THREE.MeshBasicMaterial({map: t, toneMapped: false})};
  }, []);
  tvScreen(tv.c, frame);
  tv.t.needsUpdate = true;

  // window opening in the back wall (sun pours through it)
  const win = {x: 1.6, y: 1.55, w: 1.5, h: 1.4};
  const wallW = 12;
  const wallH = 4;

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.floor}>
        <planeGeometry args={[14, 12]} />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.2, 0.004, 0.4]} receiveShadow material={m.rug}>
        <circleGeometry args={[1.7, 64]} />
      </mesh>
      {/* back wall built around the window hole (so sunlight only enters through it) */}
      <group position={[0, 0, WALL_Z]}>
        <mesh position={[(-wallW / 2 + (win.x - win.w / 2)) / 2, wallH / 2, 0]} castShadow receiveShadow material={m.wall}>
          <boxGeometry args={[win.x - win.w / 2 + wallW / 2, wallH, 0.12]} />
        </mesh>
        <mesh position={[(wallW / 2 + (win.x + win.w / 2)) / 2, wallH / 2, 0]} castShadow receiveShadow material={m.wall}>
          <boxGeometry args={[wallW / 2 - (win.x + win.w / 2), wallH, 0.12]} />
        </mesh>
        <mesh position={[win.x, (win.y - win.h / 2) / 2, 0]} castShadow receiveShadow material={m.wall}>
          <boxGeometry args={[win.w, win.y - win.h / 2, 0.12]} />
        </mesh>
        <mesh position={[win.x, (wallH + win.y + win.h / 2) / 2, 0]} castShadow receiveShadow material={m.wall}>
          <boxGeometry args={[win.w, wallH - (win.y + win.h / 2), 0.12]} />
        </mesh>
        {/* bright sky behind the window */}
        <mesh position={[win.x, win.y, -0.6]} material={m.glass}>
          <planeGeometry args={[win.w + 1, win.h + 1]} />
        </mesh>
        {/* window frame + half-open blinds */}
        {[
          [win.x, win.y + win.h / 2, win.w + 0.12, 0.08],
          [win.x, win.y - win.h / 2, win.w + 0.2, 0.08],
          [win.x - win.w / 2, win.y, 0.08, win.h + 0.08],
          [win.x + win.w / 2, win.y, 0.08, win.h + 0.08],
          [win.x, win.y, 0.05, win.h],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.08]} castShadow material={m.trim}>
            <boxGeometry args={[w, h, 0.08]} />
          </mesh>
        ))}
        {Array.from({length: 9}).map((_, i) => (
          <mesh key={`bl${i}`} position={[win.x, win.y + win.h / 2 - 0.08 - i * 0.075, 0.1]} rotation={[0.9, 0, 0]} castShadow material={m.blind}>
            <boxGeometry args={[win.w - 0.04, 0.05, 0.004]} />
          </mesh>
        ))}
        {/* baseboard */}
        <mesh position={[0, 0.06, 0.08]} receiveShadow material={m.trim}>
          <boxGeometry args={[wallW, 0.12, 0.04]} />
        </mesh>
        {/* poster */}
        <mesh position={[-1.4, 1.75, 0.07]} rotation={[0, 0, -0.04]} material={m.poster} castShadow>
          <planeGeometry args={[0.75, 1.05]} />
        </mesh>
      </group>
      {/* left wall */}
      <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={m.wall}>
        <planeGeometry args={[10, 4]} />
      </mesh>

      {/* sunbeam volume through the window + floating dust */}

      {Array.from({length: 40}).map((_, i) => {
        const t = frame / 30;
        const x = 0.2 + random(`dx${i}`) * 1.6 + Math.sin(t * 0.4 + i) * 0.05;
        const y = 0.3 + ((random(`dy${i}`) * 2.2 + t * 0.03 * (0.5 + random(`dv${i}`))) % 2.2);
        const z = -1.6 + random(`dz${i}`) * 1.8;
        return (
          <mesh key={`d${i}`} position={[x, y, z]} material={m.dust}>
            <sphereGeometry args={[0.004 + random(`ds${i}`) * 0.004, 6, 4]} />
          </mesh>
        );
      })}

      {/* couch */}
      <group position={[-0.3, 0, -1.25]}>
        <RoundedBox args={[2.3, 0.42, 0.95]} radius={0.09} smoothness={4} position={[0, 0.27, 0]} castShadow receiveShadow material={m.couch} />
        <RoundedBox args={[2.3, 0.75, 0.25]} radius={0.1} smoothness={4} position={[0, 0.7, -0.38]} castShadow receiveShadow material={m.couch} />
        {[-1.24, 1.24].map((x) => (
          <RoundedBox key={x} args={[0.24, 0.62, 0.95]} radius={0.09} smoothness={4} position={[x, 0.42, 0]} castShadow receiveShadow material={m.couch} />
        ))}
        {[-0.56, 0.56].map((x) => (
          <RoundedBox key={`c${x}`} args={[1.08, 0.14, 0.78]} radius={0.06} smoothness={4} position={[x, 0.53, 0.06]} castShadow receiveShadow material={m.cushion} />
        ))}
        {[-0.56, 0.56].map((x) => (
          <RoundedBox key={`b${x}`} args={[1.0, 0.5, 0.16]} radius={0.07} smoothness={4} position={[x, 0.82, -0.2]} rotation={[-0.15, 0, 0]} castShadow receiveShadow material={m.cushion} />
        ))}
        {[-1, 1].map((x) => (
          <mesh key={`f${x}`} position={[x * 1.05, 0.03, 0.35]} castShadow material={m.wood}>
            <cylinderGeometry args={[0.03, 0.025, 0.06, 10]} />
          </mesh>
        ))}
      </group>

      {/* coffee table with the evidence of a 19-hour gaming marathon */}
      <group position={[-0.25, 0, -0.05]}>
        <RoundedBox args={[1.2, 0.06, 0.6]} radius={0.02} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow material={m.wood} />
        {[
          [-0.52, -0.24],
          [0.52, -0.24],
          [-0.52, 0.24],
          [0.52, 0.24],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.19, z]} castShadow material={m.wood}>
            <boxGeometry args={[0.05, 0.38, 0.05]} />
          </mesh>
        ))}
        <group position={[-0.2, 0.455, 0.02]} rotation={[0, 0.2, 0]}>
          <mesh castShadow receiveShadow material={m.box}>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
          </mesh>
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.pizza}>
            <planeGeometry args={[0.4, 0.4]} />
          </mesh>
        </group>
        <group position={[-0.17, 0.51, 0.0]} rotation={[0, -0.3, 0]}>
          <mesh castShadow receiveShadow material={m.box}>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
          </mesh>
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.pizza}>
            <planeGeometry args={[0.4, 0.4]} />
          </mesh>
        </group>
        {[
          [0.3, 0.1, m.can],
          [0.42, -0.1, m.can2],
        ].map(([x, z, mat], i) => (
          <mesh key={`can${i}`} position={[x as number, 0.49, z as number]} castShadow material={mat as THREE.Material}>
            <cylinderGeometry args={[0.033, 0.033, 0.12, 20]} />
          </mesh>
        ))}
        <mesh position={[0.48, 0.45, 0.18]} rotation={[Math.PI / 2, 0, 1.2]} castShadow material={m.can}>
          <cylinderGeometry args={[0.033, 0.033, 0.12, 20]} />
        </mesh>
        <RoundedBox args={[0.16, 0.035, 0.1]} radius={0.015} position={[0.12, 0.45, -0.18]} rotation={[0, 0.5, 0]} castShadow material={m.controller} />
      </group>

      {/* TV on a stand, left side, angled to the couch */}
      <group position={[-3.0, 0, -0.4]} rotation={[0, 1.0, 0]}>
        <RoundedBox args={[1.5, 0.45, 0.45]} radius={0.03} position={[0, 0.23, 0]} castShadow receiveShadow material={m.wood} />
        <RoundedBox args={[1.6, 0.92, 0.07]} radius={0.02} position={[0, 1.0, 0]} castShadow material={m.dark} />
        <mesh position={[0, 1.0, 0.037]} material={tv.mat}>
          <planeGeometry args={[1.5, 0.84]} />
        </mesh>
        <pointLight position={[0, 1.0, 0.6]} intensity={1.2} distance={3} color="#7fa8ff" />
      </group>

      {/* plant by the window */}
      <group position={[2.8, 0, -1.7]}>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow material={m.pot}>
          <cylinderGeometry args={[0.18, 0.14, 0.36, 24]} />
        </mesh>
        {Array.from({length: 9}).map((_, i) => (
          <mesh key={i} position={[0, 0.55, 0]} rotation={[0.5 * Math.cos(i * 0.7), i * 0.7, 0.5 * Math.sin(i * 0.7) + Math.sin(frame / 40 + i) * 0.03]} castShadow material={m.plant}>
            <coneGeometry args={[0.06, 0.6, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
