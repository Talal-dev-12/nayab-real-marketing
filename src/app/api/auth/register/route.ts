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

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const nameClean  = name.trim();
    const emailClean = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailClean }).select('+otpCode');

    if (existingUser) {
      // If the user exists but is NOT verified, allow re-sending OTP
      if (!existingUser.emailVerified) {
        const otp = generateOtp();
        existingUser.otpCode  = otp;
        existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        existingUser.name = nameClean;
        existingUser.password = password; // will be re-hashed by pre-save hook
        await existingUser.save();

        // Send OTP email (non-blocking for speed, but await for reliability)
        try {
          await sendOtpEmail(emailClean, nameClean, otp);
        } catch (emailErr) {
          console.error('OTP email failed:', emailErr);
        }

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          email: emailClean,
          message: 'Verification code sent to your email.',
        });
      }

      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Generate OTP
    const otp = generateOtp();

    // Create user with emailVerified = false
    await User.create({
      name:           nameClean,
      email:          emailClean,
      password,                     // hashed by pre-save hook
      role:           'user',
      emailVerified:  false,
      otpCode:        otp,
      otpExpiry:      new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    try {
      await sendOtpEmail(emailClean, nameClean, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: emailClean,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
