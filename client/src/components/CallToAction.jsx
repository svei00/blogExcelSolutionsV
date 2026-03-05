import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonEx from "./Buttons";
import trackCtaClick from "../utils/trackCtaClick";

gsap.registerPlugin(ScrollTrigger);

// Brand tokens, not re-imported from theme.js on purpose - that file
// exports Tailwind-config-shaped values (theme.js is consumed by
// tailwind.config.js at BUILD time, not meant to be imported at
// runtime by app code - REBUILD_PLAN 1.8's control-sheet is a config
// input, not a JS module contract). Two hex strings, kept in sync by
// hand like api/config/site.js's precedent (notes.md 27.1) - the same
// two values Tailwind generates border-secondary/border-primary from.
const BRAND_GREEN = "#21B868";
const BRAND_BLUE = "#3182DF";

// Services-first CTA (REBUILD_PLAN 6.3) - replaced the generic
// "Portfolio" link. Fires a GA4 event on click (task 6.8), tagged with
// cta_id so placements sharing the same page path (e.g. the Home hero
// button vs. this band) are still distinguishable in the data.
//
// Animated border (REBUILD_PLAN Phase 8 - requested in an earlier
// session, never actually tracked or built until now): two stacked SVG
// <rect>s over the card - a static green base (the resting state) and
// a blue overlay whose stroke-dashoffset animates from fully-hidden to
// fully-drawn, tracing the rounded rect's own perimeter. That's
// naturally top edge left->right, right edge top->bottom, bottom edge
// right->left, left edge bottom->top, in exactly that order, for free -
// no manual per-edge choreography, that IS the direction a browser
// draws a rect's stroke path. Border also thickens during the sweep,
// and the blue rect gets a neon glow while visible. Fires once when the
// card scrolls into view (ScrollTrigger), then fades back to the static
// green base.
export default function CallToAction({ ctaId = "band" }) {
  const containerRef = useRef(null);
  const sweepRef = useRef(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  // Measure the card so the SVG can use real pixel dimensions - simpler
  // and more robust than fighting percentage viewBox scaling for a
  // crisp, correctly-inset stroke.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Synchronous initial read (getBoundingClientRect), not just the
    // ResizeObserver callback - the observer still handles later
    // resizes, but the very first measurement doesn't wait on it.
    const r = el.getBoundingClientRect();
    if (r.width > 0) setBox({ width: r.width, height: r.height });
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sweep = sweepRef.current;
    const container = containerRef.current;
    if (!sweep || !container || box.width === 0) return;

    // getTotalLength() gives the EXACT perimeter of the rounded rect as
    // actually rendered (straight edges + the 4 corner arcs), so the
    // dasharray/dashoffset math never has to reimplement rounded-rect
    // geometry by hand - the browser already did it correctly.
    const length = sweep.getTotalLength();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // No motion, no color sweep - just confirm the resting state
      // (static green base) is what's shown. Nothing to animate.
      gsap.set(sweep, { opacity: 0 });
      return;
    }

    gsap.set(sweep, {
      strokeDasharray: length,
      strokeDashoffset: length, // fully hidden - nothing drawn yet
      strokeWidth: 1.5,
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        once: true, // a one-time flourish on first view, not a loop that fires every scroll past it
      },
    });

    tl.to(sweep, {
      strokeDashoffset: 0, // draws the full perimeter, in the browser's natural edge order
      strokeWidth: 3,
      duration: 1.4,
      ease: "power2.inOut",
    })
      // Neon glow ramps in alongside the draw, not just at the end -
      // makes the traveling edge itself read as glowing, not just the
      // final fully-blue state.
      .to(
        sweep,
        {
          filter: `drop-shadow(0 0 4px ${BRAND_BLUE}) drop-shadow(0 0 10px ${BRAND_BLUE})`,
          duration: 1.4,
          ease: "power2.inOut",
        },
        "<" // same start time as the draw tween above
      )
      .to(sweep, { duration: 0.5 }) // hold the fully-blue, glowing state briefly
      .to(sweep, {
        opacity: 0,
        filter: "drop-shadow(0 0 0px transparent)",
        duration: 0.8,
        ease: "power1.out",
      });

    return () => {
      tl.kill();
    };
  }, [box]);

  const strokeInset = 2; // half of the thickest stroke-width (3), so the sweep is never clipped by the SVG's own edge
  const rectProps = {
    x: strokeInset,
    y: strokeInset,
    width: Math.max(box.width - strokeInset * 2, 0),
    height: Math.max(box.height - strokeInset * 2, 0),
    rx: 10,
    ry: 10,
    fill: "none",
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col p-6 justify-center items-center rounded-xl text-center gap-2"
    >
      {box.width > 0 && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          width={box.width}
          height={box.height}
          viewBox={`0 0 ${box.width} ${box.height}`}
        >
          <rect {...rectProps} stroke={BRAND_GREEN} strokeWidth={1.5} />
          <rect ref={sweepRef} {...rectProps} stroke={BRAND_BLUE} strokeWidth={1.5} opacity={0} />
        </svg>
      )}
      <h2 className="text-2xl">Need help with your Excel workflow?</h2>
      <p className="text-gray-600 dark:text-gray-300 my-2 max-w-md">
        Formula troubleshooting, automation, custom dashboards, or general
        consulting - tell me what you're stuck on and I'll reply within two
        business days.
      </p>
      <ButtonEx title="Get Excel Help" to="/contact" onClick={() => trackCtaClick(ctaId)} />
    </div>
  );
}

CallToAction.propTypes = {
  ctaId: PropTypes.string,
};
