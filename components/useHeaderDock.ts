"use client";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { flushSync } from "react-dom";

/** Change the header's layout only while invisible, including interrupted reversals. */
export function useHeaderDock(header: RefObject<HTMLElement | null>, requested: boolean, ready: boolean) {
  const [docked, setDocked] = useState(false);
  const actual = useRef(false);
  const generation = useRef(0);
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const node = header.current;
    if (!node) return;
    const token = ++generation.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!ready || media.matches) {
      animation.current?.cancel();
      actual.current = requested; setDocked(requested);
      node.style.removeProperty("opacity"); node.style.removeProperty("translate");
      delete node.dataset.dockTransition;
      return;
    }
    if (!node.hasAttribute("data-dock-managed") && actual.current === requested) return;
    // Capture the visible frame before disabling any existing CSS entrance animation.
    const style = getComputedStyle(node);
    const from = { opacity: style.opacity, translate: style.translate === "none" ? "0 0" : style.translate };
    node.style.opacity = from.opacity; node.style.translate = from.translate;
    node.dataset.dockManaged = "true";
    node.dataset.dockTransition = "true";
    animation.current?.cancel();

    const enter = (origin: { opacity: string; translate: string }) => {
      if (token !== generation.current) return;
      const previous = animation.current;
      const next = node.animate([origin, { opacity: "1", translate: "0 0" }], {
        duration: 380, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both",
      });
      animation.current = next;
      previous?.cancel();
      next.finished.then(() => {
        if (token !== generation.current) return;
        node.style.removeProperty("opacity"); node.style.removeProperty("translate");
        delete node.dataset.dockTransition;
        next.cancel(); animation.current = null;
      }).catch(() => {});
    };
    if (actual.current === requested) {
      enter(from);
    } else {
      const distance = actual.current ? Math.ceil(window.innerHeight - node.getBoundingClientRect().top + 32) : -220;
      const offscreen = `0 ${distance}px`;
      const exit = node.animate([from,
        { opacity: from.opacity, translate: offscreen, offset: .85 },
        { opacity: "0", translate: offscreen },
      ], {
        duration: 420, easing: "cubic-bezier(.4,0,.2,1)", fill: "both",
      });
      animation.current = exit;
      exit.finished.then(() => {
        if (token !== generation.current) return;
        // Keep the exit animation's invisible frame through the React layout change.
        node.style.opacity = "0"; node.style.translate = offscreen;
        actual.current = requested;
        flushSync(() => setDocked(requested));
        enter({ opacity: "0", translate: requested ? "0 14px" : "0 -220px" });
      }).catch(() => {});
    }
    return () => {
      ++generation.current;
      const current = getComputedStyle(node);
      node.style.opacity = current.opacity; node.style.translate = current.translate;
      animation.current?.cancel(); animation.current = null;
    };
  }, [header, requested, ready]);
  return docked;
}
