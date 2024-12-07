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
            by=<span className="px-2 py-1 bg-gradient-to-r from-greenEx to-blueEx font-semi-bold font-serif rounded-lg text-white hover:from-blueEx hover:to-greenEx transition-colors duration-300 ease-in-out">
              Ivan E. Villanueva
            </span>
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <a
              href="https://www.instagram.com/excelsolutionsv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-instagram transition-colors duration-300 ease-in-out"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61551997675646"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-600 transition-colors duration-300 ease-in-out"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@excel.solutionsv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-tiktok transition-colors duration-300 ease-in-out"
            >
              <FaTiktok />
            </a>
            <a
              href="https://x.com/svei00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-xTwitter transition-colors duration-300 ease-in-out"
            >
              <FaXTwitter />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-dribbble transition-colors duration-300 ease-in-out"
            >
              <FaDribbble />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
}
