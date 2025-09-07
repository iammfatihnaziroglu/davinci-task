import { useState } from "react";
import type { Post } from "../../types/post";
import { updatePost } from "../../services/postService";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

interface QuickEditModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPost: Post) => void;
}

const QuickEditModal = ({ post, isOpen, onClose, onUpdate }: QuickEditModalProps) => {
  const [title, setTitle] = useState(post.title);
  const [loading, setLoading] = useState(false);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const updatedPost = await updatePost(post.id, { title: title.trim() });
      onUpdate(updatedPost);
      showSuccess("Post başlığı başarıyla güncellendi!");
      onClose();
    } catch (error) {
      console.error("Post güncellenirken hata oluştu:", error);
      showError("Post güncellenirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle(post.title); // Reset to original value
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Hızlı Düzenle</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post başlığını girin..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
      
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default QuickEditModal;
