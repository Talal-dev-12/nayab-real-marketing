import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { signToken } from '@/lib/jwt';

/** Where each role should be redirected after login */
function redirectFor(role: string): string {
  switch (role) {
    case 'superadmin':
    case 'admin':   return '/admin';
    case 'agent':   return '/agent';
    case 'writer':  return '/writer';
    default:        return '/';        // public user
  }
}

/** Cookie name depends on role — keeps existing portal localStorage logic working */
function cookieNameFor(role: string): string {
  switch (role) {
    case 'agent':  return 'agent_token';
    case 'writer': return 'writer_token';
    default:       return 'admin_token';
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await AdminUser.findOne({
      email:  email.toLowerCase(),
      active: true,
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'This account uses Google login. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Public users must verify email before logging in
    if (user.role === 'user' && !user.verified) {
      return NextResponse.json(
        {
          error:         'Please verify your email before logging in.',
          requireVerify: true,
          email:         user.email,
        },
        { status: 403 }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    });

    const userData = {
      id:       user._id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      avatar:   user.avatar,
      verified: user.verified,
    };

    const response = NextResponse.json({
      success:      true,
      user:         userData,
      token,
      redirectTo:   redirectFor(user.role),
    });

    // Set httpOnly cookie — correct key per role
    const cookieName = cookieNameFor(user.role);
    response.cookies.set(cookieName, token, {
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
