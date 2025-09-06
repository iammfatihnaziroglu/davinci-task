import type { User } from "../../types/user";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold">{user.name}</h3>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserCard;
