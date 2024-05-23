import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link to={"/dasboard?tag=profile"}>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className="">
          You must be Signed in to comment.
          <Link to={"/signin"}>Sign In</Link>
        </div>
      )}
    </div>
  );
}
