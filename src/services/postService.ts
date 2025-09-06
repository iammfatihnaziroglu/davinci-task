import api from "./api";
import type { Post } from "../types/post";

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>("/posts");
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/posts?userId=${userId}`);
  return response.data;
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await api.post<Post>("/posts", post);
  return response.data;
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<Post> => {
  const response = await api.put<Post>(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};