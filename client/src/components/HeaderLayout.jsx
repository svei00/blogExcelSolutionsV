import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const HeaderLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={headerRef} className="fixed top-0 w-full z-50">
        <Header />
      </div>
      <div style={{ marginTop: headerHeight }}>{children}</div>
    </div>
  );
};

export default HeaderLayout;
