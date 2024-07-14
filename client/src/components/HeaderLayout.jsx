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
      <div
        ref={headerRef}
        className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <Header />
      </div>
      <div className="flex-grow" style={{ marginTop: `${headerHeight}px` }}>
        {children}
      </div>
    </div>
  );
};

export default HeaderLayout;
