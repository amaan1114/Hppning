import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
});

let refreshing = false;
let refreshRequest = null;

async function refreshAccessToken() {
  try {
    await api.post("/auth/refresh");
  } finally {
    refreshing = false;
    refreshRequest = null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const retryRequest = request;

    if (
      error.response?.status !== 401 ||
      !request ||
      request.url?.includes("/auth/refresh") ||
      retryRequest._retry
    ) {
      return Promise.reject(error);
    }

    retryRequest._retry = true;

    if (!refreshing) {
      refreshing = true;
      refreshRequest = refreshAccessToken();
    }

    await refreshRequest;
    return api(retryRequest);
  },
);

export default api;
