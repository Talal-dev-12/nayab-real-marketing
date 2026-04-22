import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { requireAuth, RouteContext } from '@/middleware/authMiddleware';
import { JwtPayload } from '@/lib/jwt';
import { can } from '@/lib/rbac';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priceType = searchParams.get('priceType') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';
    const submittedBy = searchParams.get('submittedBy') || ''; // seller "my listings"
    const approvalStatus = searchParams.get('approvalStatus') || ''; // dashboard filter
    const dashboard = searchParams.get('dashboard') || 'false';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (slug) {
      const property = await Property.findOne({ slug });
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });
      return NextResponse.json(property);
    }

    const filter: Record<string, unknown> = {};
    if (featured !== null && featured !== '') filter.featured = featured === 'true';
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priceType) filter.priceType = priceType;
    if (city) filter.city = city;
    if (submittedBy) filter.submittedBy = submittedBy;  // ← scope to seller

    // Protect public API 
    if (dashboard === 'true') {
      if (approvalStatus) filter.approvalStatus = approvalStatus;
    } else {
      filter.approvalStatus = 'approved';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('GET /api/properties incoming params:', { dashboard, approvalStatus, submittedBy });
    console.log('GET /api/properties filter constructed:', filter);

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('GET properties error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = requireAuth(async (req: NextRequest, user: JwtPayload, _ctx: RouteContext) => {
  try {
    await connectDB();
    const body = await req.json();

    // Stamp who submitted this listing
    body.submittedBy = user.id;

    // Sellers must supply their own user ID as agentId placeholder
    // (they are not real-estate agents, but the field is required on the model)
    if (user.role === 'seller') {
      body.agentId = body.agentId || user.id;
      // Sellers cannot feature their own listings
      body.featured = false;
      body.approvalStatus = 'pending';
    } else {
      body.approvalStatus = 'approved';
    }

    const { title, description, price, priceType, location, city, area, type, agentId } = body;
    if (!title || !description || !price || !priceType || !location || !city || !area || !type || !agentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const generatedSlug = (body.slug || title)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (await Property.findOne({ slug: generatedSlug })) {
      return NextResponse.json({ error: 'A property with this slug already exists' }, { status: 409 });
    }

    const property = await Property.create({ ...body, slug: generatedSlug });

    // Send notifications if seller submitted
    if (user.role === 'seller') {
      import('@/lib/mailer').then(({ sendPropertyUnderReviewEmail, sendNewPropertyNotification }) => {
        sendPropertyUnderReviewEmail(user.email, user.name, title).catch(console.error);
        sendNewPropertyNotification({
          adminEmails: [
            process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com',
            ...(process.env.NOTIFICATION_EMAIL ? [process.env.NOTIFICATION_EMAIL] : []),
          ],
          sellerName: user.name,
          sellerEmail: user.email,
          propertyTitle: title,
          propertyId: property._id.toString()
        }).catch(console.error);
      });

      // Create in-app notification for all admins/managers
      User.find({ role: { $in: ['superadmin', 'manager'] }, active: true })
        .then(admins => {
          const notifications = admins.map(admin => ({
            userId: admin._id,
            title: 'New Property Submitted',
            message: `${user.name} has submitted "${title}" for review.`,
            link: `/dashboard/properties/${property._id}/edit`,
            read: false,
          }));
          return Notification.insertMany(notifications);
        })
        .catch(console.error);
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('POST property error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
