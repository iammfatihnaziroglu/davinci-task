import { useState, useEffect } from "react";
import type { Post } from "../../types/post";
import type { User } from "../../types/user";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

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

  const validationRules = {
    userId: {
      required: true,
      custom: (value: string) => {
        if (parseInt(value) === 0) {
          return 'Lütfen bir kullanıcı seçin';
        }
        return null;
      }
    },
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
    }
  };

  const { 
    validateForm, 
    validateSingleField, 
    getFieldError, 
    isFieldTouched,
    clearErrors 
  } = useFormValidation(validationRules);

  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    if (post) {
      setFormData({
        userId: post.userId,
        title: post.title,
      });
    }
    clearErrors();
  }, [post, clearErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userId' ? parseInt(value) : value,
    }));
    
    // Real-time validation
    validateSingleField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert formData to string format for validation
    const formDataForValidation = {
      userId: formData.userId.toString(),
      title: formData.title,
    };
    
    if (validateForm(formDataForValidation)) {
      try {
        onSubmit(formData);
        showSuccess(post ? "Post başarıyla güncellendi!" : "Post başarıyla oluşturuldu!");
      } catch {
        showError(post ? "Post güncellenirken hata oluştu!" : "Post oluşturulurken hata oluştu!");
      }
    } else {
      showError("Lütfen tüm alanları doğru şekilde doldurun!");
    }
  };

  return (
    <div className="bg-white max-w-lg mx-auto p-4 sm:p-6">
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
              className={`mt-1 block w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                getFieldError('userId') && isFieldTouched('userId')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
              }`}
            >
              <option value={0}>Kullanıcı seçin</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
            {getFieldError('userId') && isFieldTouched('userId') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {getFieldError('userId')}
              </p>
            )}
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
              className={`mt-1 block w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                getFieldError('title') && isFieldTouched('title')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500 hover:border-gray-400'
              }`}
            />
            {getFieldError('title') && isFieldTouched('title') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {getFieldError('title')}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 karakter
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors"
            >
              {post ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default PostForm;