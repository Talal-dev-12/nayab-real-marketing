import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const user = await AdminUser.findOne({
      email: email.toLowerCase(),
    }).select('+verificationOtp +verificationOtpExpiry');

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json(
        { error: 'Email is already verified. Please log in.' },
        { status: 400 }
      );
    }

    if (!user.verificationOtp || user.verificationOtp !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (!user.verificationOtpExpiry || user.verificationOtpExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please register again to get a new code.' },
        { status: 400 }
      );
    }

    // Mark verified and clear OTP
    user.verified              = true;
    user.verificationOtp       = undefined;
    user.verificationOtpExpiry = undefined;
    user.lastLogin             = new Date();
    await user.save();

    // Send welcome email — non-blocking
    try {
      await sendWelcomeEmail({ to: user.email, name: user.name });
    } catch (mailErr) {
      console.error('Welcome email failed:', mailErr);
    }

    // Issue token so user is immediately logged in after verification
    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    });

    const response = NextResponse.json({
      success:    true,
      message:    'Email verified successfully! Welcome.',
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        avatar:   user.avatar,
        verified: true,
      },
      token,
      redirectTo: '/',
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/auth/verify-email/resend  — handled via the register route (same logic)
