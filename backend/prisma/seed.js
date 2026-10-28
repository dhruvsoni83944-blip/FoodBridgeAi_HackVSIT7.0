const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FoodBridge AI Database Seeding...');

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password@123', salt);

  // 1. Seed Platform Administrator
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodbridge.ai' },
    update: {},
    create: {
      email: 'admin@foodbridge.ai',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      name: 'System Administrator',
      phone: '+919876543210',
      isVerified: true
    }
  });
  console.log(`✓ Admin user verified: ${admin.email}`);

  // 2. Seed Verified Donor
  const donorUser = await prisma.user.upsert({
    where: { email: 'donor@grandpalace.com' },
    update: {},
    create: {
      email: 'donor@grandpalace.com',
      passwordHash: defaultPasswordHash,
      role: 'DONOR',
      name: 'Grand Palace Hotel & Banquets',
      phone: '+919811122233',
      isVerified: true,
      donorProfile: {
        create: {
          organizationName: 'Grand Palace Banquets',
          address: 'Connaught Place, Central Delhi',
          latitude: 28.6315,
          longitude: 77.2167,
          contactPerson: 'Chef Rajesh Sharma'
        }
      }
    }
  });
  console.log(`✓ Donor user created: ${donorUser.email}`);

  // 3. Seed Verified NGO Shelter
  const ngoUser = await prisma.user.upsert({
    where: { email: 'shelter@hopehaven.org' },
    update: {},
    create: {
      email: 'shelter@hopehaven.org',
      passwordHash: defaultPasswordHash,
      role: 'NGO',
      name: 'Hope Haven Community Shelter',
      phone: '+919822233344',
      isVerified: true,
      ngoProfile: {
        create: {
          organizationName: 'Hope Haven Foundation',
          registrationNumber: 'NGO-DEL-2024-8841',
          address: 'Karol Bagh, New Delhi',
          latitude: 28.6521,
          longitude: 77.1906,
          capacity: 150,
          dietaryPreferences: 'ALL',
          operatingHours: '07:00 - 23:00'
        }
      }
    }
  });
  console.log(`✓ NGO user created: ${ngoUser.email}`);

  // 4. Seed Volunteer Courier
  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@foodbridge.ai' },
    update: {},
    create: {
      email: 'volunteer@foodbridge.ai',
      passwordHash: defaultPasswordHash,
      role: 'VOLUNTEER',
      name: 'Aarav Mehta',
      phone: '+919833344455',
      isVerified: true,
      volunteerProfile: {
        create: {
          vehicleType: 'Eco EV Scooter',
          carryingCapacityKg: 35.0,
          isAvailable: true,
          latitude: 28.635,
          longitude: 77.21,
          points: 120,
          completedDeliveries: 4
        }
      }
    }
  });
  console.log(`✓ Volunteer user created: ${volunteerUser.email}`);

  // 5. Seed Sample Active Food Donation with AI Freshness Analysis
  const consumeTime = new Date();
  consumeTime.setHours(consumeTime.getHours() + 6);

  const donation = await prisma.foodDonation.create({
    data: {
      donorId: donorUser.id,
      foodName: 'Gourmet Catering Dal Makhani & Jeera Rice',
      foodType: 'Cooked Meals',
      quantity: 28.0,
      unit: 'kg',
      peopleFedCount: 70,
      preparationTime: new Date(),
      consumeBefore: consumeTime,
      description: 'Freshly prepared buffet surplus from afternoon corporate conference. Packaged in thermal containers.',
      imageUrl: '/ai_food_match.jpg',
      pickupAddress: 'Connaught Place, Central Delhi',
      latitude: 28.6315,
      longitude: 77.2167,
      status: 'AVAILABLE',
      analysis: {
        create: {
          freshnessScore: 92,
          condition: 'EXCELLENT',
          confidence: 0.94,
          checks: [
            { category: 'Color & Vibrancy', pass: true, description: 'Natural golden tone', confidence: 0.95 },
            { category: 'Mold & Spoilage', pass: true, description: 'Zero fungal growth', confidence: 0.98 },
            { category: 'Thermal Packaging', pass: true, description: 'Sealed stainless containers', confidence: 0.91 }
          ],
          disclaimer: 'AI-assisted visual freshness assessment, not a guarantee of food safety.',
          rawResult: { engine: 'FoodBridge-Vision-v1.2', temperatureC: 64.2 }
        }
      }
    }
  });
  console.log(`✓ Seeded Food Donation with AI Analysis: ${donation.foodName} (${donation.id})`);

  // 6. Seed Welcome Notification for Donor
  await prisma.notification.create({
    data: {
      userId: donorUser.id,
      title: 'Welcome to FoodBridge AI!',
      message: 'Your donor profile is active. You can list surplus food anytime to connect with nearby shelters.',
      type: 'SYSTEM'
    }
  });

  console.log('✨ FoodBridge AI Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
