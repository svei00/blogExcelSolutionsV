import { Link, useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";

const NavLinkEx = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClassName = isActive
    ? "text-primaryText dark:text-primary hover:text-secondaryText dark:hover:text-secondary"
    : "text-gray-400 hover:text-secondaryText dark:hover:text-secondary";

  return (
    <Link to={to} className={`font-bold ${activeClassName}`}>
      {children}
    </Link>
  );
};

export default NavLinkEx;
