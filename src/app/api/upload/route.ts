import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, RouteContext } from '@/lib/auth-middleware';
import { JwtPayload } from '@/lib/jwt';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;

export const POST = requireAuth(async (req: NextRequest, _user: JwtPayload, _ctx: RouteContext) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF images are allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File size must be under ${MAX_SIZE_MB}MB` }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to .env.local' },
        { status: 500 }
      );
    }

    // Direct REST API — unsigned preset, no SDK, no signature needed
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('upload_preset', uploadPreset);
    uploadForm.append('folder', 'nayab-real-marketing');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary error:', data);
      return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
});