const multer = require('multer');
const path = require('path');

// Allowed image types
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Relative to server root
    cb(null, path.join(__dirname, '..', 'uploads', 'profiles'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
