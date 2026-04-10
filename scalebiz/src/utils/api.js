"use client";

import axios from "axios";
import { getToken } from "./auth"; // Only need getToken here
// We will import useAuth in the component where the interceptor is set up,
// or pass a logout function if this file is truly standalone.
// For now, we'll assume a global logout mechanism or pass it.

// export  const baseURL = "/api/v1";
 export const baseURL = "http://localhost:4000/api/v1";

const api = axios.create({
  // baseURL: "/api/v1",
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 Unauthorized errors
// This part needs to be handled carefully as `useAuth` is a hook and cannot be called here.
// We'll adjust `App.jsx` to set up the interceptor with the context's logout function.
let onUnauthorizedLogout = () => {
  console.error(
    "AuthContext logout function not yet initialized for API interceptor.",
  );
  // Fallback to direct localStorage clear and redirect if context isn't ready
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  window.location.href = "/login";
};

export const setUnauthorizedLogoutHandler = (handler) => {
  onUnauthorizedLogout = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "API Interceptor: 401 Unauthorized error caught. Logging out user.",
      );
      onUnauthorizedLogout();
      // IMPORTANT CHANGE: Re-throw the error so the original promise chain can reject.
      // This allows the calling component's catch/finally block to execute.
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default api;
