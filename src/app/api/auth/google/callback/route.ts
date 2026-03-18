import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { User } from '@/models/User';
import { signToken, getRedirectByRole } from '@/lib/jwt';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

function setAuthCookies(response: NextResponse, token: string) {
  const cookieOpts = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge:   7 * 24 * 60 * 60,
    path:     '/',
  };
  response.cookies.set('auth_token',  token, cookieOpts);
  response.cookies.set('admin_token', token, cookieOpts); // legacy compat
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/sign-in?error=google_denied', req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  process.env.GOOGLE_REDIRECT_URI!,
        grant_type:    'authorization_code',
      }),
    });

    const tokens: GoogleTokenResponse = await tokenRes.json();
    if (tokens.error) {
      console.error('Google token error:', tokens.error);
      return NextResponse.redirect(new URL('/sign-in?error=token_failed', req.url));
    }

    // Fetch Google profile
    const userRes    = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser: GoogleUserInfo = await userRes.json();

    if (!googleUser.email_verified) {
      return NextResponse.redirect(new URL('/sign-in?error=email_not_verified', req.url));
    }

    await connectDB();

    const normalizedEmail = googleUser.email.toLowerCase();

    // ── 1. Check staff (AdminUser) first ─────────────────────────────────────
    let staffUser = await AdminUser.findOne({ email: normalizedEmail });

    if (staffUser) {
      if (!staffUser.active) {
        return NextResponse.redirect(new URL('/sign-in?error=account_disabled', req.url));
      }

      staffUser.googleId  = googleUser.sub;
      staffUser.avatar    = staffUser.avatar || googleUser.picture;
      staffUser.lastLogin = new Date();
      if (!staffUser.name) staffUser.name = googleUser.name;
      await staffUser.save();

      const token      = signToken({
        id:    staffUser._id.toString(),
        email: staffUser.email,
        role:  staffUser.role,
        name:  staffUser.name,
      });
      const redirectTo = getRedirectByRole(staffUser.role);
      return setAuthCookies(
        NextResponse.redirect(new URL(redirectTo, req.url)),
        token
      );
    }

    // ── 2. Check or create public User ───────────────────────────────────────
    let publicUser = await User.findOne({ email: normalizedEmail });

    if (!publicUser) {
      // Auto-register new Google user as role: "user"
      publicUser = await User.create({
        name:     googleUser.name,
        email:    normalizedEmail,
        role:     'user',
        googleId: googleUser.sub,
        avatar:   googleUser.picture,
      });
    }

    if (!publicUser.active) {
      return NextResponse.redirect(new URL('/sign-in?error=account_disabled', req.url));
    }

    publicUser.googleId  = googleUser.sub;
    publicUser.avatar    = publicUser.avatar || googleUser.picture;
    publicUser.lastLogin = new Date();
    await publicUser.save();

    const token = signToken({
      id:    publicUser._id.toString(),
      email: publicUser.email,
      role:  publicUser.role,
      name:  publicUser.name,
    });

    return setAuthCookies(
      NextResponse.redirect(new URL('/', req.url)),
      token
    );
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/sign-in?error=server_error', req.url));
  }
}
