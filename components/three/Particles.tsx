"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";

/** Swirling particle vortex used behind the BioBlueprint (dark) scenes. */
const COUNT = 14000;

function makeLayer(seed: number, count = COUNT) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const arm = Math.floor(rnd() * 3);
    const r = 0.7 + Math.pow(rnd(), 0.8) * 3.6;
    const theta = arm * ((Math.PI * 2) / 3) + r * 1.35 + (rnd() - 0.5) * 0.55;
    const y = (rnd() - 0.5) * 0.25 * r;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(theta) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

export default function Particles({ dense = false, paused = false }: { dense?: boolean; paused?: boolean }) {
  const width = useThree((state) => state.size.width);
  const count = dense ? (width < 768 ? 3500 : 18000) : COUNT;
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.Points>(null);
  const b = useRef<THREE.Points>(null);
  const layers = useMemo(() => [makeLayer(7, count), makeLayer(23, count)], [count]);
  const mats = useMemo(
    () => [0.018, 0.011].map((size) => new THREE.PointsMaterial({ size, color: "#ffffff", transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true })),
    [],
  );

  useFrame((_s, dt) => {
    const o = scene.particles;
    if (!group.current) return;
    group.current.visible = o > 0.01;
    if (!group.current.visible) return;
    mats[0].opacity = o * 0.75;
    mats[1].opacity = o * 0.45;
    if (a.current && !paused) a.current.rotation.y += dt * 0.12;
    if (b.current && !paused) b.current.rotation.y -= dt * 0.07;
    group.current.rotation.z = 0.25 + (1 - o) * 0.6;
    group.current.scale.setScalar(0.8 + o * 0.4);
  });

  return (
    <group ref={group} rotation={[1.05, 0, 0.25]} position={[0, 0, -1.5]}>
      <points ref={a} geometry={layers[0]} material={mats[0]} />
      <points ref={b} geometry={layers[1]} material={mats[1]} />
    </group>
  );
}
