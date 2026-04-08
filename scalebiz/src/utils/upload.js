"use client";

import api from './api';
import { showLoading, dismissToast, showError, showSuccess } from './toast';

/**
 * Handles uploading a single image file.
 * @param {File} file The image file to upload.
 * @returns {Promise<object>} The response data from the API.
 */
export const uploadSingleImage = async (file) => {
  const toastId = showLoading('Uploading image...');
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/owner/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dismissToast(toastId);
    showSuccess('Image uploaded successfully!');
    return response.data;
  } catch (error) {
    dismissToast(toastId);
    console.error('Image upload failed:', error);
    showError(error.response?.data?.message || 'Image upload failed.');
    throw error;
  }
};

/**
 * Handles uploading multiple image files.
 * @param {File[]} files An array of image files to upload.
 * @returns {Promise<object>} The response data from the API.
 */
export const uploadMultipleImages = async (files) => {
  const toastId = showLoading(`Uploading ${files.length} images...`);
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post('/owner/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dismissToast(toastId);
    showSuccess('Images uploaded successfully!');
    return response.data;
  } catch (error) {
    dismissToast(toastId);
    console.error('Multiple image upload failed:', error);
    showError(error.response?.data?.message || 'Multiple image upload failed.');
    throw error;
  }
};