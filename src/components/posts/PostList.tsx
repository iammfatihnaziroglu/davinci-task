import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Post } from "../../types/post";
import type { User } from "../../types/user";
import { getPosts, createPost, updatePost, deletePost } from "../../services/postService";
import { getUsers } from "../../services/userService";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  const userId = searchParams.get('userId');
  const filteredPosts = userId ? posts.filter(post => post.userId === parseInt(userId)) : posts;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getUsers()
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      const errorMessage = "Veriler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreatePost = async (postData: Omit<Post, 'id'>) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [...prev, newPost]);
      setShowForm(false);
      showSuccess("Post başarıyla oluşturuldu!");
    } catch (err) {
      console.error(err);
      const errorMessage = "Post oluşturulurken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleUpdatePost = async (postData: Omit<Post, 'id'>) => {
    if (!editingPost) return;
    
    try {
      const updatedPost = await updatePost(editingPost.id, postData);
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? updatedPost : post
      ));
      setEditingPost(undefined);
      showSuccess("Post başarıyla güncellendi!");
    } catch (err) {
      console.error(err);
      const errorMessage = "Post güncellenirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Bu postu silmek istediğinizden emin misiniz?")) return;
    
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      showSuccess("Post başarıyla silindi!");
    } catch (err) {
      console.error(err);
      const errorMessage = "Post silinirken hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(undefined);
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
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const selectedUser = userId ? users.find(user => user.id === parseInt(userId)) : null;

  return (
    <div>
      {userId && selectedUser && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800">
            {selectedUser.name} kullanıcısının postları (Toplam {filteredPosts.length} Post)
          </h3>
          <p className="text-sm text-green-600">
            Sadece bu kullanıcının postları gösteriliyor. Tüm postları görmek için filtreyi kaldırın.
          </p>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-600">
          Post Listesi
        </h2>
        <div className="flex space-x-2">
          {userId && (
            <button
              onClick={() => navigate('/posts')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Filtreyi Kaldır</span>
            </button>
          )}
          
          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 bg-gray-200 text-gray-800 hover:text-white transition-all duration-200 px-3 py-2 rounded-md hover:bg-green-500 border border-gray-100 hover:border-green-100"
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <span className="font-medium">Yeni Post Ekle</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            users={users}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {userId ? 'Bu kullanıcının henüz postu bulunmuyor' : 'Henüz post bulunmuyor'}
            </h3>
            <p className="text-sm text-gray-500">
              {userId ? 'İlk postu oluşturmak için yukarıdaki butonu kullanın.' : 'İlk postu oluşturmak için yukarıdaki butonu kullanın.'}
            </p>
          </div>
        </div>
      )}

      {(showForm || editingPost) && (
        <PostForm
          post={editingPost}
          users={users}
          onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
          onCancel={handleCancelForm}
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

export default PostList;
