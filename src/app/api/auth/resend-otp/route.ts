import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendOtpEmail } from '@/lib/mailer';
import crypto from 'crypto';

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      // Don't reveal whether account exists
      return NextResponse.json({ success: true, message: 'If an account exists, a new code has been sent.' });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Rate-limit: don't allow resend if last OTP was sent less than 60 seconds ago
    if (user.otpExpiry) {
      const timeLeftMs = user.otpExpiry.getTime() - Date.now();
      const msSinceGenerated = 10 * 60 * 1000 - timeLeftMs; // OTP lives for 10 min
      if (msSinceGenerated < 60 * 1000) {
        return NextResponse.json({ error: 'Please wait at least 60 seconds before requesting a new code.' }, { status: 429 });
      }
    }

    const otp = generateOtp();
    user.otpCode  = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOtpEmail(emailClean, user.name, otp);
    } catch (emailErr) {
      console.error('Resend OTP email failed:', emailErr);
    }

    return NextResponse.json({ success: true, message: 'A new verification code has been sent.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
