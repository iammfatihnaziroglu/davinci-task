import type { User } from "../../types/user";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onViewPosts: (user: User) => void;
}

const UserCard = ({ user, onEdit, onDelete, onViewPosts }: UserCardProps) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-lg border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg pr-2 truncate">{user.name}</h3>
      </div>
      <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
        <span className="px-2.5 py-0.5 rounded border border-gray-200 bg-blue-50/50 tracking-tight">UserId: {user.id}</span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-800">
          <svg className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="font-medium truncate">@{user.username}</span>
        </div>
        <div className="flex items-center text-sm text-gray-800">
          <svg className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="lowercase truncate">{user.email}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onViewPosts(user)}
          className="px-2 py-1.5 bg-blue-50/30 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 hover:text-black border border-blue-200 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Postlar</span>
        </button>
        <button
          onClick={() => onEdit(user)}
          className="px-2 py-1.5 bg-amber-50/30 text-amber-700 text-xs font-medium rounded hover:bg-amber-200 hover:text-black border border-amber-200 hover:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-200 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Düzenle</span>
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-2 py-1.5 bg-red-50/30 text-red-700 text-xs font-medium rounded hover:bg-red-200 hover:text-black border border-red-200 hover:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Sil</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;
