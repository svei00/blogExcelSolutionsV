import { Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

// Services-first CTA (REBUILD_PLAN 6.3) - replaced the generic
// "Portfolio" link. Fires a GA4 event on click (task 6.8) so
// click-through can actually be measured, tagged with WHERE on the
// site the click happened (post page vs. home vs. projects) so
// placement effectiveness is comparable later.
export default function CallToAction() {
  const location = useLocation();

  const handleClick = () => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "cta_click", {
      cta_location: location.pathname,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row p-3 border border-secondary justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Need help with your Excel workflow?</h2>
        <p className="text-gray-500 my-2">
          Formula troubleshooting, automation, custom dashboards, or general
          consulting - let's talk about what you need.
        </p>
        <Link to="/contact" onClick={handleClick}>
          <Button className="bg-gradient-to-r from-primary to-secondary rounded-tl-xl rounded-bl-none">
            Get in Touch
          </Button>
        </Link>
      </div>
      <div className="p-7 flex-1">
        <img
          src="/microsoft-excel-logo.png"
          alt="Microsoft Excel logo"
          width={900}
          height={330}
          loading="lazy"
        />
      </div>
    </div>
  );
}
