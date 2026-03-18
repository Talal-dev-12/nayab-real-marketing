import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  const clearOpts = { httpOnly: true, maxAge: 0, path: '/' };
  response.cookies.set('auth_token',  '', clearOpts);
  response.cookies.set('admin_token', '', clearOpts); // legacy compat
  return response;
}
