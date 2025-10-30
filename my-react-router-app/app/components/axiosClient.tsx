// axiosClient.ts
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔹 Interceptor żądań — dodaje token do nagłówków
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token"); // lub sessionStorage
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor odpowiedzi — obsługuje błędy (np. 401)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("❌ Token wygasł lub nieprawidłowy");
      // tutaj możesz np. przekierować do logowania lub spróbować odświeżyć token
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
