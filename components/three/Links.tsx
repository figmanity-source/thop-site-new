"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";
import { modelCover } from "@/lib/headingCover";
import { chrome, darkChrome, setOpacity } from "./materials";

/**
 * Molecule chain ("bracelet links" in the original): alternating capsules and
 * spheres on a large ring that rotates past the camera while scrolling.
 * The ring sits in the gap under the headline. Any bead that still crosses
 * the type fades out, the same way the other models yield to headings.
 */
const COUNT = 26;
const R = 3.4;
const _v = new THREE.Vector3();

export default function Links() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const capsule = new THREE.CapsuleGeometry(0.13, 0.62, 8, 24);
    const sphere = new THREE.SphereGeometry(0.18, 32, 24);
    const bond = new THREE.CylinderGeometry(0.028, 0.028, 0.42, 10);
    return Array.from({ length: COUNT }, (_, i) => {
      const a = (i / COUNT) * Math.PI * 2;
      return {
        a,
        geo: i % 2 ? sphere : capsule,
        mat: i % 2 ? chrome() : darkChrome(),
        bond,
        bondMat: chrome(),
      };
    });
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const o = scene.links;
    g.visible = o > 0.01;
    if (!g.visible) return;
    if (ring.current) {
      ring.current.rotation.y = scene.linksOffset * Math.PI * 1.2 + (1 - o) * 0.6;
      const cam = state.camera;
      const viewW = state.size.width;
      const viewH = state.size.height;
      ring.current.children.forEach((c, i) => {
        c.rotation.x = scene.linksOffset * Math.PI * 2 * (i % 2 ? 1 : -1) + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.1;
        c.getWorldPosition(_v);
        const dist = Math.max(0.4, _v.distanceTo(cam.position));
        _v.project(cam);
        const onScreen = _v.z > 0 && _v.z < 1;
        const sx = (_v.x * 0.5 + 0.5) * viewW;
        const sy = (-_v.y * 0.5 + 0.5) * viewH;
        const halfH = Math.tan((35 * Math.PI) / 360) * dist;
        const px = (0.5 / (halfH * 2)) * viewH;
        const cover = onScreen ? modelCover(sx, sy, px * 0.9, px * 1.15) : 0;
        const prev = (c.userData.cover as number | undefined) ?? 0;
        const next = prev + (cover - prev) * 0.45;
        c.userData.cover = next;
        setOpacity(c, o * (1 - next * 0.94));
      });
    }
    // Sit the chain in the open band under the headline (about 64% down the frame).
    g.position.y = -0.28 + (1 - o) * -1.2;
    const aspect = state.size.width / Math.max(state.size.height, 1);
    g.scale.setScalar(Math.min(0.58, Math.max(0.42, aspect / 2.4)));
  });

  return (
    <group ref={group} position={[0, 0, -R + 1.2]}>
      <group ref={ring}>
        {items.map((it, i) => (
          <group key={i} position={[Math.sin(it.a) * R, 0, Math.cos(it.a) * R]} rotation={[0, it.a, 0]}>
            <mesh geometry={it.geo} material={it.mat} />
            <mesh geometry={it.bond} material={it.bondMat} rotation={[0, 0, Math.PI / 2]} position={[0.38, 0, 0]} />
          </group>
        ))}
      </group>
    </group>
  );
}
