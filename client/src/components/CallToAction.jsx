import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-greenEx justify-center items-center rounded-tl-3xl text-center">
      <div className="flex-1">
        <h2>Want to learn more about Excel?</h2>
        <p>Checkout these resources with 100% practical exercises</p>
        <Button className="bg-gradient-to-r from-blueEx to-greenEx rounded-tl-xl rounded-bl-none">
          <a
            href="portfolio.excelsolutionsv.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Microsoft-excel.png"
          alt="Some Logo"
        />
      </div>
    </div>
  );
}
