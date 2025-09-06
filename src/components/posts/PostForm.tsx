import { useState, useEffect } from "react";
import type { Post } from "../../types/post";
import type { User } from "../../types/user";

interface PostFormProps {
  post?: Post;
  users: User[];
  onSubmit: (post: Omit<Post, 'id'>) => void;
  onCancel: () => void;
}

const PostForm = ({ post, users, onSubmit, onCancel }: PostFormProps) => {
  const [formData, setFormData] = useState({
    userId: 0,
    title: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        userId: post.userId,
        title: post.title,
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userId' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {post ? "Postu Düzenle" : "Yeni Post Ekle"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              Kullanıcı
            </label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>Kullanıcı seçin</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {post ? "Güncelle" : "Ekle"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;