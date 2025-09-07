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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={handleClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Hızlı Düzenle</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Başlığı</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 border-gray-300"
                placeholder="Post başlığını girin..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
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
    </div>
  );
};

export default QuickEditModal;
