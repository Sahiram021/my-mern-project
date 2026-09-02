import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use((config) => {
  const token = Cookies.get("token") || localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/") {
      Cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminImage");
      window.location.assign("/");
    }

    return Promise.reject(error);
  }
);
