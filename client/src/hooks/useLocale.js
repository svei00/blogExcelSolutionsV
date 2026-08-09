import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLocale as setLocaleAction,
  DEFAULT_LOCALE,
} from "../redux/locale/localeSlice";

// REBUILD_PLAN Phase 12.A.2 - the single read/write point for the ES/EN
// locale. `locale` comes from the redux slice (12.A.1). `t` is a
// deliberately tiny translator: pass it a { es, en } dictionary and it
// returns the string for the active locale, falling back to the default
// locale so a half-finished translation renders *something* rather than
// "undefined". Page and component copy stays co-located with the
// component that uses it (12.A.4), not in a central resource bundle -
// two static pages don't earn that layer yet.
export default function useLocale() {
  const locale = useSelector((state) => state.locale.locale);
  const dispatch = useDispatch();

  const setLocale = useCallback(
    (next) => dispatch(setLocaleAction(next)),
    [dispatch]
  );

  const t = useCallback(
    (dict) => {
      if (!dict || typeof dict !== "object") return dict ?? "";
      return dict[locale] ?? dict[DEFAULT_LOCALE] ?? "";
    },
    [locale]
  );

  return { locale, setLocale, t };
}
