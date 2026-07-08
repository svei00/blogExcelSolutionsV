// 🎛️ THE CONTROL SHEET — every brand color the site uses, defined once.
// Change a value here to re-theme the whole site through Tailwind classes
// (bg-primary, text-secondary, etc.) generated from these tokens.
//
// `blueEx` / `greenEx` below are kept as aliases of primary/secondary so
// existing Tailwind classes (bg-blueEx, from-greenEx, ...) keep working
// during the gradual migration. Delete the aliases once every usage has
// been switched to the semantic names (tracked in Phase 4, task 4.8).
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
};

export default theme;

// Transition aliases — remove in Phase 4 (task 4.8) once every
// `blueEx`/`greenEx` Tailwind class has been migrated to `primary`/`secondary`.
export const legacyAliases = {
  blueEx: theme.colors.primary,
  greenEx: theme.colors.secondary,
};
