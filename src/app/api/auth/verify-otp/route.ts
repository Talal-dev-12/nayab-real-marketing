import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { signToken, getRedirectByRole } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailClean }).select('+otpCode +password');

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Check OTP expiry
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 410 });
    }

    // Check OTP match
    if (user.otpCode !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Mark as verified and clear OTP fields
    user.emailVerified = true;
    user.otpCode       = undefined;
    user.otpExpiry     = undefined;
    user.lastLogin     = new Date();
    await user.save();

    // Now log them in
    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    });

    const redirectTo = getRedirectByRole(user.role);

    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar || null,
      },
      token,
    });

    // Set auth cookies
    const cookieOpts = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    };
    response.cookies.set('auth_token',  token, cookieOpts);
    response.cookies.set('admin_token', token, cookieOpts);

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
