const { prisma } = require('../config/db');
const StatsService = require('../services/statsService');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  /**
   * GET /api/admin/users
   * Lists all users with role filtering, verification status, and pagination
   */
  static async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, role, isVerified, search } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const where = {};

      if (role) where.role = role;
      if (isVerified !== undefined) where.isVerified = isVerified === 'true';
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            isVerified: true,
            createdAt: true,
            donorProfile: true,
            ngoProfile: true,
            volunteerProfile: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit, 10)
        }),
        prisma.user.count({ where })
      ]);

      return ApiResponse.success(res, users, 'Users retrieved', 200, {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/donations
   * Complete view of all food donations across platform
   */
  static async getDonations(req, res, next) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const where = {};
      if (status) where.status = status;

      const [donations, total] = await Promise.all([
        prisma.foodDonation.findMany({
          where,
          include: {
            donor: { select: { id: true, name: true, phone: true, email: true, donorProfile: true } },
            analysis: true,
            requests: {
              include: { ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } } }
            },
            deliveries: {
              include: { volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } } }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit, 10)
        }),
        prisma.foodDonation.count({ where })
      ]);

      return ApiResponse.success(res, donations, 'Admin donations retrieved', 200, {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/deliveries
   * Complete view of all deliveries
   */
  static async getDeliveries(req, res, next) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const where = {};
      if (status) where.status = status;

      const [deliveries, total] = await Promise.all([
        prisma.delivery.findMany({
          where,
          include: {
            donation: { include: { donor: true, analysis: true } },
            ngoRequest: { include: { ngo: { include: { ngoProfile: true } } } },
            volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit, 10)
        }),
        prisma.delivery.count({ where })
      ]);

      return ApiResponse.success(res, deliveries, 'Admin deliveries retrieved', 200, {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/statistics
   * Computes real-time platform statistics directly from database
   */
  static async getStatistics(req, res, next) {
    try {
      const statistics = await StatsService.getPlatformStatistics();
      return ApiResponse.success(res, statistics, 'Live platform statistics computed from database');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/users/:id/verify
   * Admin approves/verifies an NGO or Volunteer account
   */
  static async verifyUser(req, res, next) {
    try {
      const { isVerified = true } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { isVerified: Boolean(isVerified) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isVerified: true
        }
      });
      return ApiResponse.success(
        res,
        updatedUser,
        `User verification status updated to ${updatedUser.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
