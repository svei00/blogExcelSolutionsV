import { useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();
  return <div>PostPage</div>;
}
