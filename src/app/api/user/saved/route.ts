import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { AdminUser } from '@/models/AdminUser';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

// Resolve the right model for the calling user
async function findUserRecord(userId: string) {
  const publicUser = await User.findById(userId).select('savedProperties');
  if (publicUser) return publicUser;
  return AdminUser.findById(userId).select('savedProperties');
}

// GET — return user's saved properties (full property objects)
export const GET = requireAuth(async (_req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const dbUser = await findUserRecord(user.id);
    if (!dbUser) return NextResponse.json({ savedProperties: [] });

    const ids = (dbUser as any).savedProperties ?? [];
    if (ids.length === 0) return NextResponse.json({ savedProperties: [] });

    const properties = await Property.find({ _id: { $in: ids } }).lean();
    return NextResponse.json({ savedProperties: properties });
  } catch (error) {
    console.error('GET saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST — toggle save (add if not saved, remove if saved)
export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const { propertyId } = await req.json();
    if (!propertyId) return NextResponse.json({ error: 'propertyId required' }, { status: 400 });

    const dbUser = await findUserRecord(user.id);
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const saved   = (dbUser as any).savedProperties ?? [];
    const isSaved = saved.includes(propertyId);

    if (isSaved) {
      (dbUser as any).savedProperties = saved.filter((id: string) => id !== propertyId);
    } else {
      (dbUser as any).savedProperties = [...saved, propertyId];
    }

    await dbUser.save();
    return NextResponse.json({ saved: !isSaved, savedProperties: (dbUser as any).savedProperties });
  } catch (error) {
    console.error('POST saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
