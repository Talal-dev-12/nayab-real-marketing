import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const authResult = await AuthService.login(email, password);

    const response = NextResponse.json({
      success: true,
      redirectTo: authResult.redirectTo,
      user: authResult.user,
      token: authResult.token,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    };

    response.cookies.set('auth_token', authResult.token, cookieOptions);
    response.cookies.set('admin_token', authResult.token, cookieOptions);

    return response;
  } catch (error: any) {
    if (error.status) {
      const { status, message, requiresVerification, email } = error;
      return NextResponse.json(
        { error: message, requiresVerification, email },
        { status }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
