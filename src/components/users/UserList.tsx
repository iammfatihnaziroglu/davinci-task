import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import type { Post } from "../../types/post";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import { getPostsByUserId } from "../../services/postService";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import QuickEditModal from "../posts/QuickEditModal";

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

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Kullanıcılar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Kullanıcı oluşturulurken hata oluştu");
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'id'>) => {
    if (!editingUser) return;
    
    try {
      const updatedUser = await updateUser(editingUser.id, userData);
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(undefined);
    } catch (err) {
      console.error(err);
      setError("Kullanıcı güncellenirken hata oluştu");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error(err);
      setError("Kullanıcı silinirken hata oluştu");
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
      setError("Kullanıcının postları yüklenirken hata oluştu");
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
    setSelectedUserPosts(prev => 
      prev.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  };

  const handleDetailedEdit = () => {
    if (selectedUserId) {
      navigate(`/posts?userId=${selectedUserId}`);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Yeni Kullanıcı Ekle
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
                Kullanıcı ID: {selectedUserId} - Postları ({selectedUserPosts.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleDetailedEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                  Detaylı Düzenleme
                </button>
                <button
                  onClick={handleCloseUserPosts}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Kapat
                </button>
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Hızlı Düzenle:</strong> Post başlığını değiştirmek için post kartına tıklayın.
                <br />
                <strong>Detaylı Düzenleme:</strong> Kapsamlı post yönetimi için yukarıdaki butonu kullanın.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {selectedUserPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-4 bg-gray-50 border rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleQuickEditPost(post)}
                  title="Hızlı düzenleme için tıklayın"
                >
                  <h3 className="font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600">Post ID: {post.id}</p>
                  <p className="text-xs text-blue-600 mt-2">✏️ Hızlı düzenle</p>
                </div>
              ))}
            </div>
            
            {selectedUserPosts.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Bu kullanıcının henüz postu bulunmuyor.
              </p>
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
    </div>
  );
};

export default UserList;
