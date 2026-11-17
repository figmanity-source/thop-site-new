"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";
import { chrome, darkChrome } from "./materials";
import { useModelTransform } from "./useModelTransform";

/**
 * Procedural DNA double helix, split in 5 segments (one per THOP step).
 * Plays the role of the original watch: hero model + "disassembly" scene.
 */
const PAIRS = 40;
const SEGMENTS = 5;
const PER_SEG = PAIRS / SEGMENTS;
const HEIGHT = 3.0;
const RADIUS = 0.5;
const TURNS = 2.6;

export default function DNA() {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const segRefs = useRef<(THREE.Group | null)[]>([]);
  const { camera, size } = useThree();

  const { segments, mats } = useMemo(() => {
    const mats = { strand: chrome(), rung: darkChrome(), bead: chrome() };
    const bead = new THREE.SphereGeometry(0.085, 24, 16);
    const nub = new THREE.SphereGeometry(0.045, 16, 12);
    const segs: { center: number; meshes: { geo: THREE.BufferGeometry; mat: THREE.Material; pos: THREE.Vector3; quat?: THREE.Quaternion; len?: number }[]; tubes: THREE.BufferGeometry[] }[] = [];
    const angleAt = (i: number) => (i / PAIRS) * Math.PI * 2 * TURNS;
    const yAt = (i: number) => (i / (PAIRS - 1) - 0.5) * HEIGHT;
    for (let s = 0; s < SEGMENTS; s++) {
      const i0 = s * PER_SEG;
      const center = (yAt(i0) + yAt(i0 + PER_SEG - 1)) / 2;
      const meshes: { geo: THREE.BufferGeometry; mat: THREE.Material; pos: THREE.Vector3; quat?: THREE.Quaternion; len?: number }[] = [];
      const ptsA: THREE.Vector3[] = [];
      const ptsB: THREE.Vector3[] = [];
      for (let k = 0; k < PER_SEG; k++) {
        const i = i0 + k;
        const a = angleAt(i);
        const y = yAt(i) - center;
        const A = new THREE.Vector3(Math.cos(a) * RADIUS, y, Math.sin(a) * RADIUS);
        const B = new THREE.Vector3(Math.cos(a + Math.PI) * RADIUS, y, Math.sin(a + Math.PI) * RADIUS);
        ptsA.push(A); ptsB.push(B);
        meshes.push({ geo: bead, mat: mats.bead, pos: A });
        meshes.push({ geo: bead, mat: mats.bead, pos: B });
        // rung (base pair) between the strands
        const dir = new THREE.Vector3().subVectors(B, A);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        meshes.push({ geo: new THREE.CylinderGeometry(0.022, 0.022, len * 0.86, 10), mat: mats.rung, pos: A.clone().add(B).multiplyScalar(0.5), quat });
        meshes.push({ geo: nub, mat: mats.bead, pos: A.clone().lerp(B, 0.5) });
      }
      const tube = (pts: THREE.Vector3[]) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.035, 10, false);
      segs.push({ center, meshes, tubes: [tube(ptsA), tube(ptsB)] });
    }
    return { segments: segs, mats };
  }, []);

  useModelTransform("dna", root, (_g, _t, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.35 * (1 - scene.explode * 0.7);
  });

  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const e = scene.explode;
    const t = state.clock.elapsedTime;
    segRefs.current.forEach((g, i) => {
      if (!g) return;
      const base = segments[i].center;
      // Keep the five segments inside the visible width when the helix lies flat.
      const aspect = size.width / Math.max(size.height, 1);
      const halfW = Math.tan((35 * Math.PI) / 360) * 6 * aspect;
      const spreadScale = Math.min(1, (halfW * 0.8) / 1.7);
      const spread = (i - (SEGMENTS - 1) / 2) * e * 0.85 * spreadScale;
      g.position.y = base + spread;
      g.rotation.y = e * (i % 2 ? 1 : -1) * (0.6 + Math.sin(t * 0.6 + i) * 0.25);
      g.rotation.x = e * Math.sin(t * 0.5 + i * 1.3) * 0.25;
      const focusScale = scene.focus < 0 ? 1 : scene.focus === i ? 1.25 : 0.55;
      const sNow = g.scale.x + (focusScale - g.scale.x) * 0.08;
      g.scale.setScalar(sNow);
      // project segment centre to screen for the HTML hover labels
      g.getWorldPosition(v);
      v.project(camera);
      scene.segScreen[i].x = (v.x * 0.5 + 0.5) * size.width;
      scene.segScreen[i].y = (-v.y * 0.5 + 0.5) * size.height;
    });
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        {segments.map((seg, i) => (
          <group key={i} ref={(el) => { segRefs.current[i] = el; }} position={[0, seg.center, 0]}>
            {seg.meshes.map((m, k) => (
              <mesh key={k} geometry={m.geo} material={m.mat} position={m.pos} quaternion={m.quat ?? new THREE.Quaternion()} />
            ))}
            {seg.tubes.map((g, k) => (
              <mesh key={`t${k}`} geometry={g} material={mats.strand} />
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
