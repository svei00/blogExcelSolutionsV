import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import { categoryLabel } from "../config/categories";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaFacebook,
} from "react-icons/fa6";

export default function FooterComponent() {
  // The "lost reader's" fallback (REBUILD_PLAN 6.7): a footer with real
  // navigation, not just social links, so someone who scrolls to the
  // bottom of any page has a way out other than the browser back button.
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/post/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Footer container className="border border-t-8 border-primary">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="flex items-end justify-center ">
                <img src={logo} alt="Logo Excel Solutions" className="h-10" />
                <span className="text-secondaryText dark:text-secondary"> Blog</span>
              </span>
              {/* <span className="px-2 py-1 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
            <div>
              <Footer.Title title="Explore" />
              <Footer.LinkGroup col>
                <Footer.Link as={Link} to="/">
                  Home
                </Footer.Link>
                <Footer.Link as={Link} to="/search">
                  All Posts
                </Footer.Link>
                <Footer.Link as={Link} to="/contact">
                  Services / Contact
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {categories.length > 0 && (
              <div>
                <Footer.Title title="Categories" />
                <Footer.LinkGroup col>
                  {categories.map((category) => (
                    <Footer.Link
                      key={category}
                      as={Link}
                      to={`/search?category=${category}`}
                    >
                      {categoryLabel(category)}
                    </Footer.Link>
                  ))}
                </Footer.LinkGroup>
              </div>
            )}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://portfolio.excelsolutionsv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Footer.Link>
                <Footer.Link as={Link} to="/about">
                  About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup className="text-xl">
                {/* was <Footer.LinkGroup row className="text-xl"> */}
                <Footer.Link
                  href="https://www.github.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub className="hover:text-github" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="hover:text-linkedin" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.youtube.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube className="hover:text-red-600" />
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="mailto:excelsolucionesv@gmail.com"
            year={new Date().getFullYear()}
            by=<span className="px-2 py-1 bg-gradient-to-r from-secondaryText to-primaryText font-semi-bold font-serif rounded-lg text-white hover:from-primaryText hover:to-secondaryText transition-colors duration-300 ease-in-out">
              Ivan E. Villanueva
            </span>
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <a
              href="https://www.instagram.com/excelsolutionsv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-instagram transition-colors duration-300 ease-in-out"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61551997675646"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-facebook transition-colors duration-300 ease-in-out"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@excel.solutionsv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-gray-500 hover:text-tiktok transition-colors duration-300 ease-in-out"
            >
              <FaTiktok />
            </a>
            <a
              href="https://x.com/svei00"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-gray-500 hover:text-xTwitter transition-colors duration-300 ease-in-out"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
}
