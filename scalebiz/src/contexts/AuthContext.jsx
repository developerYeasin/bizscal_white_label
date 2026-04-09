"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"; // Added useRef
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import {
  login as authLogin,
  logout as authLogout,
  getToken,
  getUserData,
} from "@/utils/auth.js";
import axios from "axios"; // Import axios for the separate logout instance

const AuthContext = createContext(null);
const baseURL = "http://localhost:4000/api/v1";
// Create a separate axios instance for logout that does NOT have the interceptor
const logoutApi = axios.create({
  // baseURL: "/api/v1", // Use relative URL to go through nginx proxy
  baseURL: baseURL, // Use relative URL to go through nginx proxy
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggingOutRef = useRef(false); // To prevent multiple logout calls

  const fetchCurrentUser = useCallback(async () => {
    const token = getToken();
    const storedUserData = getUserData(); // Try to get user data from local storage first

    if (token) {
      if (storedUserData) {
        setUser(storedUserData); // Optimistically set user from local storage
        setLoading(false);
      }
      try {
        const response = await api.get("/owner/auth/me");
        const owner = response.data.data.owner;
        setUser(owner);
        authLogin(token, owner); // Update local storage with fresh data
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        // If fetching user fails, it means the token is invalid or expired.
        // Perform client-side logout only. The interceptor will handle server-side if needed.
        authLogout(); // Only clear local storage and state
        setUser(null);
      }
    } else {
      // If no token, ensure user is null and loading is false
      setUser(null);
      authLogout(); // Ensure local storage is clear if token somehow disappeared
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/owner/auth/login", { email, password });
      const {
        token,
        data: { user: userData },
      } = response.data;
      authLogin(token, userData); // Store token and user data
      setUser(userData); // Set user data in context
      showSuccess("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
      return false;
    }
  };

  const logout = async () => {
    if (isLoggingOutRef.current) {
      console.log("Logout already in progress, skipping redundant call.");
      return;
    }
    isLoggingOutRef.current = true;

    const tokenBeforeClear = getToken(); // Check if token exists before clearing

    // Perform client-side logout actions immediately
    authLogout(); // Clear token and user data from local storage
    setUser(null); // Clear user state in context
    showSuccess("Logged out successfully!");

    try {
      // Only attempt server-side logout if a token was present
      if (tokenBeforeClear) {
        // This call will NOT trigger the 401 interceptor because it uses `logoutApi`.
        await logoutApi.post("/owner/auth/logout");
      }
    } catch (err) {
      console.error("Server-side logout API error:", err);
    } finally {
      isLoggingOutRef.current = false;
    }
  };

  const hasRole = useCallback(
    (roles) => {
      if (loading || !user) return false;
      if (user.role === "owner") return true; // Owner has all access
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [loading, user],
  );

  const hasPermission = useCallback(
    (permissions) => {
      if (loading || !user) return false;
      if (user.role === "owner") return true; // Owner has all access
      if (!user.permissions || user.permissions.length === 0) return false;

      if (Array.isArray(permissions)) {
        return permissions.some((p) => user.permissions.includes(p));
      }
      return user.permissions.includes(permissions);
    },
    [loading, user],
  );

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
