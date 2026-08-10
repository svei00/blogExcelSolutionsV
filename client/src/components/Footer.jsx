import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import { categoryLabel } from "../config/categories";
import useCategories from "../hooks/useCategories";
import useLocale from "../hooks/useLocale";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaFacebook,
} from "react-icons/fa6";

// Flowbite's Footer.Link/Footer.Copyright hard-code "hover:underline" in
// their default theme, and a plain className prop on either component only
// reaches the OUTER wrapper, not the inner <a> that carries that class
// (see FooterLink.js/FooterCopyright.js) - the only way to change it is
// this `theme` prop, which deep-merges onto the built-in theme and fully
// replaces string leaves like `href`. Swaps the underline for bold +
// brand-color text, matching the hover treatment used elsewhere on the
// site (e.g. the Search "Show More" link).
const footerLinkHover = {
  href: "hover:no-underline hover:font-bold hover:text-primaryText dark:hover:text-primary",
};
// Icon-only links keep their own per-brand hover color (set on the icon
// itself below) - this just drops the underline the <a> would otherwise
// still render under the icon.
const footerIconLinkHover = { href: "hover:no-underline" };

// REBUILD_PLAN 12.A.5 - chrome strings as { es, en } pairs. Category
// labels (categoryLabel()) are post-content, not chrome - out of scope
// here, deferred to Phase 12.C along with post-level i18n.
const ui = {
  explore: { es: "Explorar", en: "Explore" },
  home: { es: "Inicio", en: "Home" },
  allPosts: { es: "Todas las publicaciones", en: "All Posts" },
  servicesContact: { es: "Servicios / Contacto", en: "Services / Contact" },
  categories: { es: "Categorías", en: "Categories" },
  about: { es: "Acerca de", en: "About" },
  portfolio: { es: "Portafolio", en: "Portfolio" },
  followUs: { es: "Síguenos", en: "Follow Us" },
  legal: { es: "Legal", en: "Legal" },
  privacyPolicy: { es: "Aviso de Privacidad", en: "Privacy Policy" },
  terms: { es: "Términos y Condiciones", en: "Terms & Conditions" },
};

export default function FooterComponent() {
  // The "lost reader's" fallback (REBUILD_PLAN 6.7): a footer with real
  // navigation, not just social links, so someone who scrolls to the
  // bottom of any page has a way out other than the browser back button.
  // Shared cache (useCategories) - Search.jsx fetches the same list on
  // /search, and this footer renders there too (REBUILD_PLAN 11.A.6).
  const categories = useCategories();
  const { t } = useLocale();

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
              <Footer.Title title={t(ui.explore)} />
              <Footer.LinkGroup col>
                <Footer.Link as={Link} to="/" theme={footerLinkHover}>
                  {t(ui.home)}
                </Footer.Link>
                <Footer.Link as={Link} to="/search" theme={footerLinkHover}>
                  {t(ui.allPosts)}
                </Footer.Link>
                <Footer.Link as={Link} to="/contact" theme={footerLinkHover}>
                  {t(ui.servicesContact)}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {categories.length > 0 && (
              <div>
                <Footer.Title title={t(ui.categories)} />
                <Footer.LinkGroup col>
                  {categories.map((category) => (
                    <Footer.Link
                      key={category}
                      as={Link}
                      to={`/search?category=${category}`}
                      theme={footerLinkHover}
                    >
                      {categoryLabel(category)}
                    </Footer.Link>
                  ))}
                </Footer.LinkGroup>
              </div>
            )}
            <div>
              <Footer.Title title={t(ui.about)} />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://portfolio.excelsolutionsv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  theme={footerLinkHover}
                >
                  {t(ui.portfolio)}
                </Footer.Link>
                <Footer.Link as={Link} to="/about" theme={footerLinkHover}>
                  {t(ui.about)}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={t(ui.followUs)} />
              <Footer.LinkGroup className="text-xl">
                {/* was <Footer.LinkGroup row className="text-xl"> */}
                <Footer.Link
                  href="https://www.github.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  theme={footerIconLinkHover}
                >
                  <FaGithub className="hover:text-github" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  theme={footerIconLinkHover}
                >
                  <FaLinkedin className="hover:text-linkedin" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.youtube.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  theme={footerIconLinkHover}
                >
                  <FaYoutube className="hover:text-red-600" />
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title={t(ui.legal)} />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  theme={footerLinkHover}
                >
                  {t(ui.privacyPolicy)}
                </Footer.Link>
                <Footer.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  theme={footerLinkHover}
                >
                  {t(ui.terms)}
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
            // theme.href overrides Flowbite's default "ml-1 hover:underline"
            // (see footerLinkHover above) - without it the badge below got
            // an underline drawn under it by the wrapping <a>, on top of
            // its own gradient-reverse hover.
            theme={{ href: "ml-1 hover:no-underline" }}
            by=<span className="px-2 py-1 bg-gradient-to-r from-secondaryText to-primaryText font-semibold font-serif rounded-lg text-white hover:from-primaryText hover:to-secondaryText transition-colors duration-300 ease-in-out">
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
