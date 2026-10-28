const axios = require('axios');
const { prisma } = require('./src/config/db');

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  validateStatus: () => true
});

async function runTests() {
  console.log('==================================================');
  console.log('🧪 Running FoodBridge AI Auth & Database Integration Tests');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testAccounts = [
    {
      name: 'Fresh Harvest Bistro',
      email: `donor_${timestamp}@test.com`,
      password: 'Password123!',
      role: 'DONOR',
      phone: '+1 (555) 111-2222',
      address: '100 Gourmet Way',
      organizationName: 'Fresh Harvest Bistro'
    },
    {
      name: 'Hope Community Shelter',
      email: `ngo_${timestamp}@test.com`,
      password: 'Password123!',
      role: 'NGO',
      phone: '+1 (555) 333-4444',
      address: '200 Shelter Blvd',
      organizationName: 'Hope Community Shelter'
    },
    {
      name: 'Alex Rivera',
      email: `volunteer_${timestamp}@test.com`,
      password: 'Password123!',
      role: 'VOLUNTEER',
      phone: '+1 (555) 555-6666',
      address: 'Sector 7'
    },
    {
      name: 'System Administrator',
      email: `admin_${timestamp}@test.com`,
      password: 'Password123!',
      role: 'ADMIN',
      phone: '+1 (555) 777-8888'
    }
  ];

  const tokens = {};

  // 1. Test Registration
  console.log('--- 1. Testing Registration for All Roles ---');
  for (const acc of testAccounts) {
    const res = await API.post('/auth/register', acc);
    assert(res.status === 201, `POST /api/auth/register [${acc.role}]: HTTP 201 Created`);
    assert(res.data.success === true, `Registration returned success: true`);
    assert(res.data.data && res.data.data.token, `JWT token generated`);
    assert(res.data.data.user && res.data.data.user.role === acc.role, `User role is ${acc.role}`);
    assert(res.data.data.user.passwordHash === undefined, `passwordHash is NOT exposed in registration response`);
    tokens[acc.role] = res.data.data.token;
  }

  // 2. Test PostgreSQL Persistence
  console.log('\n--- 2. Verifying PostgreSQL Records via Prisma ---');
  for (const acc of testAccounts) {
    const dbUser = await prisma.user.findUnique({
      where: { email: acc.email.toLowerCase() },
      include: { donorProfile: true, ngoProfile: true, volunteerProfile: true }
    });
    assert(dbUser !== null, `PostgreSQL record exists for ${acc.role} (${acc.email})`);
    assert(dbUser.role === acc.role, `PostgreSQL role matches: ${dbUser.role}`);
    assert(dbUser.name === acc.name, `PostgreSQL name matches: ${dbUser.name}`);
    if (acc.role === 'DONOR') {
      assert(dbUser.donorProfile !== null, `DonorProfile created in PostgreSQL`);
    } else if (acc.role === 'NGO') {
      assert(dbUser.ngoProfile !== null, `NGOProfile created in PostgreSQL`);
    } else if (acc.role === 'VOLUNTEER') {
      assert(dbUser.volunteerProfile !== null, `VolunteerProfile created in PostgreSQL`);
    }
  }

  // 3. Test Login
  console.log('\n--- 3. Testing Login for All Accounts ---');
  for (const acc of testAccounts) {
    const res = await API.post('/auth/login', {
      email: acc.email,
      password: acc.password
    });
    assert(res.status === 200, `POST /api/auth/login [${acc.role}]: HTTP 200 OK`);
    assert(res.data.data.token, `Login returned valid JWT token`);
    assert(res.data.data.user.passwordHash === undefined, `passwordHash is NOT exposed in login response`);
  }

  // 4. Test GET /api/auth/me
  console.log('\n--- 4. Testing GET /api/auth/me Session Hydration ---');
  for (const acc of testAccounts) {
    const res = await API.get('/auth/me', {
      headers: { Authorization: `Bearer ${tokens[acc.role]}` }
    });
    assert(res.status === 200, `GET /api/auth/me [${acc.role}]: HTTP 200 OK`);
    assert(res.data.data.email === acc.email.toLowerCase(), `Retrieved user email matches`);
    assert(res.data.data.role === acc.role, `Retrieved user role matches: ${acc.role}`);
    assert(res.data.data.passwordHash === undefined, `passwordHash is NOT exposed in /me response`);
  }

  // 5. Test GET /api/users (Admin Access Control)
  console.log('\n--- 5. Testing GET /api/users Admin Access & Filtering ---');
  
  // Non-admin attempt
  const nonAdminRes = await API.get('/users', {
    headers: { Authorization: `Bearer ${tokens['DONOR']}` }
  });
  assert(nonAdminRes.status === 403, `GET /api/users by non-admin returns 403 Forbidden`);

  // Admin attempt (All Users)
  const adminRes = await API.get('/users', {
    headers: { Authorization: `Bearer ${tokens['ADMIN']}` }
  });
  assert(adminRes.status === 200, `GET /api/users by ADMIN returns 200 OK`);
  assert(Array.isArray(adminRes.data.data), `Users list is an array`);
  assert(adminRes.data.data.length >= 4, `At least 4 users returned`);
  assert(!adminRes.data.data.some(u => u.passwordHash !== undefined), `No password hashes in user list`);

  // Admin filter by DONOR
  const donorFilterRes = await API.get('/users?role=DONOR', {
    headers: { Authorization: `Bearer ${tokens['ADMIN']}` }
  });
  assert(donorFilterRes.status === 200, `GET /api/users?role=DONOR returns 200 OK`);
  assert(donorFilterRes.data.data.every(u => u.role === 'DONOR'), `All filtered users have role DONOR`);

  // Admin filter by NGO
  const ngoFilterRes = await API.get('/users?role=NGO', {
    headers: { Authorization: `Bearer ${tokens['ADMIN']}` }
  });
  assert(ngoFilterRes.status === 200, `GET /api/users?role=NGO returns 200 OK`);
  assert(ngoFilterRes.data.data.every(u => u.role === 'NGO'), `All filtered users have role NGO`);

  // Admin filter by VOLUNTEER
  const volFilterRes = await API.get('/users?role=VOLUNTEER', {
    headers: { Authorization: `Bearer ${tokens['ADMIN']}` }
  });
  assert(volFilterRes.status === 200, `GET /api/users?role=VOLUNTEER returns 200 OK`);
  assert(volFilterRes.data.data.every(u => u.role === 'VOLUNTEER'), `All filtered users have role VOLUNTEER`);

  // Admin filter by ADMIN
  const admFilterRes = await API.get('/users?role=ADMIN', {
    headers: { Authorization: `Bearer ${tokens['ADMIN']}` }
  });
  assert(admFilterRes.status === 200, `GET /api/users?role=ADMIN returns 200 OK`);
  assert(admFilterRes.data.data.every(u => u.role === 'ADMIN'), `All filtered users have role ADMIN`);

  console.log('\n==================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================\n');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
