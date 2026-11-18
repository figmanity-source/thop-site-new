"use client";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { useModelTransform } from "./useModelTransform";
import { useTwinModel } from "./useTwinModel";

/** Static Tesla Bot driven by the existing Biological Twin scroll choreography. */
export default function Twin({ hero }: { hero?: RefObject<HTMLElement | null> }) {
  const root = useRef<THREE.Group>(null);
  const { model, offset, scale, size } = useTwinModel();
  useModelTransform("twin", root, undefined, (group, state) => {
    const stage = hero?.current;
    if (!stage || state.size.width >= 768) return;
    const bounds = stage.getBoundingClientRect();
    const sceneBottom = stage.parentElement?.getBoundingClientRect().bottom ?? bounds.bottom;
    if (sceneBottom <= 0) return;

    // Frame the existing model against the hero's centre in the fixed viewport.
    // Release the offset before the next chapter takes over the shared scene.
    const blend = THREE.MathUtils.smoothstep(sceneBottom / state.size.height, 0.55, 0.95);
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, group.position.z]);
    const visibleScale = Math.min(
      group.scale.x,
      viewport.width * 0.88 / Math.hypot(size.x, size.z),
      viewport.height * 0.86 / size.y,
    );
    const halfHeight = size.y * visibleScale * state.size.height / viewport.height / 2;
    const heroCenter = (bounds.top + bounds.bottom) / 2;
    const centerY = THREE.MathUtils.clamp(
      heroCenter,
      halfHeight + 16,
      state.size.height - halfHeight - 16,
    );
    const worldY = (0.5 - centerY / state.size.height) * viewport.height;
    group.position.y = THREE.MathUtils.lerp(group.position.y, worldY, blend);
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, visibleScale, blend));
  });
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
