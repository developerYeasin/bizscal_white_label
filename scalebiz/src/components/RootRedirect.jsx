"use client";

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useHasStore } from '@/hooks/use-has-store.js';

const RootRedirect = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasStore, isLoading: storeLoading } = useHasStore();
  const location = useLocation();

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If authenticated and has a store, redirect to dashboard
  if (isAuthenticated && hasStore) {
    return <Navigate to="/dashboard" replace />;
  } 
  // If authenticated but no store, redirect to create-store (unless already there)
  // else if (isAuthenticated && !hasStore && location.pathname !== "/create-store") {
  //   return <Navigate to="/create-store" replace />;
  // } 
  // If not authenticated, redirect to login
  else {
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;