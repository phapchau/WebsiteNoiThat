import axiosClient from "../services/axiosClient";

export const logIn = (data: { email: string; password: string }) => {
  return axiosClient.post("/api/auth/login", data);
};
