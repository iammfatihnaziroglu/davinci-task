import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserList from "../components/users/UserList";
import UserForm from "../components/users/UserForm";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import type { User } from "../types/user";
import { useNotification } from "../hooks/useNotification";
import Notification from "../components/common/Notification";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [highlightCount, setHighlightCount] = useState<boolean>(false);
  const { username } = useParams();

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: Omit<User, "id">) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
      setHighlightCount(true);
      setTimeout(() => setHighlightCount(false), 2000);
      showSuccess("Kullanıcı başarıyla oluşturuldu!");
    } catch (err) {
      console.error(err);
      showError("Kullanıcı oluşturulurken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    if (!editingUser) return;

    try {
      const updatedUser = await updateUser(editingUser.id, userData);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        )
      );
      setEditingUser(undefined);
      setShowForm(false);
      showSuccess("Kullanıcı başarıyla güncellendi!");
    } catch (err) {
      console.error(err);
      showError("Kullanıcı güncellenirken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="group flex items-center space-x-2 bg-gray-50 text-gray-600 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 border border-gray-100 hover:border-blue-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <span className="font-medium text-gray-700 group-hover:text-blue-600">
                  Ana Sayfa
                </span>
              </Link>
            </div>

            <div className="flex items-center sm:space-x-4 cursor-default">
              <div className="group flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-100 rounded-md">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z"
                  />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col justify-center items-center">
                <h1 className="text-xl font-semibold text-center text-gray-900 mb-0.5">
                  Kullanıcı Yönetimi
                </h1>
                <p className="text-sm text-gray-500 italic">
                  Kullanıcıları görüntüle ve yönet
                </p>
              </div>
            </div>

            <div className="flex items-center sm:hidden">
              <span className="text-sm text-gray-600">Toplam Kullanıcı:</span>
              <span
                className={`ml-1 text-blue-600 font-bold text-base transition-all duration-500 ${
                  highlightCount
                    ? "animate-bounce bg-blue-100 px-2 py-1 rounded-md"
                    : ""
                }`}
              >
                {loading ? "..." : users.length}
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-4 cursor-default">
              <div className="group flex items-center space-x-2 bg-gray-50 text-gray-600 px-3 py-2 rounded-md border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>

                <span className="font-medium text-gray-700 group-hover:text-blue-600">
                  Toplam Kullanıcı:
                </span>
                <span
                  className={`text-blue-600 font-bold text-base transition-all duration-500 ${
                    highlightCount
                      ? "animate-bounce bg-blue-100 px-2 py-1 rounded-md"
                      : ""
                  }`}
                >
                  {loading ? "..." : users.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UserList
          users={users}
          loading={loading}
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
          initialUsername={username}
          onDeleteUser={async (id: number) => {
            try {
              await deleteUser(id);
              setUsers((prev) => prev.filter((u) => u.id !== id));
              showSuccess("Kullanıcı başarıyla silindi!");
            } catch (err) {
              console.error(err);
              showError(
                "Kullanıcı silinirken hata oluştu. Lütfen tekrar deneyin."
              );
            }
          }}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={handleCancelForm}
          />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"}
                </h3>
              </div>
              <button
                onClick={handleCancelForm}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                aria-label="Kapat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4">
              <UserForm
                user={editingUser}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        </div>
      )}

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default UsersPage;
