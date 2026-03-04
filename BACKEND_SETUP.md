# Nayab Real Marketing — Backend Setup Guide

## What Was Added

This project now has a **full backend** with:
- **MongoDB Atlas** database (via Mongoose)
- **JWT Authentication** (email + password)
- **Google OAuth 2.0** login
- **Protected API routes** for all admin operations
- **Role-based access control** (`admin` and `superadmin`)

---

## 📁 New Files & Structure

```
src/
├── lib/
│   ├── mongodb.ts          # MongoDB connection (singleton pattern)
│   ├── jwt.ts              # JWT sign/verify utilities
│   ├── auth-middleware.ts  # requireAuth / requireSuperAdmin wrappers
│   └── api-client.ts       # Frontend API client (auto-attaches JWT)
│
├── models/
│   ├── AdminUser.ts        # Admin user model (with bcrypt password hashing)
│   ├── Blog.ts             # Blog post model
│   ├── Property.ts         # Property listing model
│   ├── Agent.ts            # Real estate agent model
│   └── ContactMessage.ts   # Contact form message model
│
├── scripts/
│   └── seed.ts             # Database seeder (run once)
│
└── app/api/
    ├── auth/
    │   ├── login/          # POST /api/auth/login
    │   ├── logout/         # POST /api/auth/logout
    │   ├── me/             # GET /api/auth/me (verify token)
    │   └── google/
    │       ├── route.ts    # GET /api/auth/google (redirect to Google)
    │       └── callback/   # GET /api/auth/google/callback
    ├── blogs/              # GET (public), POST (protected)
    │   └── [id]/           # GET, PUT, DELETE (protected)
    ├── properties/         # GET (public), POST (protected)
    │   └── [id]/
    ├── agents/             # GET (public), POST (protected)
    │   └── [id]/
    ├── contact/            # POST (public), GET (protected)
    ├── messages/[id]/      # PUT, DELETE (protected)
    └── admins/             # GET, POST (superadmin only)
        └── [id]/           # PUT, DELETE (superadmin only)
```

---

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with read/write access
4. Whitelist your IP (or use `0.0.0.0/0` for all IPs)
5. Click **Connect → Drivers** and copy the connection string
6. Paste it into `.env.local` as `MONGODB_URI`

### 3. Generate a JWT Secret

```bash
openssl rand -base64 64
```

Paste the output as `JWT_SECRET` in `.env.local`.

### 4. Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials**
4. Click **+ Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** into `.env.local`

> **Note:** Google OAuth only works for admins already in the database.  
> Add their email first via `npm run seed` or by creating them as superadmin.

### 5. Seed the Database

```bash
npm run seed
```

This creates:
- A **superadmin** account with the credentials from `.env.local`
- Sample agents, blogs, and properties

### 6. Run the Project

```bash
npm run dev
```

Visit `http://localhost:3000/admin/login`

Default credentials:
- **Email:** `admin@nayabrealmarketing.com`  
- **Password:** `Admin@123456`

---

## 🔐 Authentication Flow

### Email + Password
1. User submits email/password to `POST /api/auth/login`
2. Server validates credentials against MongoDB
3. Server returns a **JWT token** (also sets HTTP-only cookie)
4. Frontend stores token in `localStorage`
5. All subsequent requests include `Authorization: Bearer <token>`

### Google OAuth
1. User clicks "Continue with Google"
2. Redirected to `GET /api/auth/google` → Google's consent screen
3. Google redirects back to `/api/auth/google/callback?code=...`
4. Server exchanges code for user info
5. **User must already exist in DB** (email must match an admin account)
6. Server sets JWT cookie and redirects to `/admin`

---

## 🛡️ Role-Based Access

| Role         | Can do                                      |
|--------------|---------------------------------------------|
| `admin`      | CRUD on blogs, properties, agents, messages |
| `superadmin` | Everything above + manage admin users       |

---

## 📡 Using the API Client

In admin pages, use the provided API client instead of raw `fetch`:

```typescript
import { blogsApi, propertiesApi, messagesApi } from '@/lib/api-client';

// Get all blogs
const { blogs } = await blogsApi.list({ published: 'true' });

// Create a property (token auto-attached)
await propertiesApi.create({ title: 'My Property', ... });

// Mark message as read
await messagesApi.markRead(messageId);
```

---

## 🌐 Production Deployment

1. Deploy to **Vercel** (recommended for Next.js)
2. Add all `.env.local` variables to Vercel's environment settings
3. Update `NEXTAUTH_URL` to your production domain
4. Update `GOOGLE_REDIRECT_URI` to production callback URL
5. In Google Cloud Console, add production redirect URI
6. Run seed script once via Vercel CLI or locally pointing to production DB

---

## 🗄️ MongoDB Collections

| Collection       | Description                  |
|------------------|------------------------------|
| `adminusers`     | Admin/superadmin accounts    |
| `blogs`          | Blog posts                   |
| `properties`     | Property listings            |
| `agents`         | Real estate agents           |
| `contactmessages`| Contact form submissions     |
