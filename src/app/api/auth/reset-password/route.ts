import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean }).select('+resetOtpCode');

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check OTP expiry
    if (!user.resetOtpExpiry || new Date() > user.resetOtpExpiry) {
      return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 410 });
    }

    // Check OTP match
    if (user.resetOtpCode !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 401 });
    }

    // Update password and clear reset fields
    user.password = password; // will be hashed by pre-save hook
    user.resetOtpCode = undefined;
    user.resetOtpExpiry = undefined;
    
    // Also mark email as verified if they reset their password (since they had access to the email)
    user.emailVerified = true;
    
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
