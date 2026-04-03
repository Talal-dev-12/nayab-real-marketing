import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { AdminUser } from '@/models/AdminUser';
import { signToken } from '@/lib/jwt';

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

    // Email must be globally unique across both collections
    const existingUser  = await User.findOne({ email: emailClean });
    const existingAdmin = await AdminUser.findOne({ email: emailClean });

    if (existingUser || existingAdmin) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Seller accounts live in the AdminUser collection so the dashboard panel works
    const newSeller = await AdminUser.create({
      name:     nameClean,
      email:    emailClean,
      password,          // hashed by pre-save hook
      role:     'seller',
      active:   true,
    });

    newSeller.lastLogin = new Date();
    await newSeller.save();

    const token = signToken({
      id:    newSeller._id.toString(),
      email: newSeller.email,
      role:  newSeller.role,
      name:  newSeller.name,
    });

    const response = NextResponse.json({
      success:    true,
      redirectTo: '/dashboard',
      user: {
        id:    newSeller._id,
        name:  newSeller.name,
        email: newSeller.email,
        role:  newSeller.role,
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

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    });

    return response;
  } catch (error) {
    console.error('Seller register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
