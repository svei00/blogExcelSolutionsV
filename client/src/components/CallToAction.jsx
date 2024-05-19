import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div>
      <div className="">
        <h2>Want to learn more about Excel?</h2>
        <p>Checkout these resources with 100% practical exercises</p>
        <Button className="bg-gradient-to-r from-blueEx to-greenEx">
          Learn More
        </Button>
      </div>
      <div className="p-7">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Microsoft-excel.png"
          alt="Some Logo"
        />
      </div>
    </div>
  );
}
