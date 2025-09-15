import { Link, useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";

const NavLinkEx = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClassName = isActive
    ? "text-primary hover:text-secondary"
    : "text-gray-400 hover:text-secondary";

  return (
    <Link to={to} className={`font-bold ${activeClassName}`}>
      {children}
    </Link>
  );
};

export default NavLinkEx;
