/**
 * Run this script ONCE to seed MongoDB with initial data.
 * Usage: npx ts-node --project tsconfig.json -e "require('./src/scripts/seed.ts')"
 * Or add to package.json scripts: "seed": "ts-node src/scripts/seed.ts"
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Inline schemas to avoid module resolution issues in script context
const AdminUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'superadmin' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, excerpt: String, content: String,
  image: String, author: String, category: String, tags: [String],
  published: Boolean, views: { type: Number, default: 0 },
}, { timestamps: true });

const PropertySchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, description: String,
  price: Number, priceType: String, location: String, city: String,
  area: Number, bedrooms: Number, bathrooms: Number, type: String,
  status: { type: String, default: 'available' }, images: [String],
  featured: Boolean, agentId: String, views: { type: Number, default: 0 },
}, { timestamps: true });

const AgentSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, phone: String,
  image: String, bio: String, specialization: String,
  properties: { type: Number, default: 0 }, active: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
  const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
  const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
  const Agent = mongoose.models.Agent || mongoose.model('Agent', AgentSchema);

  // Create superadmin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nayabrealmarketing.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const existing = await AdminUser.findOne({ email: adminEmail });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await AdminUser.create({ name: 'Super Admin', email: adminEmail, password: hashed, role: 'superadmin' });
    console.log(`✅ Superadmin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Superadmin already exists: ${adminEmail}`);
  }

  // Seed sample agents
  const agentCount = await Agent.countDocuments();
  if (agentCount === 0) {
    const agents = await Agent.insertMany([
      { name: 'Muhammad Nayab', email: 'nayab@nayabrealestate.com', phone: '+92-300-1234567',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        bio: 'Senior real estate consultant with 10+ years of experience.', specialization: 'Residential & Commercial', properties: 45 },
      { name: 'Sara Ahmed', email: 'sara@nayabrealestate.com', phone: '+92-321-9876543',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        bio: 'Specializing in luxury properties and plot investments.', specialization: 'Luxury & Plots', properties: 32 },
    ]);
    console.log(`✅ Seeded ${agents.length} agents`);
  }

  // Seed sample blogs
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    await Blog.insertMany([
      { title: 'Top 10 Tips for Buying Your First Home in Pakistan', slug: 'tips-buying-first-home-pakistan',
        excerpt: 'Essential tips to navigate real estate in Pakistan.', content: '<p>Full content here...</p>',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        author: 'Nayab Real Marketing', category: 'Buying Guide',
        tags: ['home buying', 'Pakistan', 'tips'], published: true, views: 1245 },
      { title: 'Karachi Real Estate Market Trends 2024', slug: 'karachi-real-estate-market-trends-2024',
        excerpt: 'Analysis of Karachi real estate market.', content: '<p>Full content here...</p>',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        author: 'Nayab Real Marketing', category: 'Market Analysis',
        tags: ['Karachi', 'trends', '2024'], published: true, views: 987 },
    ]);
    console.log('✅ Seeded blogs');
  }

  // Seed sample properties
  const propCount = await Property.countDocuments();
  if (propCount === 0) {
    const agentDocs = await Agent.find().limit(2);
    const agentId = agentDocs[0]?._id?.toString() || 'unknown';
    await Property.insertMany([
      { title: '5 Marla House in DHA Phase 6', slug: 'house-dha-phase-6-karachi',
        description: 'Beautiful 5 marla house in DHA Phase 6.', price: 25000000, priceType: 'sale',
        location: 'DHA Phase 6, Karachi', city: 'Karachi', area: 1125, bedrooms: 3, bathrooms: 2,
        type: 'residential', status: 'available', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
        featured: true, agentId, views: 342 },
      { title: '10 Marla Corner Plot in Bahria Town', slug: 'corner-plot-bahria-town-karachi',
        description: 'Prime location 10 marla corner plot.', price: 18000000, priceType: 'sale',
        location: 'Bahria Town, Karachi', city: 'Karachi', area: 2250, bedrooms: 0, bathrooms: 0,
        type: 'plot', status: 'available', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
        featured: true, agentId, views: 218 },
    ]);
    console.log('✅ Seeded properties');
  }

  console.log('\n🎉 Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
