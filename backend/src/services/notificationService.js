const { prisma } = require('../config/db');

class NotificationService {
  /**
   * Creates a notification record for a specific user
   */
  static async createNotification({ userId, title, message, type = 'SYSTEM', metadata = null }) {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          metadata: metadata ? metadata : undefined
        }
      });
    } catch (err) {
      console.error(`[NotificationService] Error creating notification for user ${userId}:`, err.message);
      return null;
    }
  }

  /**
   * Broadcasts notifications to multiple users
   */
  static async createManyNotifications(userNotifications) {
    try {
      if (!userNotifications || userNotifications.length === 0) return [];
      return await prisma.notification.createMany({
        data: userNotifications.map(n => ({
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type || 'SYSTEM',
          metadata: n.metadata || undefined
        }))
      });
    } catch (err) {
      console.error('[NotificationService] Error creating multiple notifications:', err.message);
      return [];
    }
  }

  /**
   * Retrieves notifications for a specific user with pagination
   */
  static async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    return {
      notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unreadCount
      }
    };
  }

  /**
   * Marks a single notification as read
   */
  static async markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  }

  /**
   * Marks all notifications of a user as read
   */
  static async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}

module.exports = NotificationService;
