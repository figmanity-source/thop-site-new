"use client";
import { useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { chrome } from "./materials";
import { useModelTransform } from "./useModelTransform";

/**
 * "Biological Twin": a realistic adult figure (Grab3D man base mesh, CC0)
 * re-skinned in chrome, walking in place. Replaces the cartoon Cesium sample.
 */
const URL = "/models/man-base-rigged.glb";

export default function Twin() {
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { scene: model, animations } = useGLTF(URL, false);
  const { actions, names } = useAnimations(animations, inner);

  const { offset, scale } = useMemo(() => {
    const mat = chrome();
    model.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) { m.material = mat; m.frustumCulled = false; }
    });
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.1 / Math.max(size.y, 0.0001);
    return { offset: center.multiplyScalar(-1), scale };
  }, [model]);

  useEffect(() => {
    const walk = actions.walk ?? actions[names.find((n) => n.toLowerCase() === "walk") ?? ""];
    if (!walk) return;
    walk.reset().play();
    walk.timeScale = 0.72;
  }, [actions, names]);

  useModelTransform("twin", root);

  return (
    <group ref={root}>
      <group scale={scale}>
        <group ref={inner} position={offset}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(URL, false);
