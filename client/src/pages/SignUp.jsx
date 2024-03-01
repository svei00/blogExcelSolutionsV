import { Link } from "react-router-dom";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
        {/* Left */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-sm sm:text-4xl font-bold dark:text-white"
          >
            <span className="flex items-end">
              <img src={logo} alt="Logo Excel Solutions" className="h-20" />
              <span className="text-greenEx"> Blog</span>
            </span>
            {/* <span className="px-2 py-1 bg-gradient-to-r from-blueEx to-greenEx rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
          </Link>
          <p className="text-sm mt-5 text-justify">
            Discover the ultimate Excel resource! Sign up now to access
            exclusive tips, tutorials, and updates. Whether you're a beginner or
            an expert, elevate your skills with our curated content. Join our
            community with your Email or Google Account.
          </p>
        </div>
        {/* rigth */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="What's your name: " />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div className="">
              <Label value="Type your Email: " />
              <TextInput
                type="text"
                placeholder="someone@somecompany.com"
                id="email"
              />
            </div>
            <div className="">
              <Label value="What's your name: " />
              <TextInput type="text" placeholder="Password" id="password" />
            </div>
            <Button
              className="bg-gradient-to-r from-blueEx to-greenEx"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Do you have an account?</span>
            <Link to="/sign-in" className="text-bold text-greenEx font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
