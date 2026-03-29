/**
 * RBAC — Role-Based Access Control
 * ─────────────────────────────────
 * This is the single source of truth for:
 *   • Which nav items each role can see
 *   • Which features/actions each role can perform
 *
 * Add new roles or permissions here — never scatter role checks across files.
 */

import { UserRole } from './jwt';

// ── Nav item definition ───────────────────────────────────────────────────────
export interface NavItem {
  href:   string;
  label:  string;
  icon:   string;   // lucide icon name — resolved in layout
  roles:  UserRole[];
}

export const ALL_NAV: NavItem[] = [
  // Dashboard home — every portal role
  { href: '/dashboard',                label: 'Dashboard',    icon: 'LayoutDashboard', roles: ['admin','superadmin','seller','writer'] },

  // Properties — admin/superadmin see all; seller sees own
  { href: '/dashboard/properties',     label: 'Properties',   icon: 'Home',            roles: ['admin','superadmin','seller'] },
  { href: '/dashboard/properties/new', label: 'Add Property', icon: 'PlusSquare',      roles: ['admin','superadmin','seller'] },

  // Blogs — admin/superadmin see all; writer sees own
  { href: '/dashboard/blogs',          label: 'Blog Posts',   icon: 'FileText',        roles: ['admin','superadmin','writer'] },
  { href: '/dashboard/blogs/new',      label: 'New Article',  icon: 'PenLine',         roles: ['admin','superadmin','writer'] },

  // Admin-only sections
  { href: '/dashboard/agents',         label: 'Agents',       icon: 'Users',           roles: ['admin','superadmin'] },
  { href: '/dashboard/writers',        label: 'Portal Users', icon: 'PenTool',         roles: ['admin','superadmin'] },
  { href: '/dashboard/messages',       label: 'Messages',     icon: 'MessageSquare',   roles: ['admin','superadmin'] },
  { href: '/dashboard/inquiries',      label: 'Inquiries',    icon: 'Send',            roles: ['admin','superadmin'] },
  { href: '/dashboard/analytics',      label: 'Analytics',    icon: 'BarChart3',       roles: ['admin','superadmin'] },

  // Superadmin-only
  { href: '/dashboard/admins',         label: 'Admin Users',  icon: 'ShieldCheck',     roles: ['superadmin'] },
  { href: '/dashboard/settings',       label: 'Settings',     icon: 'Settings',        roles: ['superadmin'] },
];

// ── Permission flags per role ─────────────────────────────────────────────────
export interface RolePermissions {
  /** Can see and manage ALL properties */
  manageAllProperties:  boolean;
  /** Can submit their own properties */
  submitOwnProperties:  boolean;
  /** Can feature/unfeature properties */
  featureProperties:    boolean;
  /** Can delete any property */
  deleteAnyProperty:    boolean;
  /** Can see and manage ALL blogs */
  manageAllBlogs:       boolean;
  /** Can create/edit their own blogs */
  writeOwnBlogs:        boolean;
  /** Can publish/unpublish any blog */
  publishAnyBlog:       boolean;
  /** Can access user/admin management */
  manageUsers:          boolean;
  /** Can access site settings */
  manageSettings:       boolean;
  /** Can assign the "agent" on a property listing */
  assignAgent:          boolean;
  /** Can mark a property as featured */
  markFeatured:         boolean;
}

const PERMISSIONS: Record<UserRole, RolePermissions> = {
  superadmin: {
    manageAllProperties: true,  submitOwnProperties: true,
    featureProperties:   true,  deleteAnyProperty:   true,
    manageAllBlogs:      true,  writeOwnBlogs:       true,
    publishAnyBlog:      true,  manageUsers:         true,
    manageSettings:      true,  assignAgent:         true,
    markFeatured:        true,
  },
  admin: {
    manageAllProperties: true,  submitOwnProperties: true,
    featureProperties:   true,  deleteAnyProperty:   true,
    manageAllBlogs:      true,  writeOwnBlogs:       true,
    publishAnyBlog:      true,  manageUsers:         true,
    manageSettings:      false, assignAgent:         true,
    markFeatured:        true,
  },
  seller: {
    manageAllProperties: false, submitOwnProperties: true,
    featureProperties:   false, deleteAnyProperty:   false,
    manageAllBlogs:      false, writeOwnBlogs:       false,
    publishAnyBlog:      false, manageUsers:         false,
    manageSettings:      false, assignAgent:         false,
    markFeatured:        false,
  },
  writer: {
    manageAllProperties: false, submitOwnProperties: false,
    featureProperties:   false, deleteAnyProperty:   false,
    manageAllBlogs:      false, writeOwnBlogs:       true,
    publishAnyBlog:      false, manageUsers:         false,
    manageSettings:      false, assignAgent:         false,
    markFeatured:        false,
  },
  agent: {
    manageAllProperties: false, submitOwnProperties: true,
    featureProperties:   false, deleteAnyProperty:   false,
    manageAllBlogs:      false, writeOwnBlogs:       false,
    publishAnyBlog:      false, manageUsers:         false,
    manageSettings:      false, assignAgent:         false,
    markFeatured:        false,
  },
  user: {
    manageAllProperties: false, submitOwnProperties: false,
    featureProperties:   false, deleteAnyProperty:   false,
    manageAllBlogs:      false, writeOwnBlogs:       false,
    publishAnyBlog:      false, manageUsers:         false,
    manageSettings:      false, assignAgent:         false,
    markFeatured:        false,
  },
};

export function can(role: UserRole, permission: keyof RolePermissions): boolean {
  return PERMISSIONS[role]?.[permission] ?? false;
}

// ── Role metadata (labels, colours) ──────────────────────────────────────────
export const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
  admin:      { label: 'Admin',       color: 'bg-red-100    text-red-700'    },
  seller:     { label: 'Seller',      color: 'bg-amber-100  text-amber-700'  },
  writer:     { label: 'Writer',      color: 'bg-blue-100   text-blue-700'   },
  agent:      { label: 'Agent',       color: 'bg-green-100  text-green-700'  },
  user:       { label: 'User',        color: 'bg-slate-100  text-slate-700'  },
};

// Roles that are allowed inside the /dashboard panel
export const PANEL_ROLES: UserRole[] = ['admin', 'superadmin', 'seller', 'writer', 'agent'];
