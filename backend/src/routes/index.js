const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const donationRoutes = require('./donationRoutes');
const ngoRoutes = require('./ngoRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');
const userRoutes = require('./userRoutes');
const foodQualityRoutes = require('./foodQualityRoutes');

// API Sub-routes
router.use('/auth', authRoutes);
router.use('/donations', donationRoutes);
router.use('/food-quality', foodQualityRoutes);
router.use('/ngo', ngoRoutes);
router.use('/ngos', ngoRoutes); // for /api/ngos/nearby
router.use('/volunteer', volunteerRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'FoodBridge AI Express API Server',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
