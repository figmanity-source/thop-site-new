import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import ts from "typescript";

const copy = {};
new Function("exports", ts.transpileModule(fs.readFileSync("lib/content.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(copy);
const requiredCopy = [copy.healthspan.body, copy.why.body, copy.why.note, copy.protocol.body,
  copy.journey.steps[0].text, ...copy.journey.steps[0].leaves, copy.blueprint.intro, copy.blueprint.smallPrint,
  ...copy.blueprint.tests.map((test) => test.text), copy.twin.dashboard, copy.twin.twin, copy.twin.reveal,
  copy.dox.body, copy.dox.atEnd, copy.dox.who, copy.dox.disclaimer, ...copy.dox.parts.map((part) => part.text),
  copy.cellution.body, copy.cellution.who, ...copy.cellution.parts.map((part) => part.text), ...copy.cellution.rules.map((rule) => rule.text),
  ...copy.howCellution.steps.map((step) => step.text), ...copy.howCellution.areas, copy.howCellution.disclaimer,
  copy.continuum.body, copy.continuum.welcome, copy.continuum.note, ...copy.continuum.items,
  copy.biology.body, copy.founder.body, copy.founder.title, copy.team.body, copy.centre.body,
  ...copy.faqs.flatMap((faq) => [faq.q, faq.a]),
  copy.contact.body, copy.contact.disclaimer, ...copy.contact.contactLines];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const base = process.env.BIOVITY_PREVIEW_URL ?? "http://localhost:3005";
const directory = "artifacts/header-dock";
fs.mkdirSync(directory, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "biovity-cinema-"));
const browser = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--remote-debugging-port=9333", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "about:blank"], { windowsHide: true, stdio: "ignore" });
let socket;
let sequence = 0;
const pending = new Map();
const errors = [];
function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(method + " timed out")); }, 40000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function shot(name) {
  const result = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${directory}/${name}.png`, Buffer.from(result.data, "base64"));
}
async function scrollTo(selector) {
  await evaluate(`(() => { const e=document.querySelector('${selector}'); const y=e.getBoundingClientRect().top+scrollY-100; window.scrollTo(0,y); })()`);
  await delay(1800);
}
try {
  let target;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { target = (await (await fetch("http://127.0.0.1:9333/json/list")).json()).find((item) => item.type === "page"); } catch {}
    if (target) break;
    await delay(250);
  }
  assert(target, "Headless Chrome failed to start");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      if (!task) return;
      clearTimeout(task.timeout); pending.delete(message.id);
      message.error ? task.reject(new Error(JSON.stringify(message.error))) : task.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    else if (message.method === "Network.responseReceived" && message.params.response.status >= 400) errors.push(message.params.response.status + " " + message.params.response.url);
  };
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");

const results=[];
for(const width of [1440,360]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});await send('Page.navigate',{url:base});
 for(let i=0;i<100;i++){await delay(200);if(await evaluate(`!!document.querySelector('[data-header-ready=true]')&&getComputedStyle(document.querySelector('#loader')).display==='none'`))break;}
 await delay(850);
 await evaluate(`(()=>{window.headerExitFrames=[];const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){if(this.matches?.('.cine-header')&&options?.duration===420)window.headerExitFrames.push({frames,top:this.getBoundingClientRect().top,height:this.getBoundingClientRect().height,viewport:innerHeight});return original.call(this,frames,options)}})()`);
 await evaluate(`(()=>{window.dockSamples=[];const root=document.querySelector('.cinematic-home');window.dockObserver=new MutationObserver(()=>{const header=document.querySelector('.cine-header');window.dockSamples.push({docked:root.classList.contains('past-intro'),opacity:Number(getComputedStyle(header).opacity)})});window.dockObserver.observe(root,{attributes:true,attributeFilter:['class']})})()`);
 await scrollTo('#healthspan');await delay(700);
 assert(await evaluate(`document.querySelector('.cinematic-home').classList.contains('past-intro')`),'Dock entered');
 await evaluate('window.scrollTo(0,0)');await delay(1800);
 assert(await evaluate(`!document.querySelector('.cinematic-home').classList.contains('past-intro')`),'Header returns to top');
 const samples=await evaluate('window.dockSamples');assert(samples.length>=2,'Both layout changes observed');assert(samples.every(s=>s.opacity<.08),'Layout changes must occur while hidden: '+JSON.stringify(samples));
 for(let i=0;i<5;i++){await evaluate(i%2===0?`window.scrollTo(0,document.querySelector('#healthspan').getBoundingClientRect().top+scrollY+180)`:'window.scrollTo(0,0)');await delay(50);}
 for(let i=0;i<80;i++){await delay(200);if(await evaluate(`!document.querySelector('.cine-header').hasAttribute('data-dock-transition') && document.querySelector('.cinematic-home').classList.contains('past-intro')`))break;}
 const final=await evaluate(`(()=>{const h=document.querySelector('.cine-header'),r=h.getBoundingClientRect(),s=getComputedStyle(h);return{docked:document.querySelector('.cinematic-home').classList.contains('past-intro'),opacity:Number(s.opacity),pointer:s.pointerEvents,transition:h.hasAttribute('data-dock-transition'),top:r.top,bottom:r.bottom,viewport:innerHeight,scene:document.querySelector('.cinematic-home').dataset.activeScene,scrollY:scrollY}})()`);
 assert(final.docked&&final.opacity>.99&&!final.transition&&final.pointer!=='none','Interrupted transition settles: '+JSON.stringify(final));assert(final.top>final.viewport-120&&final.bottom<=final.viewport+1);
 const exits=await evaluate('window.headerExitFrames');assert(exits.length>=2,'Both exits recorded');for(const exit of exits){const y=parseFloat(exit.frames[1].translate.split(' ').at(-1));assert(exit.frames[1].opacity===exit.frames[0].opacity,'Do not fade while still on screen');assert(exit.top+y+exit.height<0||exit.top+y>exit.viewport,'Exit clears the viewport before layout switch');}
 await shot('docked-'+width);await evaluate('window.dockObserver.disconnect()');results.push({width,samples,final});console.log('PASS smooth docking both directions and rapid reversals '+width);
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:base+'/#healthspan'});await delay(4000);assert(await evaluate(`document.querySelector('.cinematic-home').classList.contains('past-intro')&&!document.querySelector('.cine-header').hasAttribute('data-dock-transition')`),'Reduced motion remains usable');
fs.writeFileSync(directory+'/checks.json',JSON.stringify({results,errors},null,2));assert.deepEqual(errors,[]);console.log('PASS header docking and reduced motion');
}finally{if(socket?.readyState===WebSocket.OPEN){try{await send('Browser.close');}catch{}socket.close();}browser.kill();}
