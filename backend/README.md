# FoodBridge AI — Backend API

An enterprise-grade RESTful backend built with **Node.js, Express.js, Prisma ORM, and PostgreSQL**, coupled with a **Python FastAPI AI** service for automated food freshness analysis.

Connecting hotels, restaurants, caterers, and corporate canteens with surplus food to local NGO shelters and verified volunteer couriers.

---

## 🛠️ Technology Stack

* **Runtime & Framework**: Node.js (v18+) & Express.js
* **Database & ORM**: PostgreSQL & Prisma ORM
* **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
* **AI Freshness Engine**: Python 3.10+ & FastAPI
* **File & Media Storage**: Cloudinary (with local stream fallback)
* **Location & Routing**: Haversine distance engine with Google Maps & Mapbox adapters
* **Security & Hardening**: Helmet, CORS, Express-Rate-Limit, Express-Validator

---

## 👥 Platform Roles

| Role | Permissions & Description |
| :--- | :--- |
| **DONOR** | Creates and manages surplus food listings, uploads photos, reviews NGO requests, accepts requests to generate delivery missions. |
| **NGO** | Browses available food, finds nearest donations, requests food, tracks delivery, verifies and confirms food arrival. |
| **VOLUNTEER** | Browses available delivery jobs, accepts delivery missions, updates transit status (`PICKED_UP`, `IN_TRANSIT`, `DELIVERED`), earns impact reward points. |
| **ADMIN** | System-wide audit and analytics, views all users, donations, and deliveries, verifies NGO/Volunteer credentials, computes live platform statistics. |

---

## 🔄 Complete Core Lifecycle Flow

```text
1. Donor lists surplus food (POST /api/donations) with photo
2. Backend calls AI Vision Service (POST /analyse-food)
3. Freshness score, condition rating, and shelf life attached to donation
4. Nearby NGOs automatically discovered and notified
5. NGO requests available food (POST /api/donations/:id/request)
6. Donor accepts request (POST /api/donations/:id/accept-request)
   ↳ Delivery mission generated with unique verification tokens
   ↳ Other competing requests automatically rejected
7. Nearby eligible volunteers notified based on carrying capacity
8. Volunteer accepts delivery (POST /api/deliveries/:id/accept)
   ↳ Protected by isolated database transaction against concurrent acceptance
9. Volunteer marks food picked up (PATCH /api/deliveries/:id/status -> PICKED_UP)
10. Volunteer marks food delivered (PATCH /api/deliveries/:id/status -> DELIVERED)
11. NGO confirms receipt at shelter (POST /api/deliveries/:id/confirm)
    ↳ Donation marked COMPLETED
    ↳ Volunteer awarded +50 points and delivery counter incremented
```

---

## 🚀 Quick Start & Setup

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/foodbridge_db?schema=public"
```

### 2. Install Dependencies & Generate Prisma Client
```bash
npm install
npx prisma generate
```

### 3. Push Database Schema & Seed Initial Data
```bash
# Push schema tables and relationships to PostgreSQL
npx prisma db push

# Seed Admin, Donors, NGOs, Volunteers, and sample food donations
npm run prisma:seed
```

### 4. Start the Server
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```
The server will start on `http://localhost:5000` (or `PORT` configured in `.env`).

---

## 📚 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user (`DONOR`, `NGO`, `VOLUNTEER`, `ADMIN`) with role profile.
* `POST /api/auth/login` — Authenticate user and receive signed JWT token.
* `GET  /api/auth/me` — Retrieve current authenticated user and profile details.

### 🍲 Food Donations (`/api/donations`)
* `POST   /api/donations` — (*Donor*) Create food donation with photo and AI analysis.
* `GET    /api/donations` — Get paginated donations with filters (`status`, `foodType`, `search`).
* `GET    /api/donations/nearby` — Spatial radius search (`latitude`, `longitude`, `radiusKm`).
* `GET    /api/donations/:id` — Get donation details, donor contact, AI analysis, requests.
* `PATCH  /api/donations/:id` — (*Donor*) Update donation details if status is `AVAILABLE`.
* `DELETE /api/donations/:id` — (*Donor*) Cancel donation if not actively in transit.
* `GET    /api/donations/:id/match-ngos` — (*Donor*) Smart matching algorithm ranking nearby NGOs.
* `POST   /api/donations/:id/request` — (*NGO*) Request an available food donation.
* `POST   /api/donations/:id/accept-request` — (*Donor*) Accept an NGO's request and create delivery task.

### 🏢 NGO Operations (`/api/ngo`)
* `GET  /api/ngo/requests` — View all requests submitted by the authenticated NGO.
* `GET  /api/ngo/donations` — View donations allocated to this NGO.
* `GET  /api/ngos/nearby` — Find NGO shelters near coordinates.

### 🛵 Volunteer & Delivery (`/api/volunteer` & `/api/deliveries`)
* `GET   /api/volunteer/jobs` — View available deliveries matching carrying capacity.
* `GET   /api/volunteer/deliveries` — View active and completed deliveries for courier.
* `POST  /api/deliveries/:id/accept` — Accept delivery mission (*isolated atomic transaction*).
* `PATCH /api/deliveries/:id/status` — Advance status (`PICKED_UP` → `IN_TRANSIT` → `DELIVERED`).
* `POST  /api/deliveries/:id/confirm` — (*NGO*) Confirm safe food arrival at shelter.

### 🔔 Notifications (`/api/notifications`)
* `GET   /api/notifications` — View user's notifications.
* `PATCH /api/notifications/:id/read` — Mark notification read.
* `PATCH /api/notifications/read-all` — Mark all read.

### 🛡️ Administrator (`/api/admin`)
* `GET   /api/admin/users` — List all registered users with role and verification filters.
* `GET   /api/admin/donations` — System-wide donations audit.
* `GET   /api/admin/deliveries` — Complete delivery logs.
* `GET   /api/admin/statistics` — Live platform statistics calculated directly from database.
* `PATCH /api/admin/users/:id/verify` — Approve and verify NGO or Volunteer accounts.

---

## 🔒 Security & Concurrency Design

1. **Race Condition Prevention**:
   Two volunteers accepting the same delivery task simultaneously is strictly prevented using an isolated Prisma database transaction (`prisma.$transaction`) that verifies `status === 'PENDING'` and `volunteerId === null` before updating.
2. **State Machine Integrity**:
   Donation and Delivery status transitions are strictly validated against transition state machines to prevent invalid jumps (e.g. requesting already delivered or expired food).
3. **Password Security**:
   Passwords hashed using bcrypt with work factor 10.
4. **Input Validation**:
   Every endpoint validates incoming payloads via `express-validator` before reaching controller logic.
