import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const HeaderLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    // Add resize listener to update header height if window size changes
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background-free and pointer-events-none (REBUILD_PLAN 6.9): once
          the Navbar inside Header.jsx goes translucent on scroll, a solid
          bg here would paint a full-width opaque bar behind it, hiding
          the page content the pill is supposed to float over. Being
          pointer-events-none stops this full-width fixed box from
          swallowing clicks on content visible beside the (narrower)
          pill - Header.jsx re-enables pointer-events on the Navbar
          itself, not on a full-width inner div, which would re-block
          them. */}
      <div
        ref={headerRef}
        className="fixed top-0 w-full z-50 pointer-events-none"
      >
        <Header />
      </div>
      {/* tabIndex={-1} makes this a valid focus target (not a tab stop)
          so the skip link (App.jsx, REBUILD_PLAN 7.3) actually moves
          keyboard focus here, not just the scroll position - confirmed
          missing in the 7.5 audit: document.activeElement fell back to
          <body> after activating the skip link without this. */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow focus:outline-none"
        style={{ marginTop: `${headerHeight}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default HeaderLayout;
