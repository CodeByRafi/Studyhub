const multer = require('multer');
const fs = require('fs');
const path = require('path');

/**
 * Multer config for image uploads (networking profile/cover photos)
 * Auto-detects: Cloudinary (cloud) vs disk (local)
 */

// Allowed image types
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
  }
};

let upload;

const isCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinary) {
  // Cloud storage (Cloudinary)
  const { imageStorage } = require('./cloudinary');
  upload = multer({
    storage: imageStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
} else {
  // Local disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationPath = path.join(__dirname, '..', 'uploads', 'profiles');
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `profile-${Date.now()}-${file.fieldname}${ext}`);
    },
  });
  upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}

module.exports = upload;
