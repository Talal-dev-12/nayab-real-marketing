import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const result = await AuthService.verifyOtp(email, otp);

    const response = NextResponse.json({
      success: true,
      redirectTo: result.redirectTo,
      user: result.user,
      token: result.token,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    };

    response.cookies.set('auth_token', result.token, cookieOptions);
    response.cookies.set('admin_token', result.token, cookieOptions);

    return response;
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
