export type ScreenRect = { l: number; t: number; r: number; b: number; a: number };

const SELECTOR = "[data-model-fade]";
let rects: ScreenRect[] = [];
let stamp = -1;

function shown(el: HTMLElement) {
  let n: HTMLElement | null = el;
  while (n) {
    const cs = getComputedStyle(n);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.08) return false;
    n = n.parentElement;
  }
  return true;
}

/** Glyph boxes for headings the 3D model can pass in front of. Refreshed a few times a second. */
export function headingRects() {
  const now = performance.now();
  if (now - stamp < 80) return rects;
  stamp = now;
  const next: ScreenRect[] = [];
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    if (!shown(el)) return;
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    let found = false;
    while ((node = walker.nextNode())) {
      if (!node.textContent?.trim()) continue;
      range.selectNodeContents(node);
      for (const box of range.getClientRects()) {
        if (box.width < 1 || box.height < 1) continue;
        if (box.bottom < -40 || box.top > window.innerHeight + 40) continue;
        next.push({ l: box.left, t: box.top, r: box.right, b: box.bottom, a: box.width * box.height });
        found = true;
      }
    }
    if (found) return;
    const box = el.getBoundingClientRect();
    if (box.width < 1 || box.height < 1 || box.bottom < 0 || box.top > window.innerHeight) return;
    next.push({ l: box.left, t: box.top, r: box.right, b: box.bottom, a: box.width * box.height });
  });
  rects = next;
  return rects;
}

/** 0 = clear of every heading, 1 = sitting over a heading. */
export function modelCover(cx: number, cy: number, hw: number, hh: number) {
  const modelA = Math.max(hw * hh * 4, 1);
  let cover = 0;
  for (const box of headingRects()) {
    const nx = Math.max(box.l, cx - hw);
    const ny = Math.max(box.t, cy - hh);
    const fx = Math.min(box.r, cx + hw);
    const fy = Math.min(box.b, cy + hh);
    if (fx <= nx || fy <= ny) continue;
    const inter = (fx - nx) * (fy - ny);
    cover = Math.max(cover, Math.min(1, inter / modelA * 2.6), Math.min(1, inter / Math.max(box.a, 1)));
  }
  return cover;
}
