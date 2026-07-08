import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// One job: fire a GA4 page_view on every SPA route change. The gtag
// snippet in index.html only sees the initial load, since react-router
// navigation never triggers a real page request.
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}
