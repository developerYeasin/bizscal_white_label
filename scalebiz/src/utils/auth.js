"use client";

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData"; // New key for user data

export const login = (token, userData) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)); // Store user data
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY); // Clear user data
};

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};