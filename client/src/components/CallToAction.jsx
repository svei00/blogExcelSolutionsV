import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ButtonEx from "./Buttons";
import trackCtaClick from "../utils/trackCtaClick";
import useLocale from "../hooks/useLocale";

// REBUILD_PLAN 12.A.5 - content as { es, en } pairs read through
// useLocale().t(), same pattern as About/Projects.
const ui = {
  heading: {
    es: "¿Necesitas ayuda con tu flujo de trabajo en Excel?",
    en: "Need help with your Excel workflow?",
  },
  body: {
    es: "Depuración de fórmulas, automatización, tableros a medida o consultoría general: cuéntame en qué estás atorado y te respondo en un plazo de dos días hábiles.",
    en: "Formula troubleshooting, automation, custom dashboards, or general consulting — tell me what you're stuck on and I'll reply within two business days.",
  },
  button: { es: "Solicitar ayuda con Excel", en: "Get Excel help" },
};

// Brand tokens, not re-imported from theme.js on purpose - that file
// exports Tailwind-config-shaped values (theme.js is consumed by
// tailwind.config.js at BUILD time, not meant to be imported at
// runtime by app code - REBUILD_PLAN 1.8's control-sheet is a config
// input, not a JS module contract). Two hex strings, kept in sync by
// hand like api/config/site.js's precedent (notes.md 27.1) - the same
// two values Tailwind generates border-secondary/border-primary from.
const BRAND_GREEN = "#21B868";
const BRAND_BLUE = "#3182DF";

// How often the blue sweep replays while the card sits in the viewport.
// The sweep itself runs ~2.7s (1.4 draw + 0.5 hold + 0.8 fade), so this
// leaves a few seconds of calm green between pulses.
const PULSE_INTERVAL_MS = 7000;

// Services-first CTA (REBUILD_PLAN 6.3) - replaced the generic
// "Portfolio" link. Fires a GA4 event on click (task 6.8), tagged with
// cta_id so placements sharing the same page path (e.g. the Home hero
// button vs. this band) are still distinguishable in the data.
//
// Animated border (REBUILD_PLAN Phase 8; trigger revised 2026-09): two
// stacked SVG <rect>s over the card - a static green base (the resting
// state) and a blue overlay whose stroke-dashoffset animates from
// fully-hidden to fully-drawn, tracing the rounded rect's own perimeter.
// That's naturally top edge left->right, right edge top->bottom, bottom
// edge right->left, left edge bottom->top, in exactly that order, for
// free - no manual per-edge choreography, that IS the direction a
// browser draws a rect's stroke path. Border also thickens during the
// sweep, and the blue rect gets a neon glow, then fades back to green.
//
// Trigger: the original one-shot-on-scroll-into-view meant a reader who
// landed on a CTA at the end of a long post - after the trigger had
// already fired - saw nothing when they finally got there. Now it's an
// ATTENTION PULSE: the sweep replays every PULSE_INTERVAL_MS for as long
// as the card is in the viewport (IntersectionObserver), and also fires
// immediately on mouseenter. Fully idle while off-screen (interval
// cleared). prefers-reduced-motion still disables it entirely - static
// green base only - which also covers battery-saver / low-end devices
// that set that hint.
export default function CallToAction({ ctaId = "band" }) {
  const { t } = useLocale();
  const containerRef = useRef(null);
  const sweepRef = useRef(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  // Measure the card so the SVG can use real pixel dimensions - simpler
  // and more robust than fighting percentage viewBox scaling for a
  // crisp, correctly-inset stroke.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Bail out of the state update when the rounded dimensions haven't
    // actually changed. ResizeObserver fires once on observe() and again
    // on any sub-pixel layout shift, and a fresh {width,height} object
    // each time would re-run the animation effect below (its dep is
    // `box`) and restart the sweep before it can finish - so it must
    // return the SAME reference when nothing meaningful moved.
    const apply = (width, height) =>
      setBox((prev) =>
        Math.round(prev.width) === Math.round(width) &&
        Math.round(prev.height) === Math.round(height)
          ? prev
          : { width, height }
      );
    // Synchronous initial read (getBoundingClientRect), not just the
    // ResizeObserver callback - the observer still handles later
    // resizes, but the very first measurement doesn't wait on it.
    const r = el.getBoundingClientRect();
    if (r.width > 0) apply(r.width, r.height);
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      apply(width, height);
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
      // (static green base) is what's shown. No observer, no interval.
      gsap.set(sweep, { opacity: 0 });
      return;
    }

    // One paused timeline, replayed on demand. The leading .set() re-runs
    // on every restart(), so each pulse starts from the same clean state
    // (fully hidden, thin, no glow) regardless of where the last one
    // ended.
    const tl = gsap.timeline({ paused: true });
    tl.set(sweep, {
      strokeDasharray: length,
      strokeDashoffset: length, // fully hidden - nothing drawn yet
      strokeWidth: 1.5,
      opacity: 1,
      filter: "drop-shadow(0 0 0px transparent)",
    })
      .to(sweep, {
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

    // play(0), not restart(): unambiguously "play forward from time 0" on
    // a timeline created paused. Skip it when a sweep is already running
    // so a second trigger doesn't yank it back to the start mid-draw.
    const playSweep = () => {
      if (!tl.isActive()) tl.play(0);
    };

    let intervalId = null;
    let leaveTimer = null;
    const startPulsing = () => {
      if (leaveTimer !== null) {
        window.clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      if (intervalId !== null) return;
      playSweep(); // one right away when the card is reached
      intervalId = window.setInterval(playSweep, PULSE_INTERVAL_MS);
    };
    const stopPulsing = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Pulse while the card is on screen; go fully idle when it isn't.
    // The leave is debounced so a threshold wobble (or the sweep's own
    // stroke-width change nudging layout) can't thrash start/stop.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPulsing();
        } else if (leaveTimer === null) {
          leaveTimer = window.setTimeout(() => {
            leaveTimer = null;
            stopPulsing();
          }, 800);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(container);

    // Hover fires an extra sweep on top of the ambient pulse.
    const handleEnter = () => playSweep();
    container.addEventListener("mouseenter", handleEnter);

    return () => {
      if (leaveTimer !== null) window.clearTimeout(leaveTimer);
      stopPulsing();
      io.disconnect();
      container.removeEventListener("mouseenter", handleEnter);
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
      <h2 className="text-2xl">{t(ui.heading)}</h2>
      <p className="text-gray-600 dark:text-gray-300 my-2 max-w-md text-justify">
        {t(ui.body)}
      </p>
      <ButtonEx title={t(ui.button)} to="/contact" onClick={() => trackCtaClick(ctaId)} />
    </div>
  );
}

CallToAction.propTypes = {
  ctaId: PropTypes.string,
};
