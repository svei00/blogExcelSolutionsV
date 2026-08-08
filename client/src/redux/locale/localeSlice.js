import { createSlice } from "@reduxjs/toolkit";

// REBUILD_PLAN Phase 12.A.1 — bilingual ES/EN locale state.
// Follows the theme slice's precedent (redux + redux-persist) rather than
// a parallel React Context: one state pattern for the two "user picked a
// site-wide preference" concerns, not two.

export const SUPPORTED_LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

// Resolution order, highest priority first:
//   1. URL prefix   — an /en/* path means "en". The URL is authoritative
//                     from Phase 12.B on; seeded here too so a hard
//                     refresh on /en/* starts correct before any effect
//                     runs.
//   2. Persisted choice — redux-persist rehydrates this slice on top of
//                     initialState after load, so a returning visitor's
//                     explicit pick wins over detection with no code here.
//   3. navigator.language — first visit only; primary subtag ("en-US" -> "en").
//   4. DEFAULT_LOCALE ("es").
//
// ⚠️ Detection only chooses the DEFAULT for a first-time visitor. There is
// deliberately NO automatic redirect: Googlebot generally crawls with
// `Accept-Language: en` from US IPs, so a blanket navigator.language
// redirect would push the crawler to the English pages every time and
// leave the Spanish pages — which carry all the current impressions —
// effectively unindexable. Both URLs stay directly reachable and
// self-canonical. See REBUILD_PLAN Phase 12's "auto-redirect trap" note.

const localeFromPath = (pathname) => {
  const seg = String(pathname || "").split("/")[1];
  // Only a non-default supported locale counts as a prefix; ES lives at
  // the root, so there is no "/es/" prefix to detect.
  return SUPPORTED_LOCALES.includes(seg) && seg !== DEFAULT_LOCALE ? seg : null;
};

const localeFromNavigator = () => {
  if (typeof navigator === "undefined") return null;
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of tags) {
    const primary = String(tag || "")
      .toLowerCase()
      .split("-")[0];
    if (SUPPORTED_LOCALES.includes(primary)) return primary;
  }
  return null;
};

export const detectInitialLocale = () => {
  if (typeof window !== "undefined") {
    const fromPath = localeFromPath(window.location.pathname);
    if (fromPath) return fromPath;
  }
  return localeFromNavigator() || DEFAULT_LOCALE;
};

const initialState = {
  locale: detectInitialLocale(),
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action) => {
      if (SUPPORTED_LOCALES.includes(action.payload)) {
        state.locale = action.payload;
      }
    },
    toggleLocale: (state) => {
      state.locale = state.locale === "es" ? "en" : "es";
    },
  },
});

export const { setLocale, toggleLocale } = localeSlice.actions;

export default localeSlice.reducer;
