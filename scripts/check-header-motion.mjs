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
const directory = "artifacts/header-motion";
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
for(const route of ['/', '/about'])for(const width of [1440,360]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});await send('Page.navigate',{url:base+route});
 for(let i=0;i<100;i++){await delay(200);if(await evaluate(`!!document.querySelector('[data-animated-header][data-header-ready=true]') && (!document.querySelector('#loader')||getComputedStyle(document.querySelector('#loader')).display==='none')`))break;}
 await delay(850);
 const entrance=await evaluate(`getComputedStyle(document.querySelector('[data-animated-header]')).animationName`);assert.equal(entrance,'biovity-header-enter');
 if(width===1440){
  const point=await evaluate(`(()=>{const r=document.querySelector('[data-animated-header] nav a').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await delay(300);
  await evaluate(`(()=>{const a=document.querySelector('[data-animated-header] nav a');a.getAnimations().forEach(x=>x.finish())})()`);await evaluate('new Promise(requestAnimationFrame)');
  const hover=await evaluate(`({supported:matchMedia('(hover:hover)').matches,translate:getComputedStyle(document.querySelector('[data-animated-header] nav a')).translate,active:document.querySelector('[data-animated-header] nav a').matches(':hover')})`);if(hover.supported)assert(hover.active,'Navigation hover target');
 }else{
  await evaluate(`document.querySelector('[data-animated-header] button[aria-expanded]').click()`);await delay(500);
  const motion=await evaluate(`({transition:getComputedStyle(document.querySelector('[data-animated-header] nav')).transition,linkAnimation:getComputedStyle(document.querySelector('[data-animated-header] nav a')).animationName,open:document.querySelector('[data-animated-header] button[aria-expanded]').getAttribute('aria-expanded')})`);
  assert(motion.transition.includes('opacity')&&motion.transition.includes('display'),'Menu entrance/exit transition declarations');assert.equal(motion.linkAnimation,'biovity-link-enter');assert.equal(motion.open,'true');
  await evaluate(`document.querySelector('[data-animated-header] button[aria-expanded]').click()`);await delay(60);
  await evaluate(`document.querySelector('[data-animated-header] button[aria-expanded]').click()`);await delay(500);assert(await evaluate(`document.querySelector('[data-animated-header] button[aria-expanded]').getAttribute('aria-expanded')==='true'`));
  await shot((route==='/'?'home':'inner')+'-mobile-menu');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await evaluate(`Promise.all(document.querySelector('[data-animated-header] nav').getAnimations().map(a=>a.finished.catch(()=>{})))`);await delay(100);assert(await evaluate(`getComputedStyle(document.querySelector('[data-animated-header] nav')).display==='none'`));
 }

 results.push({route,width,entrance});console.log('PASS animated header '+route+' '+width);
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:base+'/about'});await delay(1600);assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-animated-header]')).animationName`),'none');
fs.writeFileSync(directory+'/checks.json',JSON.stringify({results,errors},null,2));assert.deepEqual(errors,[]);console.log('PASS header motion, rapid menu toggling, Escape and reduced motion');
}finally{if(socket?.readyState===WebSocket.OPEN){try{await send('Browser.close');}catch{}socket.close();}browser.kill();}
