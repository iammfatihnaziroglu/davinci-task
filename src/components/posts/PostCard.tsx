import type { Post } from "../../types/post";
import type { User } from "../../types/user";

interface PostCardProps {
  post: Post;
  users: User[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

const PostCard = ({ post, users, onEdit, onDelete }: PostCardProps) => {
  const user = users.find(u => u.id === post.userId);
  
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{post.title}</h3>
      <p className="text-sm text-gray-600">
        Kullanıcı: {user ? user.name : `ID: ${post.userId}`}
      </p>
      <p className="text-sm text-gray-500">Post ID: {post.id}</p>
      
      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => onEdit(post)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
        >
          Düzenle
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Sil
        </button>
      </div>
    </div>
  );
};

export default PostCard;
