// 🎛️ THE CONTROL SHEET — every brand color the site uses, defined once.
// Change a value here to re-theme the whole site through Tailwind classes
// (bg-primary, text-secondary, etc.) generated from these tokens.
//
// Contrast notes (WCAG AA = 4.5:1 for normal text, 3:1 for large text/
// non-text UI). `primary`/`secondary` (the original brand colors) pass
// AA on dark backgrounds (4.55:1 / 6.86:1 against gray-900) but FAIL on
// white (3.90:1 / 2.59:1) — no single hex clears 4.5:1 against both a
// white and a near-black background, so this needs two tokens, not one.
// `primaryText`/`secondaryText` (below) are darkened for light-mode
// body text and normal-weight links; pair them with the ORIGINAL
// `primary`/`secondary` in dark mode (e.g. `text-primaryText
// dark:text-primary`), never use them standalone in dark mode (they
// drop to ~2.8:1 / ~3.5:1 there). `primary`/`secondary` stay as-is for
// large headings, buttons, and backgrounds, where 3:1 is enough and
// the brighter brand color is wanted.
const theme = {
  colors: {
    // Primary brand blue — large text/buttons/backgrounds (3:1 on white: 3.90:1 pass; on dark bg: 4.55:1 pass).
    primary: "#3182DF",
    primaryVivid: "#3182DF", // kept as an alias — see note below
    // AA-safe for normal-size text/links on a WHITE/light background only (4.95:1). Do not use in dark mode.
    primaryText: "#1D6FD1",

    // Secondary brand green — buttons/backgrounds (on dark bg: 6.86:1 pass). Even at large sizes this FAILS 3:1 on white (2.59:1) as plain text — use secondaryText for any white-background text use, large or small.
    secondary: "#21B868",
    secondaryVivid: "#21B868", // kept as an alias — see note below
    // AA-safe for normal-size text/links on a WHITE/light background only (5.17:1). Do not use in dark mode.
    secondaryText: "#177D47",

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
