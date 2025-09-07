import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserList from "../components/users/UserList";
import { getUsers } from "../services/userService";
import type { User } from "../types/user";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

            <div className="flex items-center space-x-4 cursor-default">
              <div className="group flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-100 rounded-md">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                  strokeWidth={1.5}
                >
                  <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-xl font-semibold text-center text-gray-900 mb-0.5">
                  Kullanıcı Yönetimi
                </h1>
                <p className="text-sm text-gray-500 italic">
                  Kullanıcıları görüntüle ve yönet
                </p>
              </div>
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
                <span className="text-blue-600 font-bold text-base">
                  {loading ? "..." : users.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UserList />
      </div>
    </div>
  );
};

export default UsersPage;
