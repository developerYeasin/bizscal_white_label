const fs = require('fs');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../utils/api_error');
const httpStatus = require('http-status');

const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided');
    }

    console.log('Attempting to upload single image to Cloudinary...');
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log('Cloudinary upload result:', result);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error during single image upload:', error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
  }
};

const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No image files provided');
    }

    console.log('Attempting to upload multiple images to Cloudinary...');
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    console.log('Cloudinary multiple upload results:', results);

    const images = results.map(result => ({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    }));

    res.status(200).json({
      message: 'Images uploaded successfully',
      images,
    });
  } catch (error) {
    console.error('Error during multiple image upload:', error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  } finally {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      });
    }
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No video file provided');
    }

    console.log('Attempting to upload single video to Cloudinary...');
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
    });
    console.log('Cloudinary video upload result:', result);

    res.status(200).json({
      message: 'Video uploaded successfully',
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error during single video upload:', error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
  }
};

const uploadMultipleVideos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No video files provided');
    }

    console.log('Attempting to upload multiple videos to Cloudinary...');
    const uploadPromises = req.files.map(file => cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
    }));
    const results = await Promise.all(uploadPromises);
    console.log('Cloudinary multiple video upload results:', results);

    const videos = results.map(result => ({
      videoUrl: result.secure_url,
      publicId: result.public_id,
    }));

    res.status(200).json({
      message: 'Videos uploaded successfully',
      videos,
    });
  } catch (error) {
    console.error('Error during multiple video upload:', error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  } finally {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      });
    }
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadVideo,
  uploadMultipleVideos,
};