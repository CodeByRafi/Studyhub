const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer config for user avatar/profile image uploads
 * Auto-detects: Cloudinary (cloud) vs disk (local)
 */

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
  }
};

let profileUpload;

const isCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinary) {
  // Cloud storage (Cloudinary)
  const { imageStorage } = require('./cloudinary');
  profileUpload = multer({
    storage: imageStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });
} else {
  // Local disk storage
  const uploadDir = path.join(__dirname, '..', 'uploads', 'profile');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
  });

  profileUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  });
}

module.exports = profileUpload;
