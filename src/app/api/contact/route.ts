import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In production: save to database using Prisma
    // const contact = await prisma.contact.create({
    //   data: { name, email, phone, subject, message },
    // });

    // For now: log and return success
    console.log('New contact message:', { name, email, subject, message: message.substring(0, 50) });

    return NextResponse.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // In production: return list for admin (with auth check)
  const mockMessages = [
    { id: '1', name: 'Ahmed Khan', email: 'ahmed@example.com', subject: 'Buy a Property', read: false, createdAt: new Date().toISOString() },
  ];
  return NextResponse.json(mockMessages);
}
