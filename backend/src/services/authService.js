const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

class AuthService {
  /**
   * Registers a new user and creates their role-specific profile in a transaction
   */
  static async register({ email, password, name, role, phone, ...profileData }) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      const error = new Error('A user with this email address is already registered.');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Execute in a transaction to guarantee profile creation
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          role,
          name,
          phone: phone || null,
          isVerified: role === 'DONOR' // Donors auto-verified, NGOs/Volunteers can be admin-verified
        }
      });

      // Create role profile
      if (role === 'DONOR') {
        await tx.donorProfile.create({
          data: {
            userId: createdUser.id,
            organizationName: profileData.organizationName || name,
            address: profileData.address || 'Pickup Point',
            latitude: profileData.latitude ? parseFloat(profileData.latitude) : 28.6139,
            longitude: profileData.longitude ? parseFloat(profileData.longitude) : 77.209,
            contactPerson: profileData.contactPerson || name
          }
        });
      } else if (role === 'NGO') {
        const ngoDelegate = tx.nGOProfile || tx.ngoProfile;
        await ngoDelegate.create({
          data: {
            userId: createdUser.id,
            organizationName: profileData.organizationName || name,
            registrationNumber: profileData.registrationNumber || null,
            address: profileData.address || 'Shelter Facility',
            latitude: profileData.latitude ? parseFloat(profileData.latitude) : 28.625,
            longitude: profileData.longitude ? parseFloat(profileData.longitude) : 77.218,
            capacity: profileData.capacity ? parseInt(profileData.capacity, 10) : 120,
            dietaryPreferences: profileData.dietaryPreferences || 'ALL',
            operatingHours: profileData.operatingHours || '08:00 - 22:00'
          }
        });
      } else if (role === 'VOLUNTEER') {
        await tx.volunteerProfile.create({
          data: {
            userId: createdUser.id,
            vehicleType: profileData.vehicleType || 'Eco EV Scooter',
            carryingCapacityKg: profileData.carryingCapacityKg
              ? parseFloat(profileData.carryingCapacityKg)
              : 25.0,
            isAvailable: true,
            latitude: profileData.latitude ? parseFloat(profileData.latitude) : 28.618,
            longitude: profileData.longitude ? parseFloat(profileData.longitude) : 77.212
          }
        });
      }

      return createdUser;
    });

    const token = this.generateToken(user);
    const fullUser = await this.getUserById(user.id);

    return {
      user: fullUser,
      token
    };
  }

  /**
   * Authenticates user with email and password
   */
  static async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        donorProfile: true,
        ngoProfile: true,
        volunteerProfile: true
      }
    });

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Retrieves user by ID with role profile attached
   */
  static async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        donorProfile: true,
        ngoProfile: true,
        volunteerProfile: true
      }
    });

    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generates a signed JWT token
   */
  static generateToken(user) {
    const secret = process.env.JWT_SECRET || 'foodbridge_default_jwt_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email
      },
      secret,
      { expiresIn }
    );
  }
}

module.exports = AuthService;
