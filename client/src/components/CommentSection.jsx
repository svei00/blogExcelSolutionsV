import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TextArea } from "flowbite-react";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dasboard?tab=profile"}
            className="text-xs text-blueEx hover:text-greenEx"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-blueEx my-5 flex gap-1">
          You must be Signed In to comment.
          <Link to={"/signin"} className="text-greenEx hover:font-bold">
            {" "}
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form>
          <TextArea
            placeholder="Write a comment..."
            rows="3"
            maxLength="1000"
          />
          <div className="">
            <p>1,000 characters left</p>
          </div>
        </form>
      )}
    </div>
  );
}
