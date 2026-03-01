# 🏠 Nayab Real Marketing - Next.js Website

A full-featured real estate website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at
http://localhost:3000
```

## 🔐 Admin Panel

Access the admin panel at: **http://localhost:3000/admin**

Default credentials:
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ Change these credentials in Settings after first login!

## 📋 Admin Features

| Feature | Description |
|--------|-------------|
| **Dashboard** | Live stats, traffic charts, quick actions |
| **Blog Manager** | Create, edit, publish/unpublish blog posts |
| **Property Manager** | Add, edit, feature, delete properties |
| **Agent Manager** | Manage real estate agents |
| **Messages** | View and reply to contact form submissions |
| **Analytics** | Traffic trends, page views, top content |
| **Settings** | Business info, social links, password change |

## 🌐 Public Pages

| Page | URL |
|------|-----|
| Home | `/` |
| Properties | `/properties` |
| Blog | `/blog` |
| About | `/about` |
| Services | `/services` |
| Agents | `/agents` |
| Contact | `/contact` |

## 🎨 Branding

- **Primary Color:** Red `#c0392b` (Nayab branding)
- **Navy Color:** `#1a2e5a`
- **Font:** Nunito Sans

## 📦 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Analytics charts
- **Lucide React** - Icons
- **localStorage** - Data persistence (upgrade to a database for production)

## 🚀 Production Deployment

For production, replace localStorage with a real database:
- **Database:** MongoDB / PostgreSQL / Supabase
- **Hosting:** Vercel (recommended for Next.js)
- **Image Storage:** Cloudinary / AWS S3

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel
```

## 📁 Project Structure

```
nayab-real-marketing/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx        # About page
│   ├── blog/page.tsx         # Blog listing
│   ├── contact/page.tsx      # Contact form
│   ├── properties/page.tsx   # Properties listing
│   ├── services/page.tsx     # Services page
│   ├── agents/page.tsx       # Agents page
│   └── admin/                # Admin panel
│       ├── page.tsx          # Dashboard
│       ├── blogs/            # Blog management
│       ├── properties/       # Property management
│       ├── agents/           # Agent management
│       ├── messages/         # Contact messages
│       ├── analytics/        # Traffic analytics
│       └── settings/         # Site settings
├── components/
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # PropertyCard, BlogCard
├── lib/
│   └── data.ts               # Data store & defaults
└── types/
    └── index.ts              # TypeScript types
```

---
Built with ❤️ for Nayab Real Marketing
