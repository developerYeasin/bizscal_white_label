const express = require('express');
const multer = require('multer');
const path = require('path'); // Import the 'path' module
const fs = require('fs'); // Import the 'fs' module
const ApiError = require('../../utils/api_error'); // Import ApiError
const httpStatus = require('http-status'); // Import httpStatus
const { uploadSingleImage, uploadMultipleImages, uploadVideo, uploadMultipleVideos } = require('../controllers/upload_controller');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Files will be temporarily stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/single', upload.single('image'), uploadSingleImage);
router.post('/multiple', upload.array('images', 10), uploadMultipleImages); // 'images' is the field name, 10 is max files

// Configure Multer for video uploads
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const videoUploadDir = path.join(process.cwd(), 'uploads/videos');
    if (!fs.existsSync(videoUploadDir)) {
      fs.mkdirSync(videoUploadDir, { recursive: true });
    }
    cb(null, videoUploadDir); // Videos will be temporarily stored in 'uploads/videos/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadVideoFile = multer({
  storage: videoStorage,
  fileFilter: function (req, file, cb) {
    const filetypes = /\.(mp4|mov|avi|wmv|flv|webm)$/i;
    const mimetype = /^video\/(mp4|mpeg|quicktime|x-msvideo|x-ms-wmv|x-flv|webm)$/i;
    
    const isVideo = mimetype.test(file.mimetype) && filetypes.test(path.extname(file.originalname));

    if (isVideo) {
      return cb(null, true);
    }
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only video files are allowed!'));
  }
});

router.post('/video', uploadVideoFile.single('video'), uploadVideo);
router.post('/multiple-videos', uploadVideoFile.array('videos', 10), uploadMultipleVideos); // 'videos' is the field name, 10 is max files

// Multer error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return next(new ApiError(httpStatus.BAD_REQUEST, err.message));
  }
  next(err);
});

module.exports = router;