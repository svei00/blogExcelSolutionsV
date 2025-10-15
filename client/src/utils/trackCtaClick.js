// Shared GA4 cta_click firer (task 6.8) - both the hero CTA and the
// CallToAction band call this so cta_id can tell them apart even when
// cta_location (the page path) is identical for both.
export default function trackCtaClick(ctaId) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "cta_click", {
    cta_location: window.location.pathname,
    cta_id: ctaId,
  });
}
