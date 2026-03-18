import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

// All roles in the system
export type UserRole = 'user' | 'seller' | 'agent' | 'writer' | 'admin' | 'superadmin';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns the redirect path for a given role after login.
 * - Normal users  → homepage (can browse freely)
 * - All staff/portal roles → /dashboard (role-aware modules built next step)
 */
export function getRedirectByRole(role: UserRole): string {
  if (role === 'user') return '/';
  return '/dashboard';
}
