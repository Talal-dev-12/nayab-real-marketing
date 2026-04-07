import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { signToken, getRedirectByRole } from '@/lib/jwt';
import { sendOtpEmail, sendPasswordResetEmail } from '@/lib/mailer';
import { generateOTP } from '@/utils/generateOTP';
import { normalizeEmail, isValidEmail, isStrongPassword } from '@/utils/validate';

export class AuthService {
  static async login(emailInput: string, passwordInput: string) {
    await connectDB();

    if (!emailInput || !passwordInput) {
      throw { status: 400, message: 'Email and password are required' };
    }

    const email = normalizeEmail(emailInput);
    const userRecord = await User.findOne({ email, active: true }).select('+password');

    if (!userRecord) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (!userRecord.password) {
      throw { status: 401, message: 'This account uses Google sign-in. Please continue with Google.' };
    }

    const isValid = await userRecord.comparePassword(passwordInput);
    if (!isValid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const staffBypassRoles = ['manager', 'superadmin'];
    if (!userRecord.emailVerified && !staffBypassRoles.includes(userRecord.role)) {
      throw {
        status: 403,
        message: 'Please verify your email address first.',
        requiresVerification: true,
        email: userRecord.email,
      };
    }

    userRecord.lastLogin = new Date();
    await userRecord.save();

    const token = signToken({
      id: userRecord._id.toString(),
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name,
    });

    return {
      success: true,
      redirectTo: getRedirectByRole(userRecord.role),
      user: {
        id: userRecord._id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
        avatar: userRecord.avatar || null,
      },
      token,
    };
  }

  static async register(nameInput: string, emailInput: string, passwordInput: string) {
    await connectDB();

    if (!nameInput || !emailInput || !passwordInput) {
      throw { status: 400, message: 'Name, email and password are required' };
    }

    if (!isStrongPassword(passwordInput)) {
      throw { status: 400, message: 'Password must be at least 8 characters' };
    }

    if (!isValidEmail(emailInput)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    const name = nameInput.trim();
    const email = normalizeEmail(emailInput);

    const existingUser = await User.findOne({ email }).select('+otpCode');

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const otp = generateOTP();
        existingUser.otpCode = otp;
        existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        existingUser.name = name;
        existingUser.password = passwordInput;
        await existingUser.save();

        try {
          await sendOtpEmail(email, name, otp);
        } catch (emailErr) {
          console.error('OTP email failed:', emailErr);
        }

        return {
          success: true,
          requiresVerification: true,
          email,
          message: 'Verification code sent to your email.',
        };
      }
      throw { status: 409, message: 'An account with this email already exists' };
    }

    const otp = generateOTP();
    await User.create({
      name,
      email,
      password: passwordInput,
      role: 'user',
      emailVerified: false,
      otpCode: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendOtpEmail(email, name, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr);
    }

    return {
      success: true,
      requiresVerification: true,
      email,
      message: 'Verification code sent to your email.',
    };
  }

  static async verifyOtp(emailInput: string, otpInput: string) {
    await connectDB();

    if (!emailInput || !otpInput) {
      throw { status: 400, message: 'Email and OTP are required' };
    }

    const email = normalizeEmail(emailInput);
    const user = await User.findOne({ email }).select('+otpCode +password');

    if (!user) {
      throw { status: 404, message: 'Account not found' };
    }

    if (user.emailVerified) {
      throw { status: 400, message: 'Email is already verified' };
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      throw { status: 410, message: 'Verification code has expired. Please request a new one.' };
    }

    if (user.otpCode !== otpInput.trim()) {
      throw { status: 401, message: 'Invalid verification code' };
    }

    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      success: true,
      redirectTo: getRedirectByRole(user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
      token,
    };
  }

  static async resendOtp(emailInput: string) {
    await connectDB();

    if (!emailInput) {
      throw { status: 400, message: 'Email is required' };
    }

    const email = normalizeEmail(emailInput);
    const user = await User.findOne({ email });

    if (!user) {
      return { success: true, message: 'If an account exists, a new code has been sent.' };
    }

    if (user.emailVerified) {
      throw { status: 400, message: 'Email is already verified' };
    }

    if (user.otpExpiry) {
      const timeLeftMs = user.otpExpiry.getTime() - Date.now();
      const msSinceGenerated = 10 * 60 * 1000 - timeLeftMs;
      if (msSinceGenerated < 60 * 1000) {
        throw { status: 429, message: 'Please wait at least 60 seconds before requesting a new code.' };
      }
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOtpEmail(email, user.name, otp);
    } catch (emailErr) {
      console.error('Resend OTP email failed:', emailErr);
    }

    return { success: true, message: 'A new verification code has been sent.' };
  }

  static async forgotPassword(emailInput: string) {
    await connectDB();

    if (!emailInput) {
      throw { status: 400, message: 'Email is required' };
    }

    const email = normalizeEmail(emailInput);
    const user = await User.findOne({ email });

    if (!user) {
      return { success: true, message: 'If an account exists with this email, a reset code has been sent.' };
    }

    const otp = generateOTP();
    user.resetOtpCode = otp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await sendPasswordResetEmail(email, user.name, otp);
    } catch (emailErr) {
      console.error('Password reset email failed:', emailErr);
    }

    return { success: true, message: 'A reset code has been sent to your email.' };
  }

  static async resetPassword(emailInput: string, otpInput: string, passwordInput: string) {
    await connectDB();

    if (!emailInput || !otpInput || !passwordInput) {
      throw { status: 400, message: 'Email, OTP, and new password are required' };
    }

    if (!isStrongPassword(passwordInput)) {
      throw { status: 400, message: 'Password must be at least 8 characters long' };
    }

    const email = normalizeEmail(emailInput);
    const user = await User.findOne({ email }).select('+resetOtpCode');

    if (!user) {
      throw { status: 404, message: 'Account not found' };
    }

    if (!user.resetOtpExpiry || new Date() > user.resetOtpExpiry) {
      throw { status: 410, message: 'Reset code has expired. Please request a new one.' };
    }

    if (user.resetOtpCode !== otpInput.trim()) {
      throw { status: 401, message: 'Invalid reset code' };
    }

    user.password = passwordInput;
    user.resetOtpCode = undefined;
    user.resetOtpExpiry = undefined;
    user.emailVerified = true;
    await user.save();

    return { success: true, message: 'Password has been reset successfully. You can now sign in.' };
  }
}
