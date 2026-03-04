import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { signToken } from '@/lib/jwt';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/admin/login?error=google_denied', req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    const tokens: GoogleTokenResponse = await tokenRes.json();

    if (tokens.error) {
      console.error('Google token error:', tokens.error);
      return NextResponse.redirect(new URL('/admin/login?error=token_failed', req.url));
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser: GoogleUserInfo = await userRes.json();

    if (!googleUser.email_verified) {
      return NextResponse.redirect(new URL('/admin/login?error=email_not_verified', req.url));
    }

    await connectDB();

    // Check if an admin with this email exists
    let user = await AdminUser.findOne({ email: googleUser.email.toLowerCase() });

    if (!user) {
      // Only allow Google sign-in if the email is pre-approved
      // i.e., user must already exist in the DB (created by superadmin)
      return NextResponse.redirect(new URL('/admin/login?error=not_authorized', req.url));
    }

    if (!user.active) {
      return NextResponse.redirect(new URL('/admin/login?error=account_disabled', req.url));
    }

    // Update Google info
    user.googleId = googleUser.sub;
    user.avatar = user.avatar || googleUser.picture;
    user.lastLogin = new Date();
    if (!user.name) user.name = googleUser.name;
    await user.save();

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.redirect(new URL('/admin', req.url));

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/admin/login?error=server_error', req.url));
  }
}
