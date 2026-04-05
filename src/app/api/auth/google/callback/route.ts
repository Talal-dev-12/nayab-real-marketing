import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
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

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser: GoogleUserInfo = await userRes.json();

    if (!googleUser.email_verified) {
      return NextResponse.redirect(new URL('/sign-in?error=email_not_verified', req.url));
    }

    await connectDB();

    const normalizedEmail = googleUser.email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name:     googleUser.name,
        email:    normalizedEmail,
        role:     'user',
        googleId: googleUser.sub,
        avatar:   googleUser.picture,
      });
    }

    if (!user.active) {
      return NextResponse.redirect(new URL('/sign-in?error=account_disabled', req.url));
    }

    user.googleId  = googleUser.sub;
    user.avatar    = user.avatar || googleUser.picture;
    user.lastLogin = new Date();
    if (!user.name) user.name = googleUser.name;
    await user.save();

    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    });

    const redirectTo = getRedirectByRole(user.role);

    return setAuthCookies(
      NextResponse.redirect(new URL(redirectTo, req.url)),
      token
    );
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/sign-in?error=server_error', req.url));
  }
}

