import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/posts/PostList";
import PostForm from "../components/posts/PostForm";
import { getPosts, createPost, updatePost, deletePost } from "../services/postService";
import { getUsers } from "../services/userService";
import type { Post } from "../types/post";
import type { User } from "../types/user";
import { useNotification } from "../hooks/useNotification";
import Notification from "../components/common/Notification";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [highlightCount, setHighlightCount] = useState<boolean>(false);
  const { username } = useParams();
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, usersData] = await Promise.all([
          getPosts(),
          getUsers(),
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Postlar/Users yüklenirken hata:", error);
        showError("Veriler yüklenirken hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  const handleAddPost = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  // URL'den username varsa, o kullanıcıyı bul
  const getDefaultUser = (): User | undefined => {
    if (!username || users.length === 0) return undefined;
    
    const normalizedUsername = username.startsWith('@') ? username.slice(1) : username;
    return users.find(u => u.username.toLowerCase() === normalizedUsername.toLowerCase());
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(undefined);
  };

  const handleCreatePost = async (postData: Omit<Post, 'id'>) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [...prev, newPost]);
      setShowForm(false);
      setHighlightCount(true);
      setTimeout(() => setHighlightCount(false), 2000);
      showSuccess("Post başarıyla oluşturuldu!");
    } catch (err) {
      console.error(err);
      showError("Post oluşturulurken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleUpdatePost = async (postData: Omit<Post, 'id'>) => {
    if (!editingPost) return;
    try {
      const updated = await updatePost(editingPost.id, postData);
      setPosts(prev => prev.map(p => p.id === editingPost.id ? updated : p));
      setEditingPost(undefined);
      setShowForm(false);
      showSuccess("Post başarıyla güncellendi!");
    } catch (err) {
      console.error(err);
      showError("Post güncellenirken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Bu postu silmek istediğinizden emin misiniz?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      showSuccess("Post başarıyla silindi!");
    } catch (err) {
      console.error(err);
      showError("Post silinirken hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="group flex items-center space-x-2 bg-gray-50 text-gray-600 hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-green-50 border border-gray-100 hover:border-green-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500 group-hover:text-green-600 group-hover:scale-110 transition-all duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <span className="font-medium text-gray-700 group-hover:text-green-600">
                  Ana Sayfaya
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 cursor-default">
              <div className="group flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-100 rounded-md">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col justify-center items-center">
                <h1 className="text-xl font-semibold text-center text-gray-900 mb-0.5">
                  Post Yönetimi
                </h1>
                <p className="text-sm text-gray-500 italic">
                  Postları görüntüle ve yönet
                </p>
              </div>
            </div>

            {/* Mobile-only right side: toplam post */}
            <div className="flex items-center sm:hidden">
              <span className="text-sm text-gray-600">Toplam Post:</span>
              <span className={`ml-1 text-green-600 font-bold text-base transition-all duration-500 ${highlightCount ? 'animate-bounce bg-green-100 px-2 py-1 rounded-md' : ''}`}>{loading ? "..." : posts.length}</span>
            </div>

            <div className="hidden sm:flex items-center space-x-4 cursor-default">
              <div className="group flex items-center space-x-2 bg-gray-50 text-gray-600 px-3 py-2 rounded-md border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all duration-200">
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
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>

                <span className="font-medium text-gray-700 group-hover:text-green-600">
                  Toplam Post:
                </span>
                <span className={`text-green-600 font-bold text-base transition-all duration-500 ${highlightCount ? 'animate-bounce bg-green-100 px-2 py-1 rounded-md' : ''}`}>
                  {loading ? "..." : posts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PostList 
          posts={posts}
          users={users}
          loading={loading}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={handleCancelForm} />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingPost ? "Postu Düzenle" : "Yeni Post"}
                </h3>
              </div>
              <button
                onClick={handleCancelForm}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                aria-label="Kapat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4">
              <PostForm
                post={editingPost}
                users={users}
                defaultUser={editingPost ? undefined : getDefaultUser()}
                onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
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

export default PostsPage;
