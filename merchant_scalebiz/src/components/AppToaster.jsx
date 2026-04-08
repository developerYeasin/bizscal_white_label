"use client";

import React from 'react';
import { Toaster } from 'sonner'; // Import directly from sonner

const AppToaster = () => {
  return (
    <Toaster
      className="z-[99999]"
      position="top-center"
      richColors
      theme="light" // Changed from "system" to "light" to ensure custom styles are respected
      toastOptions={{
        success: {
          style: {
            backgroundColor: '#22C55E', // Tailwind green-500
            color: '#FFFFFF',
            borderRadius: '0.5rem', // rounded-lg
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
          },
        },
        error: {
          style: {
            backgroundColor: '#EF4444', // Tailwind red-500
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        info: {
          style: {
            backgroundColor: '#3B82F6', // Tailwind blue-500
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        warning: {
          style: {
            backgroundColor: '#F59E0B', // Tailwind yellow-500
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        default: {
          style: {
            backgroundColor: '#4B5563', // Tailwind gray-700
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      }}
    />
  );
};

export default AppToaster;