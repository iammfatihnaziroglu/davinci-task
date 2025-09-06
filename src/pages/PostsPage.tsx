import PostList from "../components/posts/PostList";

const PostsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <PostList />
    </div>
  );
};

export default PostsPage;
