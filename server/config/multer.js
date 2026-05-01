const multer = require('multer');
const path = require('path');

/**
 * Multer config for document uploads (PDF, DOC, DOCX)
 * Auto-detects: Cloudinary (cloud) vs disk (local)
 */

// Allowed file types
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
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
  const { documentStorage } = require('./cloudinary');
  upload = multer({
    storage: documentStorage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB for cloud
  });
} else {
  // Local disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
    },
  });
  upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB local
  });
}

module.exports = upload;