import fs from "node:fs";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import * as THREE from "three";

// Source textures are omitted because the site supplies its existing chrome finish.
const manager = new THREE.LoadingManager();
manager.addHandler(/.*/, {
  setPath() { return this; },
  load() { return new THREE.Texture(); },
});
globalThis.window = { URL: { createObjectURL() { return ""; } } };
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};

if (!process.argv[2]) throw new Error("Usage: node scripts/convert-tesla-bot.mjs <source.fbx>");
const data = fs.readFileSync(process.argv[2]);
const model = new FBXLoader(manager).parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), "");
model.traverse((object) => {
  if (!object.isMesh) return;
  object.geometry = mergeVertices(object.geometry);
  object.material = new THREE.MeshStandardMaterial({ color: "#d9d9dc", metalness: 1, roughness: 0.16, envMapIntensity: 1.25 });
});
const output = await new GLTFExporter().parseAsync(model, { binary: true });
fs.writeFileSync(new URL("../public/models/tesla-bot.glb", import.meta.url), Buffer.from(output));
console.log(`Saved ${output.byteLength} bytes; source has ${model.animations.length} animation clips.`);
