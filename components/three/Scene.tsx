"use client";
import { Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { scene } from "@/lib/scene";
import DNA from "./DNA";
import Cell from "./Cell";
import Twin from "./Twin";
import Particles from "./Particles";
import Links from "./Links";
import AmbientField from "./AmbientField";

/** Studio lighting built from light-formers: no HDR download, works offline. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={2} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="ring" intensity={1.5} position={[0, 0, 5]} scale={3} />
      <Lightformer form="rect" intensity={0.6} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#bbbbbb" />
    </Environment>
  );
}

function Ready() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  let frames = 0;
  useFrame(() => {
    if (!scene.ready && ++frames > 3) scene.ready = true;
  });
  return null;
}

function Pointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

export default function Scene({ cinematic = false, paused = false, lightBackground = false }: { cinematic?: boolean; paused?: boolean; lightBackground?: boolean }) {
  return (
    <div id="canvas-wrapper">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Studio />
          {cinematic && <AmbientField paused={paused} light={lightBackground} />}
          <Particles dense={cinematic} paused={paused} />
          <DNA paused={paused} />
          <Cell paused={paused} />
          <Twin />
          <Links />
          <Ready />
        </Suspense>
        <Pointer />
      </Canvas>
    </div>
  );
}
