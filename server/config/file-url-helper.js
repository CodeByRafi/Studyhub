/**
 * File URL Helper
 * Returns the correct URL for uploaded files regardless of storage backend.
 * 
 * Cloudinary: req.file.path contains the full cloud URL (https://res.cloudinary.com/...)
 * Local disk: req.file.filename contains just the filename, needs /uploads/ prefix
 */

/**
 * Get the URL for an uploaded document file
 * @param {Object} file - The multer file object (req.file)
 * @returns {string} The file URL
 */
function getDocumentUrl(file) {
  if (!file) return null;
  // Cloudinary sets file.path to the full URL
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }
  // Local storage: construct the URL
  return `/uploads/${file.filename}`;
}

/**
 * Get the URL for an uploaded profile image
 * @param {Object} file - The multer file object (req.file)
 * @param {string} subfolder - The subfolder name ('profile' or 'profiles')
 * @returns {string} The image URL
 */
function getImageUrl(file, subfolder = 'profile') {
  if (!file) return null;
  // Cloudinary sets file.path to the full URL
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }
  // Local storage: construct the URL
  return `/uploads/${subfolder}/${file.filename}`;
}

/**
 * Check if we're using cloud storage
 * @returns {boolean}
 */
function isCloudStorage() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

module.exports = { getDocumentUrl, getImageUrl, isCloudStorage };
