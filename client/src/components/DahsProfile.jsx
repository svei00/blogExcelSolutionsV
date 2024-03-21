import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";

export default function DahsProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="User Image"
            className="rounded-full w-full h-full object-cover"
            style={{ border: "8px solid lightgray" }}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Would you like to change your Password?"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-blueEx to-greenEx"
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5 font-semibold">
        <span className="cursor-pointer hover:text-blueEx">Delete Account</span>
        <span className="cursor-pointer  hover:text-greenEx">Sign Out</span>
      </div>
    </div>
  );
}
