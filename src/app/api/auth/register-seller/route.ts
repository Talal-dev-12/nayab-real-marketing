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
        existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        existingUser.name = nameClean;
        existingUser.password = password;
        existingUser.role = 'seller';
        await existingUser.save();

        try {
          await sendOtpEmail(emailClean, nameClean, otp);
        } catch (emailErr) {
          console.error('OTP email failed:', emailErr);
        }

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          email: emailClean,
          role: 'seller',
          message: 'Verification code sent to your email.',
        });
      }

      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const otp = generateOtp();

    await User.create({
      name:          nameClean,
      email:         emailClean,
      password,
      role:          'seller',
      active:        true,
      emailVerified: false,
      otpCode:       otp,
      otpExpiry:     new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendOtpEmail(emailClean, nameClean, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: emailClean,
      role: 'seller',
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Seller register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
