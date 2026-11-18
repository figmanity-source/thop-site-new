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
const directory = "artifacts/cinematic-home";
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
  const results = [];
  for (const [width, height] of [[1440,1000],[1280,800],[768,1024],[360,800]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.navigate", { url: base });
    for (let attempt = 0; attempt < 90; attempt++) {
      await delay(400);
      if (await evaluate(`document.readyState==='complete' && !!document.querySelector('.cine-hero') && getComputedStyle(document.querySelector('#loader')).display==='none'`)) break;
      assert(attempt < 89, "Loader did not finish");
    }
    await delay(1500);
    const metrics = await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:document.querySelectorAll('[data-cinema-model]').length,canvas:!!document.querySelector('#canvas-wrapper canvas'),title:document.querySelector('h1').innerText,internalScrollbars:[...document.querySelectorAll('.cine-section,.cine-copy-panel,.cine-test-card')].filter(e=>['auto','scroll'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+1).length})`);
    assert(metrics.scrollWidth <= width + 1, "Horizontal overflow at " + width);
    assert(metrics.canvas, "3D canvas missing");
    assert.equal(metrics.internalScrollbars, 0);
    assert(metrics.sections >= 15, "Content chapters missing");
    assert(await evaluate(`getComputedStyle(document.querySelector('.cine-hero-word')).position === 'absolute'`), "Hero artwork must not displace content");
    await shot(`home-${width}`);
    if (width === 1440) {
      const pageCopy = await evaluate(`document.querySelector('.cine-main').textContent`);
      for (const text of requiredCopy) assert(pageCopy.includes(text), "Homepage content missing: " + text);
      for (const extra of ["More life. More living.", "BIOLOGY, IN PERSPECTIVE", "HUMAN / 001", "BIOLOGY. UNDERSTOOD.", "YOUR BODY, CONNECTED", "ONE CONNECTED JOURNEY", "FIVE STEPS / ONE YOU", "THE HUMAN PURPOSE", "SCIENCE WITH PURPOSE.", "LET’S BEGIN"]) assert(!pageCopy.includes(extra), "Unapproved text remains: " + extra);
      assert.equal(await evaluate(`document.querySelectorAll('.cine-header nav a').length`), 6, "Match the six live-site header links");
      assert.equal(await evaluate(`document.querySelectorAll('#questions details').length`), 5, "Match all five live-site FAQs");
      assert(await evaluate(`[...document.querySelectorAll('.cine-founder a')].some(a=>a.textContent.includes('MEET THE FOUNDER'))`), "Match founder CTA");
      assert(await evaluate(`!!document.querySelector('.footer-columns a[href="/ethics-committee"]')`), "Match live Explore links");
      console.log("PASS all " + requiredCopy.length + " required content passages preserved");
      for (const id of ["five-steps","discover","bioblueprint","twin","dox","cellution","how-cellution","continuum","biology","founder","centre","questions","contact"]) {
        await scrollTo("#" + id); await shot(id);
      }
      await evaluate(`document.querySelector('#questions summary').click()`);
      assert(await evaluate(`document.querySelector('#questions details').open`));
      await scrollTo("#twin");
      await evaluate(`document.querySelectorAll('.cine-zone-tabs button')[2].click()`); await delay(100);
      assert(await evaluate(`document.querySelectorAll('.cine-zone-tabs button')[2].getAttribute('aria-pressed')==='true'`));
      await scrollTo("#biology");
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('#cellution')).backgroundColor`), "rgb(22, 21, 20)", "Graphite scene surface");
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('#discover')).backgroundColor`), "rgb(242, 241, 238)", "Paper scene surface");
      await evaluate(`document.querySelectorAll('.cine-comparison-select')[1].click()`);
      assert(await evaluate(`document.querySelectorAll('.cine-dashboard-grid article')[1].dataset.selected==='true'`), "Sample comparison selection");
    }
    if (width === 360) {
      await evaluate(`document.querySelector('.cine-hero-footer button').click()`); await delay(100);
      assert(await evaluate(`document.querySelector('.cine-hero-footer button').getAttribute('aria-pressed')==='true'`));
      await evaluate(`document.querySelector('.cine-menu').click()`); await delay(100);
      assert(await evaluate(`document.querySelector('.cine-menu').getAttribute('aria-expanded')==='true'`));
      await shot("mobile-navigation");
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await evaluate(`document.querySelector('.cine-header .cine-button').click()`); await delay(100);
      assert(await evaluate(`!!document.querySelector('[role=dialog]') && !document.querySelector('[name=consent]').checked`));
      await shot("mobile-enquiry");
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
      await scrollTo("#cellution"); await shot("cellution-mobile");
      assert(await evaluate(`(() => {const r=document.querySelector('.cine-header').getBoundingClientRect();return r.bottom<=innerHeight && r.top>innerHeight-110})()`), "Floating navigation stays within the mobile viewport");
      await evaluate(`document.querySelector('.cine-menu').click()`); await delay(150);
      assert(await evaluate(`(() => {const r=document.querySelector('.cine-header nav').getBoundingClientRect();return r.top>=0 && r.bottom<document.querySelector('.cine-header').getBoundingClientRect().top})()`), "Mobile dock menu opens upward");
      await shot("mobile-floating-navigation");
      await evaluate(`document.querySelector('.cine-menu').click()`);
    }
    results.push(metrics); console.log("PASS viewport " + width);
  }
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.navigate", { url: base + "/#cellution" }); await delay(4500);
  assert(await evaluate(`getComputedStyle(document.querySelector('.cine-main')).display!=='none'`));
  fs.writeFileSync(`${directory}/checks.json`, JSON.stringify({ results, errors }, null, 2));
  assert.deepEqual(errors, [], "Browser exceptions or failed requests");
  console.log("PASS all cinematic homepage checks");
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await send("Browser.close"); } catch {} socket.close(); }
  browser.kill();
}
