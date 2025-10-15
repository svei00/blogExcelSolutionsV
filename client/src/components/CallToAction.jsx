import PropTypes from "prop-types";
import ButtonEx from "./Buttons";
import trackCtaClick from "../utils/trackCtaClick";

// Services-first CTA (REBUILD_PLAN 6.3) - replaced the generic
// "Portfolio" link. Fires a GA4 event on click (task 6.8), tagged with
// cta_id so placements sharing the same page path (e.g. the Home hero
// button vs. this band) are still distinguishable in the data.
export default function CallToAction({ ctaId = "band" }) {
  return (
    <div className="flex flex-col p-6 border border-secondary justify-center items-center rounded-xl text-center gap-2">
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
