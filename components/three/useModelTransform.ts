import { useFrame, type RootState } from "@react-three/fiber";
import type { RefObject } from "react";
import * as THREE from "three";
import { scene, type ModelKey } from "@/lib/scene";
import { modelCover } from "@/lib/headingCover";
import { setOpacity } from "./materials";

const center = new THREE.Vector3();
const edgeX = new THREE.Vector3();
const edgeY = new THREE.Vector3();

/**
 * Drives a model group from the shared scroll state.
 * `idle` lets each model add its own continuous animation on top.
 */
export function useModelTransform(
  key: ModelKey,
  ref: RefObject<THREE.Group | null>,
  idle?: (g: THREE.Group, t: number, dt: number) => void,
  frame?: (g: THREE.Group, state: RootState) => void,
) {
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const st = scene[key];
    const vis = Math.max(0, Math.min(1, st.o));
    g.visible = vis > 0.005;
    if (!g.visible) return;
    const ease = vis * vis * (3 - 2 * vis);
    // Offsets were authored for a ~16:10 desktop frame. Narrow viewports see
    // less world-width, so pull models back toward centre and scale them down.
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const halfW = Math.tan((35 * Math.PI) / 360) * 6 * aspect;
    const xFit = Math.min(1, (halfW * 0.78) / 1.9);
    const sFit = aspect < 0.7 ? 0.68 : aspect < 1 ? 0.8 : aspect < 1.25 ? 0.92 : 1;
    g.position.set(st.x * xFit + scene.pointer.x * 0.06 * xFit, st.y + scene.pointer.y * 0.04, st.z);
    g.rotation.set(st.rx, st.ry, st.rz);
    g.scale.setScalar(Math.max(0.0001, st.s * sFit * (0.6 + 0.4 * ease)));
    frame?.(g, state);
    // Dull the model while it crosses a heading, so the type stays readable.
    const rz = Math.abs(g.rotation.z % Math.PI);
    const c = Math.abs(Math.cos(rz));
    const sn = Math.abs(Math.sin(rz));
    const hw = (0.72 * c + 1.5 * sn) * g.scale.x;
    const hh = (1.5 * c + 0.72 * sn) * g.scale.y;
    g.getWorldPosition(center);
    edgeX.copy(center).x += hw;
    edgeY.copy(center).y += hh;
    center.project(state.camera);
    edgeX.project(state.camera);
    edgeY.project(state.camera);
    const viewW = state.size.width;
    const viewH = state.size.height;
    const sx = (center.x * 0.5 + 0.5) * viewW;
    const sy = (-center.y * 0.5 + 0.5) * viewH;
    const cover = modelCover(
      sx,
      sy,
      Math.abs((edgeX.x * 0.5 + 0.5) * viewW - sx),
      Math.abs((-edgeY.y * 0.5 + 0.5) * viewH - sy),
    );
    const prev = (g.userData.cover as number | undefined) ?? 0;
    const next = prev + (cover - prev) * Math.min(1, dt * 8);
    g.userData.cover = next;
    setOpacity(g, ease * (1 - next * 0.82));
    idle?.(g, state.clock.elapsedTime, dt);
  });
}
