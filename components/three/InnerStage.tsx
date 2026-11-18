"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { chrome, darkChrome, glass, setOpacity } from "./materials";

import { useTwinModel } from "./useTwinModel";
type Key = "dna" | "cell" | "twin";

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={2} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="ring" intensity={1.5} position={[0, 0, 5]} scale={3} />
    </Environment>
  );
}

function Helix({ root, paused = false }: { root: RefObject<THREE.Group | null>; paused?: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const built = useMemo(() => {
    const strand = chrome();
    const rung = darkChrome();
    const bead = chrome();
    const pairs = 32;
    const height = 2.8;
    const radius = 0.48;
    const turns = 2.2;
    const sphere = new THREE.SphereGeometry(0.075, 18, 12);
    const nub = new THREE.SphereGeometry(0.04, 12, 10);
    const meshes: { geo: THREE.BufferGeometry; mat: THREE.Material; pos: THREE.Vector3; quat?: THREE.Quaternion }[] = [];
    const aPts: THREE.Vector3[] = [];
    const bPts: THREE.Vector3[] = [];
    for (let i = 0; i < pairs; i++) {
      const a = (i / pairs) * Math.PI * 2 * turns;
      const y = (i / (pairs - 1) - 0.5) * height;
      const A = new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius);
      const B = new THREE.Vector3(Math.cos(a + Math.PI) * radius, y, Math.sin(a + Math.PI) * radius);
      aPts.push(A);
      bPts.push(B);
      meshes.push({ geo: sphere, mat: bead, pos: A }, { geo: sphere, mat: bead, pos: B });
      const dir = new THREE.Vector3().subVectors(B, A);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      meshes.push({
        geo: new THREE.CylinderGeometry(0.02, 0.02, dir.length() * 0.86, 8),
        mat: rung,
        pos: A.clone().add(B).multiplyScalar(0.5),
        quat,
      });
      meshes.push({ geo: nub, mat: bead, pos: A.clone().lerp(B, 0.5) });
    }
    const tube = (pts: THREE.Vector3[]) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.032, 8, false);
    return { meshes, tubes: [tube(aPts), tube(bPts)], strand };
  }, []);

  useFrame((_, dt) => {
    if (spin.current && !paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) spin.current.rotation.y += dt * 0.28;
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        {built.meshes.map((m, i) => (
          <mesh key={i} geometry={m.geo} material={m.mat} position={m.pos} quaternion={m.quat ?? new THREE.Quaternion()} />
        ))}
        {built.tubes.map((geo, i) => (
          <mesh key={`t${i}`} geometry={geo} material={built.strand} />
        ))}
      </group>
    </group>
  );
}

export function InlineHelix({ className = "sheet-inline-helix", showOnMobile = false, paused = false, cameraDistance = 5.4 }: {
  className?: string;
  showOnMobile?: boolean;
  paused?: boolean;
  cameraDistance?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () => setVisible(desktop.matches);
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {(visible || showOnMobile) && (
        <Canvas
          dpr={[1, 1.75]}
          resize={{ offsetSize: true }}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, cameraDistance], fov: 35 }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 5]} intensity={1.15} />
          <Suspense fallback={null}>
            <Studio />
            <Helix root={root} paused={paused} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

function CellOrb({ root }: { root: RefObject<THREE.Group | null> }) {
  const nucleus = useRef<THREE.Mesh>(null);
  const membrane = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const organelles = useRef<THREE.Group>(null);
  const mats = useMemo(() => ({ glass: glass(), chrome: chrome(), ring: chrome() }), []);
  const orgData = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      r: 0.48 + (i % 3) * 0.12,
      size: 0.05 + ((i * 37) % 5) * 0.012,
      speed: 0.25 + ((i * 13) % 7) * 0.07,
      tilt: (i / 9) * Math.PI,
      phase: i * 1.7,
    })),
    [],
  );
  useFrame((state, dt) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = state.clock.elapsedTime;
    if (nucleus.current) nucleus.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035);
    if (membrane.current) {
      membrane.current.rotation.y += dt * 0.1;
      membrane.current.scale.set(1 + Math.sin(t * 0.9) * 0.015, 1 + Math.cos(t * 0.7) * 0.02, 1);
    }
    rings.current?.children.forEach((r, i) => {
      r.rotation.z += dt * (0.12 + i * 0.05) * (i % 2 ? -1 : 1);
    });
    organelles.current?.children.forEach((o, i) => {
      const d = orgData[i];
      const a = t * d.speed + d.phase;
      o.position.set(Math.cos(a) * d.r, Math.sin(a) * d.r * Math.cos(d.tilt), Math.sin(a) * d.r * Math.sin(d.tilt));
    });
  });
  return (
    <group ref={root}>
      <mesh ref={membrane} material={mats.glass}>
        <sphereGeometry args={[0.95, 48, 36]} />
      </mesh>
      <mesh ref={nucleus} material={mats.chrome}>
        <sphereGeometry args={[0.34, 48, 36]} />
      </mesh>
      <group ref={organelles}>
        {orgData.map((d, i) => (
          <mesh key={i} material={mats.chrome}>
            <sphereGeometry args={[d.size, 16, 12]} />
          </mesh>
        ))}
      </group>
      <group ref={rings}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={mats.ring} rotation={[Math.PI / 2 + i * 0.5, i * 0.8, 0]}>
            <torusGeometry args={[1.12 + i * 0.07, 0.006, 8, 120]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Figure({ root }: { root: RefObject<THREE.Group | null> }) {
  const { model, offset, scale } = useTwinModel();
  return (
    <group ref={root}>
      <group scale={scale}>
        <group position={offset}>
          <primitive object={model} dispose={null} />
        </group>
      </group>
    </group>
  );
}

function Rig() {
  const dna = useRef<THREE.Group>(null);
  const cell = useRef<THREE.Group>(null);
  const twin = useRef<THREE.Group>(null);
  const shown = useRef({ dna: 0, cell: 0, twin: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-object]");
    const mid = window.innerHeight * 0.46;
    let best: Key | null = null;
    let bestDist = Infinity;
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 80 || r.top > window.innerHeight - 40) return;
      const d = Math.abs(r.top + Math.min(r.height, window.innerHeight) * 0.35 - mid);
      if (d < bestDist) {
        bestDist = d;
        const key = el.dataset.object;
        if (key === "dna" || key === "cell" || key === "twin") best = key;
      }
    });
    const goal = { dna: best === "dna" ? 1 : 0, cell: best === "cell" ? 1 : 0, twin: best === "twin" ? 1 : 0 };
    (Object.keys(goal) as Key[]).forEach((key) => {
      shown.current[key] += (goal[key] - shown.current[key]) * 0.08;
    });
    const aspect = size.width / Math.max(size.height, 1);
    const halfW = Math.tan((35 * Math.PI) / 360) * 6 * aspect;
    const x = halfW * (aspect > 1 ? 0.36 : 0.22);
    const y = Math.sin(state.clock.elapsedTime * 0.45) * 0.06;
    const fit = aspect > 1.2 ? 1 : aspect > 0.8 ? 0.78 : 0.55;
    const place = (g: THREE.Group | null, key: Key, scale: number) => {
      if (!g) return;
      const v = shown.current[key];
      g.visible = v > 0.02;
      if (!g.visible) return;
      const ease = v * v * (3 - 2 * v);
      g.position.set(x + pointer.current.x * 0.08, y + pointer.current.y * 0.04, 0);
      g.scale.setScalar(scale * (0.72 + 0.28 * ease) * fit);
      setOpacity(g, ease);
    };
    place(dna.current, "dna", 1.05);
    place(cell.current, "cell", 1.15);
    place(twin.current, "twin", 1);
  });

  return (
    <>
      <Helix root={dna} />
      <CellOrb root={cell} />
      <Suspense fallback={null}>
        <Figure root={twin} />
      </Suspense>
    </>
  );
}

export default function InnerStage() {
  return (
    <div className="inner-stage" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 40 }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 5]} intensity={1.15} />
        <Suspense fallback={null}>
          <Studio />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}
