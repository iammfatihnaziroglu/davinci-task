import type { User } from "../../types/user";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onViewPosts: (userId: number) => void;
}

const UserCard = ({ user, onEdit, onDelete, onViewPosts }: UserCardProps) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{user.name}</h3>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      
      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => onViewPosts(user.id)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Postları Gör
        </button>
        <button
          onClick={() => onEdit(user)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
        >
          Düzenle
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Sil
        </button>
      </div>
    </div>
  );
};

export default UserCard;
