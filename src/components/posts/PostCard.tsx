import type { Post } from "../../types/post";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{post.title}</h3>
      <p>User ID: {post.userId}</p>
      <p>Post ID: {post.id}</p>
    </div>
  );
};

export default PostCard;
