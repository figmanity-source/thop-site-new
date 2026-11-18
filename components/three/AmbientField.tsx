"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** GPU-driven depth field. Mobile gets a smaller point budget. */
export default function AmbientField({ paused, light = false }: { paused: boolean; light?: boolean }) {
  const width = useThree((state) => state.size.width);
  const points = useRef<THREE.Points>(null);
  const count = width < 768 ? 1200 : 4200;
  const geometry = useMemo(() => {
    let seed = 83;
    const random = () => ((seed = seed * 16807 % 2147483647) / 2147483647);
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (random() - .5) * 18;
      positions[index * 3 + 1] = (random() - .5) * 12;
      positions[index * 3 + 2] = -random() * 8 - 1;
      phases[index] = random() * Math.PI * 2;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    return result;
  }, [count]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { time: { value: 0 }, tone: { value: 1 } },
    vertexShader: `attribute float phase; uniform float time; varying float alpha;
      void main() { vec3 p=position; p.x+=sin(time*.07+phase)*.18; p.y+=cos(time*.1+phase)*.14;
      vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
      gl_PointSize=clamp((1.1+sin(phase)*.45)*8./-mv.z,.6,3.);
      alpha=.2+.25*(.5+.5*sin(time*.3+phase)); }`,
    fragmentShader: `uniform float tone; varying float alpha; void main(){float r=length(gl_PointCoord-.5); if(r>.5)discard;
      gl_FragColor=vec4(vec3(tone),alpha*.65*smoothstep(.5,.12,r));}`,
  }), []);
  useFrame((_, delta) => {
    material.uniforms.tone.value = light ? .18 : .86;
    if (!paused) material.uniforms.time.value += delta;
    if (points.current && !paused) points.current.rotation.y += delta * .007;
  });
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
