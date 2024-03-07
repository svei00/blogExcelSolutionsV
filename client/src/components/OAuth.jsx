import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

export default function OAuth() {
  return (
    <Button
      type="button"
      className="px-2 py-1 bg-gradient-to-r from-greenEx to-blueEx font-semi-bold font-serif rounded-lg text-white"
      outline
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google 3:17
    </Button>
  );
}
