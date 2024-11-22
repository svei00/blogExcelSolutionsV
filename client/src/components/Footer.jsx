import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaDribbble,
} from "react-icons/fa6";

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-blueEx">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="flex items-end justify-center ">
                <img src={logo} alt="Logo Excel Solutions" className="h-10" />
                <span className="text-greenEx"> Blog</span>
              </span>
              {/* <span className="px-2 py-1 bg-gradient-to-r from-blueEx to-greenEx rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 sm:gap-6">
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
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Excel SolutionsV® Blog
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
                >
                  <FaGithub className="hover:text-github" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="hover:text-linkedin" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.youtube.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
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
            href="excelsolucionesv@gmail.com"
            year={new Date().getFullYear()}
            by=<span className="px-2 py-1 bg-gradient-to-r from-greenEx to-blueEx font-semi-bold font-serif rounded-lg text-white">
              Ivan E. Villanueva
            </span>
          />
          <div className="flex gap-6 sm-mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              className="hover:text-instagram"
              href="https://www.instagram.com/excelsolutionsv"
              icon={FaInstagram}
            />
            <Footer.Icon
              className="hover:text-facebook"
              href="https://www.facebook.com/profile.php?id=61551997675646"
              icon={FaFacebook}
            />
            <Footer.Icon
              className="hover:text-tiktok"
              href="https://www.tiktok.com/@excel.solutionsv"
              icon={FaTiktok}
            />
            <Footer.Icon
              className="hover:text-xTwitter"
              href="https://x.com/svei00"
              icon={FaXTwitter}
            />
            <Footer.Icon
              className="hover:text-dribbble"
              href="#"
              icon={FaDribbble}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
