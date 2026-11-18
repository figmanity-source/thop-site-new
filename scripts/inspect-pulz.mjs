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
  ...copy.faqs.filter((faq) => !faq.a.includes("[To be confirmed by BIOVITY]")).flatMap((faq) => [faq.q, faq.a]),
  copy.contact.body, copy.contact.disclaimer, ...copy.contact.contactLines.map((line) => line.replace(/\s*\[to be supplied\]/, ""))];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const base = process.env.BIOVITY_PREVIEW_URL ?? "http://localhost:3005";
const directory = "artifacts/pulz-reference";
fs.mkdirSync(directory, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "biovity-cinema-"));
const browser = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--remote-debugging-port=9334", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "about:blank"], { windowsHide: true, stdio: "ignore" });
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
    try { target = (await (await fetch("http://127.0.0.1:9334/json/list")).json()).find((item) => item.type === "page"); } catch {}
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

  await send("Emulation.setDeviceMetricsOverride", {width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send("Page.navigate", {url:"https://www.pulz.ai/"});
  await delay(12000); await shot("hero");
  const info=await evaluate(`({title:document.title,height:document.documentElement.scrollHeight,scripts:[...document.scripts].map(s=>s.src).filter(Boolean),styles:[...document.querySelectorAll('link[rel=stylesheet]')].map(s=>s.href),sections:[...document.querySelectorAll('section')].map(s=>({classes:s.className,text:s.innerText.slice(0,160),height:s.offsetHeight})),bodyBg:getComputedStyle(document.body).backgroundColor})`);
  fs.writeFileSync(directory+"/inspection.json",JSON.stringify(info,null,2));
  for(const y of [850,1700,2600,3500,4600,5800,7200]) {await evaluate('window.scrollTo(0,'+y+')');await delay(2000);await shot('scroll-'+y);}
  const scripts=await evaluate(`Promise.all([...document.scripts].filter(s=>s.src.includes('pulz')||s.src.includes('webflow')).map(async s=>({url:s.src,text:await fetch(s.src).then(r=>r.text()).catch(()=>"")})))`);
  fs.writeFileSync(directory+"/scripts.json",JSON.stringify(scripts));
  console.log(JSON.stringify(info));
}finally{if(socket?.readyState===WebSocket.OPEN){try{await send("Browser.close");}catch{}socket.close();}browser.kill();}
