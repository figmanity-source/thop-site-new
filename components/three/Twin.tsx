"use client";
import { useRef } from "react";
import * as THREE from "three";
import { useModelTransform } from "./useModelTransform";
import { useTwinModel } from "./useTwinModel";

/** Static Tesla Bot driven by the existing Biological Twin scroll choreography. */
export default function Twin() {
  const root = useRef<THREE.Group>(null);
  const { model, offset, scale } = useTwinModel();
  useModelTransform("twin", root);
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
