import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Post } from "../../types/post";
import type { User } from "../../types/user";
import { getPosts, createPost, updatePost, deletePost } from "../../services/postService";
import { getUsers } from "../../services/userService";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  
  const userId = searchParams.get('userId');
  const filteredPosts = userId ? posts.filter(post => post.userId === parseInt(userId)) : posts;

  const fetchData = async () => {
    try {
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getUsers()
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError("Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePost = async (postData: Omit<Post, 'id'>) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [...prev, newPost]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Post oluşturulurken hata oluştu");
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
    } catch (err) {
      console.error(err);
      setError("Post güncellenirken hata oluştu");
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Bu postu silmek istediğinizden emin misiniz?")) return;
    
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      console.error(err);
      setError("Post silinirken hata oluştu");
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(undefined);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const selectedUser = userId ? users.find(user => user.id === parseInt(userId)) : null;

  return (
    <div>
      {userId && selectedUser && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-800">
            {selectedUser.name} kullanıcısının postları (Toplam {filteredPosts.length} Post)
          </h3>
          <p className="text-sm text-blue-600">
            Sadece bu kullanıcının postları gösteriliyor. Tüm postları görmek için filtreyi kaldırın.
          </p>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Yeni Post Ekle
        </button>
        
        {userId && (
          <button
            onClick={() => navigate('/posts')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Filtreyi Kaldır
          </button>
        )}
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
        <div className="text-center py-8">
          <p className="text-gray-500">
            {userId ? 'Bu kullanıcının henüz postu bulunmuyor.' : 'Henüz post bulunmuyor.'}
          </p>
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
    </div>
  );
};

export default PostList;
