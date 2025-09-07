import type { Post } from "../../types/post";
import type { User } from "../../types/user";

interface PostCardProps {
  post: Post;
  users: User[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

const PostCard = ({ post, users, onEdit, onDelete }: PostCardProps) => {
  const user = users.find(u => u.id === post.userId);
  
  return (
    <div className="p-6 bg-white shadow-sm rounded-lg border border-green-50 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-start justify-between mb-4 h-8">
        <h3 className="font-semibold text-gray-900 text-lg pr-2 truncate w-4/5">{post.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6 h-16">
        <div className="flex items-center text-sm text-gray-800">
          <svg className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium truncate">{user ? user.name : `ID: ${post.userId}`}</span>
        </div>
        {user ? (
          <div className="flex items-center text-sm text-gray-800">
            <svg className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="truncate">@{user.username}</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-800 h-6">
            <div className="w-4 h-4 mr-2 flex-shrink-0"></div>
            <span>&nbsp;</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onEdit(post)}
          className="px-2 py-1.5 bg-amber-50/30 text-amber-700 text-xs font-medium rounded hover:bg-amber-200 hover:text-black border border-amber-200 hover:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-200 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Düzenle</span>
        </button>
        <button
          onClick={() => onDelete(post.id)}
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

export default PostCard;
