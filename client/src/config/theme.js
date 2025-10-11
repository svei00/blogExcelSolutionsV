// 🎛️ THE CONTROL SHEET — every brand color the site uses, defined once.
// Change a value here to re-theme the whole site through Tailwind classes
// (bg-primary, text-secondary, etc.) generated from these tokens.
//
// Contrast notes (WCAG AA = 4.5:1 for normal text, 3:1 for large text):
// the *-vivid values below are the original brand colors and currently
// FAIL AA for normal-size text/links on white (~2.5:1 / ~3.9:1). Darker,
// AA-safe *text* variants are introduced in Phase 7 (task 7.1) — this
// file has TODO markers where those will land.

const theme = {
  colors: {
    // Primary brand blue. TODO(phase-7): add `primaryText` darkened to >=4.5:1.
    primary: "#3182DF",
    primaryVivid: "#3182DF", // large headings/buttons only (3:1 is enough there)

    // Secondary brand green. TODO(phase-7): add `secondaryText` darkened to >=4.5:1.
    secondary: "#21B868",
    secondaryVivid: "#21B868",

    // Social brand colors — third-party constants, not part of the
    // rebrand surface, so no semantic renaming needed.
    github: "#6cc644",
    linkedin: "#0a66c2",
    xTwitter: "#1DA1F2",
    instagram: "#E4405F",
    facebook: "#1877F2",
    tiktok: "#ff0050",
    dribbble: "#ea4c89",
  },

  // Elevation scale (REBUILD_PLAN 6.11) — "floating" treatment for
  // post-content images so screenshots read as objects above the page,
  // not flush scans. Wired into tailwind.config.js's boxShadow, so
  // classes like `shadow-elevation-md` are generated from these values
  // — change a number here, every image using that level restyles.
  // A box-shadow is nearly invisible against a dark background, so
  // every level using it MUST be paired with a dark-mode ring/border
  // companion at the point of use (search this repo for "dark:ring-1
  // dark:ring-white/10") rather than relying on the shadow alone.
  elevation: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.08)", // barely-there lift, small UI chrome
    md: "0 4px 10px -2px rgba(0, 0, 0, 0.18)", // post-content images (6.11)
    lg: "0 10px 25px -5px rgba(0, 0, 0, 0.25)", // modals/popovers, reserved for future use
  },
};

export default theme;
