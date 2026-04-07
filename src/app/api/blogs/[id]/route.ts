import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload, UserRole } from '@/lib/jwt';

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PUT = requireAuth(async (req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    // Writers can only edit their own blogs
    const role = user.role as UserRole;
    if (role === 'writer' && blog.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - not your blog' }, { status: 403 });
    }

    const body = await req.json();

    // Writers cannot approve their own blogs or manipulate published status
    if (role === 'writer') {
      delete body.approvalStatus;
      delete body.rejectionNote;
      delete body.published;
    }
    const updated = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = requireAuth(async (_req: NextRequest, user: JwtPayload, ctx: RouteContext) => {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    // Writers can only delete their own blogs
    const role = user.role as UserRole;
    if (role === 'writer' && blog.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden - not your blog' }, { status: 403 });
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});