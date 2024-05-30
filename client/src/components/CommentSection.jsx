import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Textarea } from "flowbite-react";
import ButtonOutline from "../components/Buttons";
import { useState } from "react";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Remember to avoid refreshing the page.
    if (comment.length > 1000) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="border border-blueEx rounded-md p-3"
        >
          <Textarea
            placeholder="Write a comment..."
            rows="3"
            maxLength="1000"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {(1000 - comment.length).toLocaleString()} characters left
            </p>
            <ButtonOutline title="Submit" type="submit" />
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
