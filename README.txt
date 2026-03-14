━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NAYAB REAL MARKETING — FILE REPLACEMENT GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each file below, replace the existing file in your
project with the file from the same path in this folder.

─────────────────────────────────────────────────────
  1. PROPERTY DETAIL PAGE  (no agent info, SEO section)
─────────────────────────────────────────────────────
  src/app/properties/[slug]/page.tsx

─────────────────────────────────────────────────────
  2. AGENT PORTAL  (login at /agent/login)
─────────────────────────────────────────────────────
  src/app/agent/layout.tsx
  src/app/agent/page.tsx                  ← dashboard
  src/app/agent/login/page.tsx
  src/app/agent/properties/page.tsx       ← list own properties
  src/app/agent/properties/new/page.tsx   ← add property
  src/app/agent/properties/[id]/page.tsx  ← edit property

─────────────────────────────────────────────────────
  3. WRITER PORTAL  (login at /writer/login)
─────────────────────────────────────────────────────
  src/app/writer/layout.tsx
  src/app/writer/page.tsx                 ← dashboard
  src/app/writer/login/page.tsx
  src/app/writer/blogs/page.tsx           ← list own blogs
  src/app/writer/blogs/new/page.tsx       ← new blog
  src/app/writer/blogs/[id]/page.tsx      ← edit blog

─────────────────────────────────────────────────────
  4. ADMIN PANEL
─────────────────────────────────────────────────────
  src/app/admin/layout.tsx                ← role-filtered sidebar
  src/app/admin/admins/page.tsx           ← superadmin only
  src/app/admin/writers/page.tsx          ← manage agents & writers

─────────────────────────────────────────────────────
  5. API ROUTES  (backend permission enforcement)
─────────────────────────────────────────────────────
  src/app/api/properties/route.ts
  src/app/api/properties/[id]/route.ts
  src/app/api/blogs/route.ts
  src/app/api/blogs/[id]/route.ts
  src/app/api/admins/route.ts
  src/app/api/admins/[id]/route.ts

─────────────────────────────────────────────────────
  6. CORE  (models & auth)
─────────────────────────────────────────────────────
  src/lib/auth-middleware.ts
  src/models/AdminUser.ts
  src/models/Blog.ts
  src/models/Property.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LOGIN URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Super Admin / Admin  →  /admin/login
  Agent                →  /agent/login
  Content Writer       →  /writer/login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
