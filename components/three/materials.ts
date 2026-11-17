import * as THREE from "three";

/** Polished chrome, the same look as the original watch steel. */
export const chrome = () =>
  new THREE.MeshStandardMaterial({ color: "#d9d9dc", metalness: 1, roughness: 0.16, envMapIntensity: 1.25 });

export const darkChrome = () =>
  new THREE.MeshStandardMaterial({ color: "#2a2a2e", metalness: 1, roughness: 0.22, envMapIntensity: 1.4 });

/** Glass-like membrane without the transmission pass (cheap + works on transparent canvas). */
export const glass = () =>
  new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.04,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 2.2,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

/** Applies a model's visibility to all of its materials (fade) */
export function setOpacity(root: THREE.Object3D, o: number) {
  root.traverse((c) => {
    const m = (c as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    (Array.isArray(m) ? m : [m]).forEach((mat) => {
      const base = (mat.userData.baseOpacity ??= mat.opacity);
      const wasTransparent = (mat.userData.baseTransparent ??= mat.transparent);
      mat.opacity = base * o;
      const t = wasTransparent || o < 0.999;
      if (mat.transparent !== t) { mat.transparent = t; mat.needsUpdate = true; }
    });
  });
}
