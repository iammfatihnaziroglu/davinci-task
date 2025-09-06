import UserList from "../components/users/UserList";

const UsersPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <UserList />
    </div>
  );
};

export default UsersPage;
