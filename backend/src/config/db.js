const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, preserve prisma instance across hot-reloads
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: ['error', 'warn']
    });
  }
  prisma = global.__db;
}

/**
 * Validates database connectivity
 */
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

module.exports = {
  prisma,
  checkDatabaseConnection
};
