import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    const result = await AuthService.resetPassword(email, otp, password);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
