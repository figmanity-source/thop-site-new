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
const directory = "artifacts/inner-pages";
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

  const baseline=JSON.parse(fs.readFileSync(directory+'/content-baseline.json','utf8'));
  const normalize=s=>s.replace(/\s+/g,' ').trim();
  for(const [route,expected] of Object.entries(baseline)) {
    const response=await fetch(base+route); assert.equal(response.status,200,route);
    const html=await response.text();const main=html.match(/<main\b[^>]*class="subpage"[^>]*>([\s\S]*?)<\/main>/)?.[1];assert(main,route);
    const actual=main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"');
    assert.equal(normalize(actual),expected,'Content changed: '+route);
  }
  console.log('PASS exact content preservation on all '+Object.keys(baseline).length+' routes');
  const results=[];
  const visits=process.argv.includes('--smoke') ? [['/about',360,800],['/your-journey',1440,1000],['/your-journey',360,800]] : [...Object.keys(baseline).map(route=>[route,1440,1000]),...['/about','/pathways','/science','/your-journey','/centre','/member-login'].flatMap(route=>[[route,768,1024],[route,360,800]])];
  for(const [route,width,height] of visits) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});
    await send('Page.navigate',{url:base+route});
    for(let i=0;i<40;i++){await delay(150);if(await evaluate(`document.readyState==='complete' && !!document.querySelector('.inner-experience')`))break;}
    await evaluate('document.fonts.ready.then(()=>true)');await delay(1000);
    const metrics=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('h1').textContent,stage:!!document.querySelector('.inner-stage'),nav:document.querySelectorAll('#header nav a').length,dock:(()=>{const r=document.querySelector('#header').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>innerHeight-120&&r.bottom<=innerHeight})(),internalScrollbars:[...document.querySelectorAll('.sheet-band,.sheet-band-content,.sheet-hero')].filter(e=>['auto','scroll'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+1).length})`);
    assert(metrics.scrollWidth<=width+1,route+' overflow at '+width);assert(metrics.dock,route+' dock bounds at '+width);assert.equal(metrics.nav,6);assert.equal(metrics.internalScrollbars,0);if(width<768)assert(!metrics.stage,'Mobile must not mount WebGL');if(route==='/your-journey'&&width===1440)assert(metrics.stage,'Desktop retains its original models');
    if(['/about','/pathways','/science','/your-journey','/centre','/member-login'].includes(route)){await delay(700);await shot(route.slice(1)+'-'+width);}
    if(route==='/science'&&width===1440){await scrollTo('.hallmark-layout');await evaluate(`document.querySelectorAll('.hallmark-ring button')[3].click()`);assert(await evaluate(`document.querySelectorAll('.hallmark-ring button')[3].getAttribute('aria-pressed')==='true'`));await shot('science-interaction');}
    if(route==='/pathways'&&width===1440){await scrollTo('.pathway-grid');await shot('pathway-index');}
    if(route==='/your-journey'&&width===360){await scrollTo('.faq-list');await evaluate(`document.querySelectorAll('.faq-item button')[1].click()`);assert(await evaluate(`document.querySelectorAll('.faq-item button')[1].getAttribute('aria-expanded')==='true'`));}
    if(route==='/about'&&width===360){
      await evaluate(`document.querySelector('.menu-toggle').click()`);await delay(150);
      assert(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true'`));
      assert(await evaluate(`(()=>{const r=document.querySelector('#header nav').getBoundingClientRect();return r.top>=0&&r.bottom<document.querySelector('#header').getBoundingClientRect().top})()`));await shot('mobile-menu');
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await evaluate(`document.querySelector('#header .enquire').click()`);await delay(150);assert(await evaluate(`!!document.querySelector('[role=dialog]')&&!document.querySelector('[name=consent]').checked`));await shot('mobile-enquiry');
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    }
    results.push({route,...metrics});console.log('PASS '+route+' '+width);
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await send('Page.navigate',{url:base+'/science'});await delay(1800);assert(await evaluate(`document.querySelectorAll('.inner-word-mask').length===0 && !!document.querySelector('h1').textContent`));
  await send('Emulation.setEmulatedMedia',{features:[]});
  await send('Page.navigate',{url:base+'/about'});await delay(1800);await evaluate(`document.querySelector('#header .logo').click()`);
  for(let i=0;i<70;i++){await delay(200);if(await evaluate(`!!document.querySelector('.cine-hero')&&getComputedStyle(document.querySelector('#loader')).display==='none'`))break;}
  assert(await evaluate(`!!document.querySelector('.cine-hero') && !document.querySelector('.inner-experience') && getComputedStyle(document.querySelector('.cine-hero-word')).position==='absolute'`),'Home navigation regression');
  fs.writeFileSync(directory+(process.argv.includes('--smoke')?'/smoke-checks.json':'/checks.json'),JSON.stringify({results,errors},null,2));assert.deepEqual(errors,[],'Browser exceptions or failed requests');console.log('PASS all inner-page checks, reduced motion and return to homepage');
} finally { if(socket?.readyState===WebSocket.OPEN){try{await send('Browser.close');}catch{}socket.close();}browser.kill();}
