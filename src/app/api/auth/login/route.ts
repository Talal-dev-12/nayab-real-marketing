import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
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

    let userRecord = await User.findOne({ email: normalizedEmail, active: true }).select('+password');

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

    // Check if email is verified (skip for staff roles created by admin)
    const staffRoles = ['manager', 'superadmin', 'agent'];
    if (!userRecord.emailVerified && !staffRoles.includes(userRecord.role)) {
      return NextResponse.json({
        error: 'Please verify your email address first.',
        requiresVerification: true,
        email: userRecord.email,
      }, { status: 403 });
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

    // Unified cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    // Keep legacy cookie name for robust compatibility
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

