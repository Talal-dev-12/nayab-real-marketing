import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { User } from '@/models/User';
import { signToken, getRedirectByRole } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // ── 1. Check public User collection first ────────────────────────────────
    let userRecord = await User.findOne({ email: normalizedEmail, active: true }).select('+password');
    let isPublicUser = true;

    // ── 2. Fall back to AdminUser (staff: admin, superadmin, writer, agent, seller) ──
    if (!userRecord) {
      userRecord = await AdminUser.findOne({ email: normalizedEmail, active: true }).select('+password');
      isPublicUser = false;
    }

    if (!userRecord) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!userRecord.password) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please continue with Google.' },
        { status: 401 }
      );
    }

    const isValid = await userRecord.comparePassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update last login
    userRecord.lastLogin = new Date();
    await userRecord.save();

    const token = signToken({
      id:    userRecord._id.toString(),
      email: userRecord.email,
      role:  userRecord.role,
      name:  userRecord.name,
    });

    const redirectTo = getRedirectByRole(userRecord.role);

    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id:     userRecord._id,
        name:   userRecord.name,
        email:  userRecord.email,
        role:   userRecord.role,
        avatar: userRecord.avatar || null,
      },
      token,
    });

    // Unified cookie — used by auth-middleware on API routes
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    // Keep legacy cookie name so existing admin/agent/writer layouts
    // (which send it as Authorization: Bearer) continue to work
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
