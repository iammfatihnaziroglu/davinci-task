import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import type { Post } from "../../types/post";
import { deleteUser } from "../../services/userService";
import { getPostsByUserId } from "../../services/postService";
import UserCard from "./UserCard";
import QuickEditModal from "../posts/QuickEditModal";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

interface UserListProps {
  users: User[];
  loading: boolean;
  onEditUser: (user: User) => void;
  onAddUser: () => void;
  initialUsername?: string;
}

const UserList = ({ users, loading, onEditUser, onAddUser, initialUsername }: UserListProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const [selectedUserPosts, setSelectedUserPosts] = useState<Post[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserPosts, setShowUserPosts] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [showQuickEdit, setShowQuickEdit] = useState<boolean>(false);
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : undefined;

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteUser(id);
      showSuccess("Kullanıcı başarıyla silindi!");
      // UsersPage will handle the users state update
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcı silinirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleViewPosts = async (user: User) => {
    try {
      const posts = await getPostsByUserId(user.id);
      setSelectedUserPosts(posts);
      setSelectedUserId(user.id);
      setShowUserPosts(true);
      navigate(`/users/@${user.username}`);
    } catch (err) {
      console.error(err);
      const errorMessage =
        "Kullanıcının postları yüklenirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleCloseUserPosts = () => {
    setShowUserPosts(false);
    setSelectedUserPosts([]);
    setSelectedUserId(null);
    navigate("/users");
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
      const uname = selectedUser ? `@${selectedUser.username}` : '';
      navigate(`/posts/${uname}`);
    }
  };

  useEffect(() => {
    if (!initialUsername || users.length === 0) return;
    const uname = initialUsername.startsWith("@")
      ? initialUsername.slice(1)
      : initialUsername;
    const user = users.find(
      (u) => u.username.toLowerCase() === uname.toLowerCase()
    );
    if (user) {
      handleViewPosts(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUsername, users]);

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
            onClick={() => window.location.reload()}
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
      <div className={`mb-4 flex items-center ${showUserPosts ? 'justify-center' : 'justify-between'}`}>
        <h2 className={`text-2xl ${showUserPosts ? 'font-bold text-center' : 'font-medium'} text-gray-600`}>
          {showUserPosts && selectedUser ? `${selectedUser.name} (@${selectedUser.username})` : 'Kullanıcı Listesi'}
        </h2>
        {!showUserPosts && (
          <button
            onClick={onAddUser}
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
        )}
      </div>

      {!showUserPosts && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDelete={handleDeleteUser}
              onViewPosts={(u) => handleViewPosts(u)}
            />
          ))}
        </div>
      )}

      {showUserPosts && (
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              Paylaştığı Post Sayısı: {selectedUserPosts.length}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleDetailedEdit}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4 " fill="white" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                <span>Detaylı Düzenleme</span>
              </button>
              <button
                onClick={handleCloseUserPosts}
                className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Kapat</span>
              </button>
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p>
                  <strong>Hızlı Düzenle:</strong> Post başlığını değiştirmek için post kartına tıklayın.
                </p>
                <p>
                  <strong>Detaylı Düzenleme:</strong> Kapsamlı post yönetimi için yukarıdaki butonu kullanın.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {selectedUserPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                onClick={() => handleQuickEditPost(post)}
                title="Hızlı düzenleme için tıklayın"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3">Post ID: {post.id}</p>
                <div className="flex items-center text-xs text-blue-600">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bu kullanıcının henüz postu bulunmuyor</h3>
                <p className="text-sm text-gray-500">İlk postu oluşturmak için detaylı düzenleme sayfasını kullanın.</p>
              </div>
            </div>
          )}
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
