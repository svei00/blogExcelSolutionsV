import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
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
        <p className="text-gray-500 pb-2 text-justify">{comment.content}</p>
      </div>
    </div>
  );
}
