import api from "../axios";

export const signUp = (data) => api.post("/auth/signup", data);

export const signIn = (data) => api.post("/auth/signin", data);

export const signOut = () => api.post("/auth/signout");

export const getMe = () => api.get("/auth/me");

export const verifyEmail = (token) =>
  api.post("/auth/verify-email", { token });
