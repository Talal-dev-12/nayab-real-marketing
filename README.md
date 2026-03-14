# Nayab Real Marketing

A full-stack real estate platform built with **Next.js 15**, **MongoDB Atlas**, and **Tailwind CSS**. It includes a public-facing website for property listings and blog content, plus four separate role-based portals — Super Admin, Admin, Agent, and Content Writer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Styling | Tailwind CSS |
| Auth | JWT (jsonwebtoken) + Google OAuth |
| Image Uploads | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx                    # Home
│   │   ├── properties/                 # Listings + detail
│   │   ├── blog/                       # Blog listing + detail
│   │   ├── blogs/areas/                # Browse by area
│   │   ├── blogs/schemes/              # Browse by scheme
│   │   ├── agents/                     # Public agents page
│   │   ├── contact/
│   │   ├── about/
│   │   ├── services/
│   │   ├── tools/                      # Calculators & tools
│   │   ├── privacy-policy/
│   │   └── terms-of-service/
│   │
│   ├── admin/                          # Admin panel (admin + superadmin)
│   │   ├── login/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── properties/
│   │   ├── blogs/
│   │   ├── agents/
│   │   ├── writers/                    # Manage portal users
│   │   ├── admins/                     # Superadmin only
│   │   ├── messages/
│   │   ├── analytics/
│   │   ├── traffic/
│   │   └── settings/                   # Superadmin only
│   │
│   ├── agent/                          # Agent portal
│   │   ├── login/
│   │   ├── page.tsx                    # Dashboard
│   │   └── properties/                 # Own listings only
│   │
│   ├── writer/                         # Content writer portal
│   │   ├── login/
│   │   ├── page.tsx                    # Dashboard
│   │   └── blogs/                      # Own articles only
│   │
│   └── api/
│       ├── auth/login, logout, me, google/
│       ├── properties/[id]/
│       ├── blogs/[id]/taxonomy/
│       ├── agents/[id]/
│       ├── admins/[id]/
│       ├── contact/
│       ├── messages/[id]/
│       ├── upload/
│       └── analytics/
│
├── components/
│   ├── layout/                         # Navbar, Footer, PublicLayout
│   ├── sections/                       # Hero, Featured, CTA, etc.
│   └── ui/                             # Cards, Skeletons
│
├── lib/
│   ├── mongodb.ts                      # DB connection
│   ├── jwt.ts                          # Token sign/verify
│   ├── auth-middleware.ts              # Route guards
│   ├── api-client.ts                   # Frontend fetch wrapper
│   └── mailer.ts                       # Nodemailer helper
│
├── models/
│   ├── AdminUser.ts
│   ├── Agent.ts
│   ├── Blog.ts
│   ├── Property.ts
│   └── ContactMessage.ts
│
├── types/index.ts
└── scripts/seed.ts                     # DB seed script
```

---

## Getting Started

### 1. Clone & install

```bash
git clone <repository-url>
cd nayab-real-marketing
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# ── MongoDB Atlas ──────────────────────────────────────────────────────────
# cloud.mongodb.com → Cluster → Connect → Drivers
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/?appName=Cluster0"

# ── JWT ────────────────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 64
JWT_SECRET="your-super-secret-jwt-key"

# ── App URL ────────────────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"

# ── Seed credentials (used by npm run seed) ────────────────────────────────
ADMIN_EMAIL="admin@nayabrealmarketing.com"
ADMIN_PASSWORD="Admin@123456"

# ── Google OAuth ───────────────────────────────────────────────────────────
# console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client ID
# Authorised redirect URI: http://localhost:3000/api/auth/google/callback
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# ── Cloudinary (image uploads) ─────────────────────────────────────────────
# cloudinary.com → Dashboard → API Environment Variables
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
# Settings → Upload → Upload Presets → Add preset → Signing Mode: Unsigned
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# ── Email / SMTP ───────────────────────────────────────────────────────────
# Gmail: enable 2FA → Google Account → Security → App Passwords → generate
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
```

### 3. Seed the database

```bash
npm run seed
```

Inserts: 1 superadmin, 10 agents, 50 properties, 25 blog posts, 20 contact messages.

To wipe and reseed everything from scratch:

```bash
npm run seed -- --force
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Login URLs

| Portal | URL | Role |
|---|---|---|
| Admin / Super Admin | `/admin/login` | `admin` or `superadmin` |
| Agent | `/agent/login` | `agent` |
| Content Writer | `/writer/login` | `writer` |

**Default seed credentials**
- Email: `admin@nayabrealmarketing.com`
- Password: `Admin@123456`

---

## Role Permissions

### Super Admin
- Full access to everything
- Create, activate/deactivate, and delete admin accounts
- Manage all portal users (agents and writers)
- Access Settings page
- View all agent and writer performance data
- Cannot delete another Super Admin

### Admin
- Manage properties, blogs, agents, portal users, messages, analytics
- Cannot access Admin Users page or Settings page
- Cannot create or delete admin/superadmin accounts

### Agent
- Login at `/agent/login`
- Add, edit, and delete **only their own** property listings
- Dashboard with personal stats (listings, views, sold/rented)
- No access to blogs, messages, other agents, or settings

### Content Writer
- Login at `/writer/login`
- Create, edit, and delete **only their own** blog articles
- Dashboard with article count, total views, and average views
- No access to properties, agents, messages, or settings

---

## Public Pages

| Route | Description |
|---|---|
| `/` | Home — hero, featured properties, latest blogs |
| `/properties` | All listings with filters |
| `/properties/[slug]` | Property detail with SEO section + contact form |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog article |
| `/blogs/areas` | Browse blogs by Karachi area |
| `/blogs/areas/[area]` | Blogs for a specific area |
| `/blogs/schemes` | Browse blogs by housing scheme |
| `/blogs/schemes/[scheme]` | Blogs for a specific scheme |
| `/agents` | All active agents |
| `/contact` | Contact form |
| `/tools/loan-calculator` | Mortgage calculator |
| `/tools/area-converter` | sq ft ↔ sq yd ↔ marla ↔ kanal |
| `/tools/construction-calculator` | Construction cost estimator |
| `/tools/property-index` | Property price index |
| `/tools/property-trends` | Market trend charts |

---

## API Reference

All write endpoints require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Email + password login, returns JWT |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Get current user from token |
| GET | `/api/auth/google` | Redirect to Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback, issues JWT |

### Properties

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | List. Params: `slug`, `type`, `city`, `priceType`, `status`, `featured`, `page`, `limit` |
| POST | `/api/properties` | Authenticated | Create. Agents auto-set as owner |
| GET | `/api/properties/[id]` | Public | Get by ID |
| PUT | `/api/properties/[id]` | Auth — agents own-only | Update |
| DELETE | `/api/properties/[id]` | Auth — agents own-only | Delete |

### Blogs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/blogs` | Public | List. Params: `slug`, `category`, `published`, `area`, `scheme`, `page`, `limit` |
| POST | `/api/blogs` | Authenticated | Create. Writers auto-tagged as author |
| GET | `/api/blogs/taxonomy` | Public | All areas and schemes with blog counts |
| GET | `/api/blogs/[id]` | Public | Get by ID |
| PUT | `/api/blogs/[id]` | Auth — writers own-only | Update |
| DELETE | `/api/blogs/[id]` | Auth — writers own-only | Delete |

### Agents

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/agents` | Public | List. Filter: `?active=true` |
| POST | `/api/agents` | Authenticated | Create |
| GET | `/api/agents/[id]` | Public | Get by ID |
| PUT | `/api/agents/[id]` | Authenticated | Update |
| DELETE | `/api/agents/[id]` | Authenticated | Delete |

### Admin Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admins` | Admin+ | Superadmin sees all; Admin sees agents/writers only |
| POST | `/api/admins` | Admin+ | Create. Admin cannot create admin/superadmin roles |
| PUT | `/api/admins/[id]` | Admin+ | Update. Admin cannot modify admin/superadmin accounts |
| DELETE | `/api/admins/[id]` | Admin+ | Delete. Superadmin cannot delete other superadmins |

### Contact & Messages

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Submit inquiry. Sends email to all active admins |
| GET | `/api/contact` | Authenticated | List all messages |
| PUT | `/api/messages/[id]` | Authenticated | Mark read/unread |
| DELETE | `/api/messages/[id]` | Authenticated | Delete |

### Upload

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload` | Authenticated | Upload image to Cloudinary. Max 5 MB. Returns `{ url }` |

---

## Data Models

### AdminUser
```
name, email, password (bcrypt hashed), role (superadmin | admin | agent | writer),
googleId, avatar, active, lastLogin
```

### Agent
```
name, email, phone, image (Cloudinary URL), bio, specialization,
properties (count), active
```

### Property
```
title, slug, description, price, priceType (sale | rent), rentPeriod (month | year),
location, city, area (sqft), bedrooms, bathrooms,
type (residential | commercial | office | plot),
status (available | sold | rented), images[], featured, agentId, views
```

### Blog
```
title, slug, excerpt, content (HTML), image, images[],
author, authorId, category, tags[], published, views,
areaSlug, areaLabel, schemeSlug, schemeLabel,
metaTitle, metaDescription, metaKeywords
```

### ContactMessage
```
name, email, phone, subject, message, read
```

---

## Setup Guides

### MongoDB Atlas
1. [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Database Access → Add user with read/write permissions
3. Network Access → Add IP `0.0.0.0/0` (allow from anywhere)
4. Cluster → Connect → Drivers → copy connection string
5. Replace `<password>` in the string with your database user password

### Cloudinary
1. [cloudinary.com](https://cloudinary.com) → Create free account
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Settings → Upload → Upload Presets → Add upload preset
4. Set **Signing Mode to Unsigned** → save the preset name

### Google OAuth
1. [console.cloud.google.com](https://console.cloud.google.com) → Create project
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID → Web Application
3. Authorised Redirect URI: `http://localhost:3000/api/auth/google/callback`
4. For production: also add `https://yourdomain.com/api/auth/google/callback`

### Gmail SMTP
1. Enable 2-Factor Authentication on your Google account
2. Google Account → Security → 2-Step Verification → App Passwords
3. Generate a password for "Mail"
4. Use the 16-character app password as `SMTP_PASS`

---

## Deployment on Vercel

1. Push the repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all `.env.local` variables in the Vercel project settings
4. Update `NEXTAUTH_URL` and `GOOGLE_REDIRECT_URI` to your production domain
5. Deploy

> The seed script runs locally only. Run `npm run seed` against your Atlas cluster before or after deploying.

---

## Scripts

```bash
npm run dev                  # Development server on localhost:3000
npm run build                # Type-check and build for production
npm start                    # Production server
npm run seed                 # Seed database (skips if data already exists)
npm run seed -- --force      # Wipe and reseed all collections
```