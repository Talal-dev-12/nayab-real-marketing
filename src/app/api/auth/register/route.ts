import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { AdminUser } from '@/models/AdminUser';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const nameClean  = name.trim();
    const emailClean = email.toLowerCase().trim();

    // Check both collections — email must be globally unique
    const existingUser  = await User.findOne({ email: emailClean });
    const existingAdmin = await AdminUser.findOne({ email: emailClean });

    if (existingUser || existingAdmin) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Public registration always creates role: "user"
    const newUser = await User.create({
      name:  nameClean,
      email: emailClean,
      password,          // hashed by pre-save hook
      role:  'user',
    });

    newUser.lastLogin = new Date();
    await newUser.save();

    const token = signToken({
      id:    newUser._id.toString(),
      email: newUser.email,
      role:  newUser.role,
      name:  newUser.name,
    });

    const response = NextResponse.json({
      success:    true,
      redirectTo: '/',
      user: {
        id:    newUser._id,
        name:  newUser.name,
        email: newUser.email,
        role:  newUser.role,
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
