
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();

    const isAdminRequest =
      config.url?.startsWith("/admin/") ||
      config.url?.startsWith("/orders/admin/") ||
      config.url?.startsWith("/customers/admin/") ||
      (
        config.url?.startsWith("/products") &&
        ["post", "put", "patch", "delete"].includes(method)
      );

    const token = isAdminRequest
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
