import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea } from "flowbite-react";
import ButtonInline from "./Buttons";

export default function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  console.log(user); // For testing purposes
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  return (
    <div className="flex p-4 border-b dark:border-greenEx text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs">
            {user ? `@${user.username}` : "Anonymous User"}
          </span>
          <span text-gray-500 text-xs>
            {DateTime.fromISO(comment.createdAt).toRelative()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb2"
              value={editedContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="">
              <ButtonInline title="Edit" type="button" />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2 text-justify">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-greenEx font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
