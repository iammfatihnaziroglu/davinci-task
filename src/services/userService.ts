import api from "./api";
import type { User } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};
