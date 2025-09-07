import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import type { Post } from "../../types/post";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { getPostsByUserId } from "../../services/postService";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import QuickEditModal from "../posts/QuickEditModal";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [selectedUserPosts, setSelectedUserPosts] = useState<Post[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserPosts, setShowUserPosts] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [showQuickEdit, setShowQuickEdit] = useState<boolean>(false);

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcılar yüklenirken hata oluştu. Lütfen sayfayı yenileyin.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateUser = async (userData: Omit<User, "id">) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
      showSuccess("Kullanıcı başarıyla oluşturuldu!");
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcı oluşturulurken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    if (!editingUser) return;

    try {
      const updatedUser = await updateUser(editingUser.id, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
      setEditingUser(undefined);
      showSuccess("Kullanıcı başarıyla güncellendi!");
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcı güncellenirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      showSuccess("Kullanıcı başarıyla silindi!");
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcı silinirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleViewPosts = async (userId: number) => {
    try {
      const posts = await getPostsByUserId(userId);
      setSelectedUserPosts(posts);
      setSelectedUserId(userId);
      setShowUserPosts(true);
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcının postları yüklenirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  const handleCloseUserPosts = () => {
    setShowUserPosts(false);
    setSelectedUserPosts([]);
    setSelectedUserId(null);
  };

  const handleQuickEditPost = (post: Post) => {
    setEditingPost(post);
    setShowQuickEdit(true);
  };

  const handleCloseQuickEdit = () => {
    setShowQuickEdit(false);
    setEditingPost(undefined);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setSelectedUserPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    showSuccess("Post başarıyla güncellendi!");
  };

  const handleDetailedEdit = () => {
    if (selectedUserId) {
      navigate(`/posts?userId=${selectedUserId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-2 text-gray-600">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={fetchUsers}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-600">
          Kullanıcı Listesi
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center space-x-2 bg-gray-200 text-gray-800 hover:text-white transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-500 border border-gray-100 hover:border-blue-100"
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>

          <span className="font-medium">Yeni Kullanıcı Ekle</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onViewPosts={handleViewPosts}
          />
        ))}
      </div>

      {(showForm || editingUser) && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={handleCancelForm}
        />
      )}

      {showUserPosts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Kullanıcı ID: {selectedUserId} - Postları (
                {selectedUserPosts.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleDetailedEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Detaylı Düzenleme</span>
                </button>
                <button
                  onClick={handleCloseUserPosts}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span>Kapat</span>
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Kullanım Kılavuzu:</p>
                  <p>
                    <strong>Hızlı Düzenle:</strong> Post başlığını değiştirmek
                    için post kartına tıklayın.
                  </p>
                  <p>
                    <strong>Detaylı Düzenleme:</strong> Kapsamlı post yönetimi
                    için yukarıdaki butonu kullanın.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {selectedUserPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  onClick={() => handleQuickEditPost(post)}
                  title="Hızlı düzenleme için tıklayın"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Post ID: {post.id}
                  </p>
                  <div className="flex items-center text-xs text-blue-600">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Hızlı düzenle</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedUserPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bu kullanıcının henüz postu bulunmuyor
                  </h3>
                  <p className="text-sm text-gray-500">
                    İlk postu oluşturmak için detaylı düzenleme sayfasını
                    kullanın.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editingPost && (
        <QuickEditModal
          post={editingPost}
          isOpen={showQuickEdit}
          onClose={handleCloseQuickEdit}
          onUpdate={handleUpdatePost}
        />
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

export default UserList;
