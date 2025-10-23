import { useState } from "react";

const STORAGE_KEY = "postViewPreference";

function readStored() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "row" || stored === "grid" ? stored : "row";
  } catch {
    return "row";
  }
}

// Reads localStorage in the useState initializer (not a useEffect) so
// the stored view renders on the first paint - an effect-based read
// would flash the "row" default before swapping to "grid" a tick later.
export default function useViewPreference() {
  const [view, setView] = useState(readStored);

  const updateView = (next) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-browsing modes can throw on write; the in-memory
      // state above still keeps the toggle usable for this session.
    }
  };

  return [view, updateView];
}
