import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';
import { can } from '@/lib/rbac';

export const GET = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    // Only superadmin and managers can list users. Wait, if manager can manageUsers?
    if (!can(user.role, 'manageUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const role  = searchParams.get('role');
    const page  = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // default 50 for admin users view
    const skip  = (page - 1) * limit;

    const query: any = {};
    if (role) {
      if (role === 'portal') {
        query.role = { $in: ['seller', 'writer', 'agent', 'manager', 'superadmin'] };
      } else {
        query.role = role;
      }
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    if (!can(user.role, 'manageUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only superadmin can create superadmin
    if (role === 'superadmin' && user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emailClean = email.toLowerCase().trim();
    if (await User.findOne({ email: emailClean })) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newUser = await User.create({
      name,
      email: emailClean,
      password,
      role,
      active: true,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return NextResponse.json(userObj, { status: 201 });
  } catch (error) {
    console.error('POST user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
