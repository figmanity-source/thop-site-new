"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { chrome, glass } from "./materials";
import { useModelTransform } from "./useModelTransform";

/**
 * Procedural stem cell: glass membrane, chrome nucleus, orbiting organelles
 * and orbit rings (echoing the glass-sphere visuals of the THOP demo).
 */
export default function Cell() {
  const root = useRef<THREE.Group>(null);
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

  useModelTransform("cell", root, (_g, t, dt) => {
    if (nucleus.current) nucleus.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035);
    if (membrane.current) {
      membrane.current.scale.set(1 + Math.sin(t * 0.9) * 0.015, 1 + Math.cos(t * 0.7) * 0.02, 1 + Math.sin(t * 0.8 + 1) * 0.015);
      membrane.current.rotation.y += dt * 0.1;
    }
    if (rings.current) {
      rings.current.children.forEach((r, i) => { r.rotation.z += dt * (0.12 + i * 0.05) * (i % 2 ? -1 : 1); r.rotation.x += dt * 0.05; });
    }
    if (organelles.current) {
      organelles.current.children.forEach((o, i) => {
        const d = orgData[i];
        const a = t * d.speed + d.phase;
        o.position.set(Math.cos(a) * d.r, Math.sin(a) * d.r * Math.cos(d.tilt), Math.sin(a) * d.r * Math.sin(d.tilt));
      });
    }
  });

  return (
    <group ref={root}>
      <mesh ref={membrane} material={mats.glass} renderOrder={2}>
        <sphereGeometry args={[0.95, 64, 48]} />
      </mesh>
      <mesh ref={nucleus} material={mats.chrome}>
        <sphereGeometry args={[0.34, 64, 48]} />
      </mesh>
      <group ref={organelles}>
        {orgData.map((d, i) => (
          <mesh key={i} material={mats.chrome}>
            <sphereGeometry args={[d.size, 24, 16]} />
          </mesh>
        ))}
      </group>
      <group ref={rings}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={mats.ring} rotation={[Math.PI / 2 + i * 0.5, i * 0.8, 0]}>
            <torusGeometry args={[1.12 + i * 0.07, 0.006, 8, 160]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
