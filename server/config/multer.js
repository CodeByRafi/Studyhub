const multer = require('multer');
const path = require('path');

// Allowed file types
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Shared Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The path is relative to this config file, so we go up to the server root then into uploads
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

module.exports = upload;