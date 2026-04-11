const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

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

const profileUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = profileUpload;
