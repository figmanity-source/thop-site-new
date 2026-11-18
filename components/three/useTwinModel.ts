import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { chrome } from "./materials";

const URL = "/models/tesla-bot.glb";

/** Independent scene instances and fade materials; shared cached geometry. */
export function useTwinModel() {
  const { scene } = useGLTF(URL, false);
  return useMemo(() => {
    const model = scene.clone(true);
    const material = chrome();
    model.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = material;
      mesh.frustumCulled = false;
    });
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.1 / Math.max(size.y, 0.0001);
    return {
      model,
      offset: box.getCenter(new THREE.Vector3()).multiplyScalar(-1),
      scale,
      size: size.multiplyScalar(scale),
    };
  }, [scene]);
}

