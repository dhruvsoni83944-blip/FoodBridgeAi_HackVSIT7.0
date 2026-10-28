const express = require('express');
const router = express.Router();
const FoodQualityController = require('../controllers/foodQualityController');
const { optionalAuthenticate, authenticate } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { apiLimiter } = require('../middleware/rateLimiter');

// POST /api/food-quality/analyze
// Accepts multipart image file upload or JSON payload with imageUrl
router.post(
  '/analyze',
  apiLimiter,
  optionalAuthenticate,
  upload.single('image'),
  FoodQualityController.analyzeFoodQuality
);

// GET /api/food-quality/inspections
// Retrieves saved inspection audits
router.get(
  '/inspections',
  authenticate,
  FoodQualityController.getInspections
);

module.exports = router;

