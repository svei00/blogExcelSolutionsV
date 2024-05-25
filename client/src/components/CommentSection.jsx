import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea } from "flowbite-react";
import ButtonOutline from "../components/Buttons";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

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
        <form className="border border-blueEx rounded-md p-3">
          <Textarea
            placeholder="Write a comment..."
            rows="3"
            maxLength="1000"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">1,000 characters left</p>
            <ButtonOutline title="Submit" type="submit" />
          </div>
        </form>
      )}
    </div>
  );
}
