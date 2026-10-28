require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { checkDatabaseConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & HTTP Header Hardening
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Setup
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder for fallback image serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate Limiting on API endpoints
app.use('/api', apiLimiter);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'FoodBridge AI — Enterprise Backend API',
    version: '1.0.0',
    health: '/health',
    documentation: '/api/health',
    status: 'active'
  });
});

// Production-ready Health Check Endpoint (Mounted on both /health and /api/health)
app.get(['/health', '/api/health'], async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  const isHealthy = dbStatus.connected;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'FoodBridge AI Express API Server',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    database: isHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Mount All API Routes
app.use('/api', routes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Central Error Handler
app.use(errorHandler);

// Start HTTP Server
const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 FoodBridge AI Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`====================================================`);

  // Validate JWT Secret in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'foodbridge_default_jwt_secret') {
      console.warn('⚠️ [SECURITY WARNING] Insecure or default JWT_SECRET detected in production! Please set a strong, random JWT_SECRET.');
    }
  }

  // Database Connection Verification
  let dbStatus = await checkDatabaseConnection();
  if (!dbStatus.connected && process.env.NODE_ENV !== 'production') {
    try {
      const { startDatabase } = require('../embedded-pg');
      await startDatabase();
      dbStatus = await checkDatabaseConnection();
    } catch (dbBootErr) {
      console.warn(`Could not boot local embedded postgres: ${dbBootErr.message}`);
    }
  }

  if (dbStatus.connected) {
    console.log(`✅ PostgreSQL Database connection established successfully via Prisma.`);
  } else {
    console.warn(`⚠️ Database connection pending or offline: ${dbStatus.error}`);
    console.warn(`👉 Configure valid DATABASE_URL in environment to connect PostgreSQL.`);
  }
});

// Graceful Shutdown Handlers
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received: Closing HTTP server gracefully.`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      const { prisma } = require('./config/db');
      await prisma.$disconnect();
      console.log('Prisma database connection pool closed.');
    } catch (err) {
      console.error('Error during Prisma disconnect:', err);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server };
