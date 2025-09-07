import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostList from "../components/posts/PostList";
import { getPosts } from "../services/postService";
import type { Post } from "../types/post";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Postlar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
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
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-xl font-semibold text-center text-gray-900 mb-0.5">
                  Post Yönetimi
                </h1>
                <p className="text-sm text-gray-500 italic">
                  Postları görüntüle ve yönet
                </p>
              </div>
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
                <span className="text-green-600 font-bold text-base">
                  {loading ? "..." : posts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PostList />
      </div>
    </div>
  );
};

export default PostsPage;
