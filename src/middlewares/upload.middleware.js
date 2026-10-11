const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

// Where pictures are saved: <project>/uploads/avatars
const uploadDir = path.join(__dirname, '../../uploads/avatars');
fs.mkdirSync(uploadDir, { recursive: true }); // create the folder if it does not exist

const allowedTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Our own random name, so two users can never overwrite each other's file
    cb(null, `${crypto.randomUUID()}${allowedTypes[file.mimetype]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPG, PNG and WEBP images are allowed'));
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // maximum 2 MB
}).single('avatar'); // the form field must be named "avatar"

module.exports = { uploadAvatar, uploadDir };