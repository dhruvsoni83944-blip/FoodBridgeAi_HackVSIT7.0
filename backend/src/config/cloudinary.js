const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer storage in memory for streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for image types only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum
  },
  fileFilter
});

/**
 * Uploads an image buffer to Cloudinary (or fallback local storage if unconfigured)
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} originalName
 * @returns {Promise<string>} public URL of the uploaded image
 */
async function uploadImageBuffer(buffer, folder = 'foodbridge/donations', originalName = 'food.jpg') {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Graceful local fallback if Cloudinary credentials are not set
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalName) || '.jpg'}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  const baseUrl = process.env.APP_URL || process.env.BACKEND_URL;
  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    return `${cleanBase}/uploads/${filename}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return `/uploads/${filename}`;
  }

  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/uploads/${filename}`;
}

module.exports = {
  cloudinary,
  upload,
  uploadImageBuffer
};
