"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { INTRO_DONE_EVENT } from "./IntroCurtain";

const SELECTOR = "[data-reveal]:not(.is-in)";

/** Scroll entrances for anything marked `data-reveal` ("", "line", "media").
 *
 *  One observer for the whole site instead of one per component. It arms the
 *  CSS by putting `reveal-armed` on <html> only once it is running, so if this
 *  never runs nothing stays hidden. It waits for the opening animation, or the
 *  first section would play its entrance behind the curtain. Each element is
 *  revealed once and then left alone. */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const start = () => {
      io = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            io?.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      const watch = (scope: ParentNode) => scope.querySelectorAll(SELECTOR).forEach(el => io?.observe(el));
      watch(document);
      root.classList.add("reveal-armed");

      // Sections that render later (listings, the team after a language
      // switch, client-side navigation) get picked up as they appear.
      mo = new MutationObserver(records => {
        for (const r of records) {
          r.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches(SELECTOR)) io?.observe(node);
            watch(node);
          });
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    };

    if (window.__ecrIntroDone) start();
    else window.addEventListener(INTRO_DONE_EVENT, start, { once: true });

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, start);
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  return null;
}
