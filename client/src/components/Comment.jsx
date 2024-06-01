import { useEffect } from "react";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user); // For testing purposes
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`api/users/${comment.userId}`);
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

  return <div>Comment</div>;
}
