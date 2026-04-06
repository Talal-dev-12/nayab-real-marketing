import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/mailer';
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
      // For security, don't reveal if the user exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset code has been sent.',
      });
    }

    // Generate reset OTP
    const otp = generateOtp();
    user.resetOtpCode = otp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(emailClean, user.name, otp);
    } catch (emailErr) {
      console.error('Password reset email failed:', emailErr);
      // Still return success to the user to avoid enumeration and because the code IS in the DB
    }

    return NextResponse.json({
      success: true,
      message: 'A reset code has been sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
