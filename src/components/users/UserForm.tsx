import { useState, useEffect } from "react";
import type { User } from "../../types/user";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useNotification } from "../../hooks/useNotification";
import Notification from "../common/Notification";

interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

type UserFormState = {
  name: string;
  username: string;
  email: string;
};

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormState>({
    name: "",
    username: "",
    email: "",
  });

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    }
    clearErrors();
  }, [user, clearErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    validateSingleField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      onSubmit(formData);
      showSuccess(user ? "Kullanıcı başarıyla güncellendi!" : "Kullanıcı başarıyla oluşturuldu!");
    } else {
      showError("Lütfen tüm alanları doğru şekilde doldurun!");
    }
  };

  return (
    <div>
      <div className="bg-white max-w-lg mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ad ve soyadı girin"
              className={`mt-1 block w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                getFieldError('name') && isFieldTouched('name')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
              }`}
            />
            {getFieldError('name') && isFieldTouched('name') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {getFieldError('name')}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/50 karakter
            </p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Kullanıcı adı girin"
              className={`mt-1 block w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                getFieldError('username') && isFieldTouched('username')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
              }`}
            />
            {getFieldError('username') && isFieldTouched('username') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {getFieldError('username')}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.username.length}/20 karakter - Sadece harf, rakam ve _ kullanın
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-posta adresini girin"
              className={`mt-1 block w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${
                getFieldError('email') && isFieldTouched('email')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
              }`}
            />
            {getFieldError('email') && isFieldTouched('email') && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {getFieldError('email')}
              </p>
            )}
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
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            >
              {user ? "Güncelle" : "Ekle"}
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

export default UserForm;