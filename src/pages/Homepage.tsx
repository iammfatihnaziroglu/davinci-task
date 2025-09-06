import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to My App</h1>
      <div className="flex gap-4">
        <Link
          to="/users"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Users
        </Link>
        <Link
          to="/posts"
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Posts
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
