import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { sendVerificationOtp } from '@/lib/mailer';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      // If they exist but aren't verified, resend OTP instead of erroring
      if (!existing.verified) {
        const otp    = generateOtp();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        existing.verificationOtp       = otp;
        existing.verificationOtpExpiry = expiry;
        await existing.save();

        try {
          await sendVerificationOtp({ to: email.toLowerCase(), name: existing.name, otp });
        } catch (mailErr) {
          console.error('OTP email failed:', mailErr);
        }

        return NextResponse.json({
          success:       true,
          message:       'A new verification code has been sent to your email.',
          requireVerify: true,
          email:         email.toLowerCase(),
        });
      }
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const otp    = generateOtp();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // Create unverified user — role defaults to 'user', verified defaults to false
    await AdminUser.create({
      name:                  name.trim(),
      email:                 email.toLowerCase(),
      password,
      role:                  'user',
      verified:              false,
      verificationOtp:       otp,
      verificationOtpExpiry: expiry,
    });

    // Send OTP — non-blocking: don't fail the request if email is down
    try {
      await sendVerificationOtp({ to: email.toLowerCase(), name: name.trim(), otp });
    } catch (mailErr) {
      console.error('OTP email failed (account still created):', mailErr);
    }

    return NextResponse.json(
      {
        success:       true,
        message:       'Account created. Please check your email for the verification code.',
        requireVerify: true,
        email:         email.toLowerCase(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
