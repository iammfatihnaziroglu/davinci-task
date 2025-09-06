import api from "./api";
import type { Post } from "../types/post";

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>("/posts");
  return response.data;
};
