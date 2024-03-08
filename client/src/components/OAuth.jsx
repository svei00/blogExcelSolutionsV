import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";

export default function OAuth() {
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle); // For testing purposes
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      className="px-2 py-1 border-2 border-blueEx font-semibold rounded-lg text-black hover:bg-gradient-to-r hover:from-greenEx hover:to-blueEx hover:text-white"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
