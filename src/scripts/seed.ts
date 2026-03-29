/**
 * NAYAB REAL MARKETING — ADDITIVE SEED
 * Run:  npm run seed
 *
 * SAFE: Never deletes existing data.
 * Adds NEW records on top of what's already in the database.
 * Skips duplicates by slug / email uniqueness.
 *
 * Pass --force to also re-insert admin if missing:
 *   npm run seed -- --force
 *
 * Inserts (additive):
 *   ✦ 1  Superadmin     (only if not exists)
 *   ✦ 10 Agents         (skips if email already exists)
 *   ✦ 50 Properties     (skips if slug already exists)
 *   ✦ 25 Blogs          (skips if slug already exists)
 *   ✦ 20 Contact msgs   (always appends — no unique key)
 *   ✦ 10 More agents    (NEW extras — different specs)
 *   ✦ 30 More props     (NEW — Rawalpindi, Faisalabad, more Karachi)
 *   ✦ 20 More blogs     (NEW — more areas & guides)
 *   ✦ 15 More messages  (NEW — additional inquiries)
 *   ✦ 5  Sellers        (NEW AdminUser records with role:seller)
 *   ✦ 3  Writers        (NEW AdminUser records with role:writer)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const URI = process.env.MONGODB_URI!;
if (!URI) { console.error('❌  MONGODB_URI missing in .env.local'); process.exit(1); }

// ─── helpers ─────────────────────────────────────────────────────────────────
const slug  = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pick  = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const ri    = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const views = () => ri(80, 6200);

// ─── image banks ─────────────────────────────────────────────────────────────
const PROP_IMGS = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900',
  'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=900',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900',
  'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=900',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=900',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=900',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=900',
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=900',
];

const BLOG_IMGS = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?w=900',
  'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=900',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900',
  'https://images.unsplash.com/photo-1549921296-3b0f9a35af35?w=900',
  'https://images.unsplash.com/photo-1434082033009-b81d41d32e1a?w=900',
  'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=900',
  'https://images.unsplash.com/photo-1526178613658-3f1622045557?w=900',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900',
];

const AGENT_IMGS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=500',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=500',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500',
  'https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=500',
  'https://images.unsplash.com/photo-1546961342-ea5f62d7f839?w=500',
  'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=500',
  'https://images.unsplash.com/photo-1504199367641-aba8151af406?w=500',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500',
];

// ─── rich blog HTML ───────────────────────────────────────────────────────────
const blogHTML = (title: string, area: string, category: string) => `
<h2>Overview</h2>
<p>The real-estate landscape in <strong>${area}</strong> continues to evolve rapidly in 2024. Whether you are a first-time buyer, a seasoned investor, or a family searching for a rental, understanding the on-ground dynamics of this market is critical before committing capital.</p>

<h2>Why ${area}?</h2>
<p>Demand in ${area} is driven by improved road networks, proximity to employment hubs, and a growing middle-class population that prioritises safe, planned communities. Over the past 18 months, transaction volumes have increased <strong>22% year-on-year</strong>, reflecting sustained confidence from both local and overseas Pakistani investors.</p>
<ul>
  <li>Average price appreciation: <strong>14–20%</strong> annually for residential plots</li>
  <li>Rental yield: <strong>4.5–6.5%</strong> per annum for constructed houses</li>
  <li>Strong secondary market liquidity — properties typically sell within 30–60 days</li>
  <li>Active developer pipeline with multiple new project launches planned</li>
</ul>

<h2>Current Price Trends (2024)</h2>
<p>Prices across different property categories in ${area} as of mid-2024:</p>
<ul>
  <li><strong>Residential Plots (120–240 sq yd):</strong> PKR 45 lac – 1.8 crore</li>
  <li><strong>Constructed Houses (3–5 bed):</strong> PKR 1.2 crore – 4 crore</li>
  <li><strong>Apartments (2–3 bed):</strong> PKR 55 lac – 1.4 crore</li>
  <li><strong>Commercial Plots:</strong> PKR 80 lac – 5 crore depending on size &amp; location</li>
</ul>

<h2>Investment Analysis</h2>
<p>For investors, the most compelling opportunity in ${area} right now lies in <strong>120–200 sq yd residential plots</strong> in newly approved sectors. These plots offer dual benefit of capital appreciation as development progresses and the option to construct for rental income. Long-term hold horizons of 3–5 years typically yield the best returns.</p>
<blockquote>"${area} has consistently delivered above-market returns for our clients. The key is buying in the right sector at the right time." — Nayab Real Marketing Team</blockquote>

<h2>Legal Checklist Before Buying</h2>
<p>Before finalising any transaction in ${area}, ensure you verify the following documents:</p>
<ol>
  <li>Original title deed or allotment letter from the relevant authority</li>
  <li>No-Objection Certificate (NOC) from SBCA / KDA / KMC as applicable</li>
  <li>Encumbrance certificate to confirm no existing mortgage or lien</li>
  <li>Utility connection availability (KESC, KWSB, SSGC)</li>
  <li>Approved building plan if a structure is already constructed</li>
</ol>

<h2>Neighbourhoods Within ${area}</h2>
<p>Not all pockets within ${area} are equally promising. Our ground team has identified the following sub-areas as particularly strong for end-users and investors:</p>
<ul>
  <li>Sector A / Block 1: Best for families — parks, schools, wide roads</li>
  <li>Main Boulevard Front: Premium commercial potential, high footfall</li>
  <li>Phase 2 Extension: Best price-to-value ratio, rapid development</li>
  <li>Corner plots on 40-ft roads: 10–15% premium but highest liquidity</li>
</ul>

<h2>Rental Market Update</h2>
<p>The rental market in ${area} is equally robust. Demand for 2-bedroom and 3-bedroom units consistently exceeds supply, resulting in low vacancy rates and steady rent escalations of 8–12% annually. Landlords in established blocks rarely face prolonged vacancies, making ${area} an excellent buy-to-let destination.</p>

<h2>Conclusion</h2>
<p>${area} remains one of Pakistan's most balanced real-estate markets — offering affordability for genuine home-buyers while delivering credible investment returns. With the right guidance, you can navigate this market confidently and profitably.</p>
<p>Ready to explore your options? <strong>Contact Nayab Real Marketing</strong> today for a free property consultation tailored to your budget and goals.</p>
`;

// ─── Mongoose schemas (minimal — matches live models) ────────────────────────
const schemas = {
  AdminUser: new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String,
    role: { type: String, default: 'superadmin' },
    active: { type: Boolean, default: true },
    savedProperties: [String],
  }, { timestamps: true }),

  Agent: new mongoose.Schema({
    name: String, email: { type: String, unique: true }, phone: String,
    image: String, bio: String, specialization: String,
    properties: { type: Number, default: 0 }, active: { type: Boolean, default: true },
  }, { timestamps: true }),

  Property: new mongoose.Schema({
    title: String, slug: { type: String, unique: true }, description: String,
    price: Number, priceType: String, rentPeriod: String,
    location: String, city: String, area: Number,
    bedrooms: Number, bathrooms: Number, type: String,
    status: { type: String, default: 'available' }, images: [String],
    featured: Boolean, agentId: String, submittedBy: String,
    views: { type: Number, default: 0 },
  }, { timestamps: true }),

  Blog: new mongoose.Schema({
    title: String, slug: { type: String, unique: true }, excerpt: String, content: String,
    image: String, images: [String], author: String, category: String, tags: [String],
    published: Boolean, views: { type: Number, default: 0 },
    areaSlug: String, areaLabel: String, schemeSlug: String, schemeLabel: String,
    metaTitle: String, metaDescription: String, metaKeywords: String,
  }, { timestamps: true }),

  ContactMessage: new mongoose.Schema({
    name: String, email: String, phone: String, subject: String,
    message: String, read: { type: Boolean, default: false },
  }, { timestamps: true }),
};

// ─── ORIGINAL 10 AGENTS ──────────────────────────────────────────────────────
const AGENTS_ORIGINAL = [
  { name: 'Muhammad Nayab',  email: 'nayab@nayabrealestate.com',   phone: '+92-321-2869000', img: 0,  props: 54, spec: 'Residential & Commercial',   bio: 'Founder of Nayab Real Marketing with 14+ years navigating Karachi\'s property landscape. Deep expertise in DHA, Bahria Town, and Scheme 33. Trusted by 500+ clients for transparent, results-driven service.' },
  { name: 'Sara Ahmed',      email: 'sara@nayabrealestate.com',     phone: '+92-300-8812345', img: 1,  props: 38, spec: 'Luxury Properties & Plots',   bio: 'Luxury and premium segment specialist with a sharp eye for high-value opportunities. Expert in Clifton, DHA Phases 4–8 and sea-view apartments. Fluent in English and Urdu.' },
  { name: 'Usman Tariq',     email: 'usman@nayabrealestate.com',    phone: '+92-333-4567890', img: 2,  props: 31, spec: 'Commercial & Investment',      bio: 'Commercial real-estate strategist helping entrepreneurs and investors identify prime retail, office, and warehouse opportunities. 9 years of hands-on deal-making across Karachi.' },
  { name: 'Ayesha Malik',    email: 'ayesha@nayabrealestate.com',   phone: '+92-312-9876543', img: 3,  props: 42, spec: 'Rentals & Family Homes',       bio: 'Dedicated rental market expert covering Gulshan-e-Iqbal, North Nazimabad, and PECHS. Renowned for swift placements and long-lasting landlord-tenant relationships.' },
  { name: 'Bilal Khan',      email: 'bilal@nayabrealestate.com',    phone: '+92-345-1122334', img: 4,  props: 47, spec: 'Scheme 33 & Surjani Town',     bio: 'Scheme 33 and Surjani Town authority. Born and raised in the area — nobody knows the street-level pricing and upcoming developments better. Trusted by 150+ plot investors.' },
  { name: 'Fatima Rizvi',    email: 'fatima@nayabrealestate.com',   phone: '+92-311-5566778', img: 5,  props: 29, spec: 'Apartments & New Launches',   bio: 'New-project and apartment specialist helping buyers navigate pre-launch bookings and ready-to-move-in flats across Karachi. Expert in payment plans and ROI analysis.' },
  { name: 'Hassan Siddiqui', email: 'hassan@nayabrealestate.com',   phone: '+92-322-7788990', img: 6,  props: 36, spec: 'Bahria Town Karachi',         bio: 'Complete Bahria Town Karachi specialist covering all 50+ precincts. Expert in villa, precinct apartment, and commercial plot pricing — development status updated daily.' },
  { name: 'Zara Sheikh',     email: 'zara@nayabrealestate.com',     phone: '+92-305-4433221', img: 7,  props: 21, spec: 'New Projects & Bookings',     bio: 'Connects early investors with pre-launch opportunities across upcoming Karachi schemes. Specialises in paperwork, booking transfers, and maximising returns on new launches.' },
  { name: 'Kamran Mirza',    email: 'kamran@nayabrealestate.com',   phone: '+92-333-6677889', img: 8,  props: 33, spec: 'Malir & Landhi Areas',        bio: 'East Karachi property expert with detailed knowledge of Malir Cantt, Malir City, and Landhi developments. Go-to agent for affordable plots with strong appreciation potential.' },
  { name: 'Nadia Butt',      email: 'nadia@nayabrealestate.com',    phone: '+92-315-9900112', img: 9,  props: 25, spec: 'Overseas Pakistanis & NRP',    bio: 'Dedicated support for overseas Pakistanis investing from abroad. Handles end-to-end acquisition including power-of-attorney, documentation, and secure payment channels.' },
];

// ─── NEW 10 EXTRA AGENTS ─────────────────────────────────────────────────────
const AGENTS_EXTRA = [
  { name: 'Ali Raza',          email: 'ali.raza@nayabrealestate.com',       phone: '+92-300-1112233', img: 10, props: 19, spec: 'Rawalpindi & Islamabad',      bio: 'Twin Cities property specialist covering Rawalpindi Cantonment, Bahria Town Rawalpindi, and all CDA sectors in Islamabad. 8 years of experience, 200+ successful transactions.' },
  { name: 'Mariam Aslam',      email: 'mariam@nayabrealestate.com',          phone: '+92-311-2233445', img: 11, props: 14, spec: 'Faisalabad Properties',       bio: 'Faisalabad\'s most connected real estate consultant. Expert in Susan Road, Peoples Colony, and Canal Road commercial strips. Helps textile business owners find ideal commercial space.' },
  { name: 'Tariq Mehmood',     email: 'tariq.mehmood@nayabrealestate.com',  phone: '+92-322-3344556', img: 12, props: 22, spec: 'Lahore Residential',          bio: 'Lahore residential market veteran specialising in DHA Lahore, Bahria Town Lahore, and Johar Town. Expert at matching families with properties that fit both budget and lifestyle.' },
  { name: 'Sana Javed',        email: 'sana.javed@nayabrealestate.com',     phone: '+92-333-4455667', img: 13, props: 17, spec: 'Gulshan & PECHS Rentals',     bio: 'Rental market specialist for Gulshan-e-Iqbal and PECHS. Maintains an active tenant database of 300+ pre-screened professionals, ensuring landlords get quality tenants fast.' },
  { name: 'Imran Qureshi',     email: 'imran.q@nayabrealestate.com',        phone: '+92-344-5566778', img: 14, props: 28, spec: 'DHA City & Defense View',    bio: 'Specialist in DHA City Karachi and newly launched Defence housing projects. Tracks development milestones daily and advises clients on optimal entry and exit points.' },
  { name: 'Hina Baig',         email: 'hina.baig@nayabrealestate.com',      phone: '+92-355-6677889', img: 15, props: 11, spec: 'Johar & Buffer Zone',        bio: 'Buffer Zone and Johar Town Karachi area expert. Affordable housing advocate helping first-time buyers navigate low-budget options without compromising on legal security.' },
  { name: 'Furqan Anwer',      email: 'furqan@nayabrealestate.com',         phone: '+92-300-7788990', img: 16, props: 34, spec: 'Industrial & Warehousing',    bio: 'Pakistan\'s specialist for industrial plots, factories, and warehousing units across SITE, Korangi, and North Karachi industrial zones. Trusted by 50+ manufacturing businesses.' },
  { name: 'Rubab Naqvi',       email: 'rubab@nayabrealestate.com',          phone: '+92-311-8899001', img: 17, props: 16, spec: 'Clifton & Sea-View Apartments',bio: 'Sea-facing apartment and Clifton area luxury specialist. Expert in high-rise residential buildings, floor-wise pricing, and negotiating with Clifton\'s premium developers.' },
  { name: 'Shehzad Akhtar',    email: 'shehzad@nayabrealestate.com',        phone: '+92-322-9900112', img: 18, props: 23, spec: 'North Karachi & Surjani',     bio: 'North Karachi and Surjani Town property expert. Focused on affordable 80–120 sq yd plots and houses for first-time buyers looking for legal, possession-ready properties.' },
  { name: 'Amna Gillani',      email: 'amna.gillani@nayabrealestate.com',   phone: '+92-333-0011223', img: 19, props: 13, spec: 'Women Buyers & Co-ownership', bio: 'Pakistan\'s dedicated advocate for women property buyers. Specialises in co-ownership structuring, inheritance cases, and guiding single women through the process with full legal protection.' },
];

// ─── ORIGINAL 50 PROPERTIES ──────────────────────────────────────────────────
const PROPS_ORIGINAL = [
  // DHA Karachi
  { t:'5 Marla House DHA Phase 6',            city:'Karachi',   loc:'DHA Phase 6, Karachi',              price:28500000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1125, feat:true,  status:'available' },
  { t:'10 Marla Corner Plot DHA Phase 8',     city:'Karachi',   loc:'DHA Phase 8, Karachi',              price:44000000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:2250, feat:true,  status:'available' },
  { t:'1 Kanal Luxury Bungalow DHA Phase 5',  city:'Karachi',   loc:'DHA Phase 5, Karachi',              price:130000000, pt:'sale', rt:null,    type:'residential', beds:5, baths:5, area:4500, feat:true,  status:'available' },
  { t:'3 Bed Apartment DHA Phase 6 Rent',     city:'Karachi',   loc:'DHA Phase 6, Karachi',              price:90000,     pt:'rent', rt:'month', type:'residential', beds:3, baths:2, area:1400, feat:false, status:'available' },
  { t:'Commercial Plot DHA Phase 7 500 Sqyd', city:'Karachi',   loc:'DHA Phase 7, Karachi',              price:72000000,  pt:'sale', rt:null,    type:'commercial',  beds:0, baths:0, area:500,  feat:false, status:'available' },
  { t:'2 Bed Flat DHA Phase 2 Extension',     city:'Karachi',   loc:'DHA Phase 2 Extension, Karachi',    price:18500000,  pt:'sale', rt:null,    type:'residential', beds:2, baths:2, area:950,  feat:false, status:'available' },
  { t:'Office Space DHA Phase 7 Rent',        city:'Karachi',   loc:'DHA Phase 7 Commercial, Karachi',   price:150000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:2, area:2200, feat:false, status:'available' },
  { t:'240 Sqyd House DHA Phase 2 Sold',      city:'Karachi',   loc:'DHA Phase 2, Karachi',              price:22000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:2160, feat:false, status:'sold'      },
  // Bahria Town Karachi
  { t:'125 Sqyd Villa Bahria Precinct 10',    city:'Karachi',   loc:'Bahria Town Precinct 10, Karachi',  price:15500000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1125, feat:true,  status:'available' },
  { t:'250 Sqyd Plot Bahria Precinct 15',     city:'Karachi',   loc:'Bahria Town Precinct 15, Karachi',  price:10200000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:2250, feat:false, status:'available' },
  { t:'2 Bed Apartment Bahria Town Ali Block',city:'Karachi',   loc:'Bahria Town Ali Block, Karachi',    price:47000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:2, area:950,  feat:false, status:'available' },
  { t:'500 Sqyd Farmhouse Bahria Town',       city:'Karachi',   loc:'Bahria Farmhouses, Karachi',        price:40000000,  pt:'sale', rt:null,    type:'residential', beds:5, baths:4, area:4500, feat:true,  status:'available' },
  { t:'Commercial Plot Bahria Precinct 7',    city:'Karachi',   loc:'Bahria Town Precinct 7, Karachi',   price:28000000,  pt:'sale', rt:null,    type:'commercial',  beds:0, baths:0, area:300,  feat:false, status:'available' },
  { t:'Precinct 27 Plot 125 Sqyd',            city:'Karachi',   loc:'Bahria Town Precinct 27, Karachi',  price:6800000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:1125, feat:false, status:'available' },
  { t:'Bahria Heights Apartment Rented',      city:'Karachi',   loc:'Bahria Heights, Karachi',           price:52000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:850,  feat:false, status:'rented'    },
  // Scheme 33
  { t:'120 Sqyd House Sector 33-A Scheme 33', city:'Karachi',   loc:'Sector 33-A, Scheme 33, Karachi',  price:8500000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1080, feat:false, status:'available' },
  { t:'240 Sqyd Plot Sector 33-B',            city:'Karachi',   loc:'Sector 33-B, Scheme 33, Karachi',  price:5800000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:2160, feat:false, status:'available' },
  { t:'Main Boulevard Shop Scheme 33',        city:'Karachi',   loc:'Main Boulevard, Scheme 33, Karachi',price:38000,     pt:'rent', rt:'month', type:'commercial',  beds:0, baths:1, area:200,  feat:false, status:'available' },
  { t:'3 Bed Flat 1st Floor Scheme 33',       city:'Karachi',   loc:'Scheme 33, Karachi',               price:7200000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1100, feat:false, status:'available' },
  { t:'400 Sqyd Double Storey Scheme 33',     city:'Karachi',   loc:'Scheme 33, Karachi',               price:16000000,  pt:'sale', rt:null,    type:'residential', beds:5, baths:4, area:3600, feat:true,  status:'available' },
  // Gulshan
  { t:'200 Sqyd House Gulshan Block 10',      city:'Karachi',   loc:'Gulshan-e-Iqbal Block 10, Karachi',price:17000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:1800, feat:true,  status:'available' },
  { t:'Upper Portion Gulshan Block 2 Rent',   city:'Karachi',   loc:'Gulshan-e-Iqbal Block 2, Karachi', price:28000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:900,  feat:false, status:'available' },
  { t:'Office Space Gulshan Chowrangi',       city:'Karachi',   loc:'Gulshan Chowrangi, Karachi',        price:95000,     pt:'rent', rt:'month', type:'office',      beds:0, baths:2, area:1800, feat:false, status:'available' },
  { t:'100 Sqyd Ground Gulshan Block 6',      city:'Karachi',   loc:'Gulshan-e-Iqbal Block 6, Karachi', price:9200000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:900,  feat:false, status:'available' },
  // Clifton
  { t:'Luxury 3 Bed Apartment Clifton Blk 5',city:'Karachi',   loc:'Clifton Block 5, Karachi',         price:58000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:3, area:2200, feat:true,  status:'available' },
  { t:'Sea-View 4 Bed Flat Clifton Blk 8 Rent',city:'Karachi', loc:'Clifton Block 8, Karachi',         price:185000,    pt:'rent', rt:'month', type:'residential', beds:4, baths:4, area:3200, feat:false, status:'available' },
  { t:'Commercial Floor Clifton Boulevard',   city:'Karachi',   loc:'Clifton Boulevard, Karachi',        price:260000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:3, area:3500, feat:false, status:'available' },
  // North Nazimabad
  { t:'120 Sqyd House North Nazimabad Blk N', city:'Karachi',  loc:'North Nazimabad Block N, Karachi',  price:9800000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1080, feat:false, status:'available' },
  { t:'Upper Portion North Nazimabad Blk H',  city:'Karachi',  loc:'North Nazimabad Block H, Karachi',  price:23000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:900,  feat:false, status:'available' },
  { t:'240 Sqyd Corner Plot Nazimabad Blk K', city:'Karachi',  loc:'North Nazimabad Block K, Karachi',  price:13500000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:2160, feat:false, status:'available' },
  // Malir
  { t:'200 Sqyd House Malir Cantt',            city:'Karachi',  loc:'Malir Cantt, Karachi',              price:11500000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:2, area:1800, feat:false, status:'available' },
  { t:'400 Sqyd Plot Malir City',              city:'Karachi',  loc:'Malir City Housing Scheme, Karachi',price:4500000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:3600, feat:false, status:'available' },
  { t:'120 Sqyd House Sector 4-D Malir',       city:'Karachi',  loc:'Sector 4-D, Malir, Karachi',        price:6200000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:1, area:1080, feat:false, status:'available' },
  // PECHS
  { t:'200 Sqyd House PECHS Block 2',          city:'Karachi',  loc:'PECHS Block 2, Karachi',            price:32000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:1800, feat:true,  status:'available' },
  { t:'Full Floor Office PECHS Block 6',       city:'Karachi',  loc:'PECHS Block 6, Karachi',            price:200000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:3, area:3000, feat:false, status:'available' },
  // Lahore
  { t:'5 Marla House DHA Phase 6 Lahore',      city:'Lahore',   loc:'DHA Phase 6, Lahore',              price:34000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:3, area:1125, feat:true,  status:'available' },
  { t:'10 Marla House Bahria Town Lahore',      city:'Lahore',   loc:'Bahria Town Sector E, Lahore',     price:40000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:2250, feat:false, status:'available' },
  { t:'1 Kanal Plot Sui Gas Society Lahore',    city:'Lahore',   loc:'Sui Gas Society, Lahore',          price:29000000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:4500, feat:false, status:'available' },
  { t:'2 Bed Apartment Johar Town Lahore Rent', city:'Lahore',   loc:'Johar Town Phase 2, Lahore',       price:55000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:2, area:1100, feat:false, status:'available' },
  { t:'Commercial Plaza Gulberg III Lahore',    city:'Lahore',   loc:'Gulberg III, Lahore',              price:180000000, pt:'sale', rt:null,    type:'commercial',  beds:0, baths:0, area:5000, feat:true,  status:'available' },
  // Islamabad
  { t:'7 Marla House G-13 Islamabad',           city:'Islamabad',loc:'G-13/1, Islamabad',               price:47000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:1575, feat:true,  status:'available' },
  { t:'10 Marla House F-11 Islamabad Rent',     city:'Islamabad',loc:'F-11 Markaz, Islamabad',          price:125000,    pt:'rent', rt:'month', type:'residential', beds:4, baths:4, area:2250, feat:false, status:'available' },
  { t:'1 Kanal Plot E-11 Islamabad',            city:'Islamabad',loc:'E-11/2, Islamabad',               price:65000000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:4500, feat:false, status:'available' },
  { t:'2 Bed Apartment Blue Area Islamabad',    city:'Islamabad',loc:'Blue Area, Islamabad',            price:28000000,  pt:'sale', rt:null,    type:'residential', beds:2, baths:2, area:1050, feat:false, status:'available' },
  { t:'Office Blue Area Islamabad Rent',        city:'Islamabad',loc:'Blue Area, Islamabad',            price:160000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:2, area:2500, feat:false, status:'available' },
  // Misc
  { t:'2 Bed Flat Gulshan Block 7 Rented',     city:'Karachi',  loc:'Gulshan-e-Iqbal Block 7, Karachi', price:33000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:950,  feat:false, status:'rented'    },
  { t:'120 Sqyd House Scheme 33 Sold',         city:'Karachi',  loc:'Scheme 33, Karachi',               price:7900000,   pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1080, feat:false, status:'sold'      },
  { t:'80 Sqyd Plot Surjani Town Sector 4',    city:'Karachi',  loc:'Surjani Town Sector 4, Karachi',   price:2800000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:720,  feat:false, status:'available' },
  { t:'3 Bed House Nazimabad No 2',            city:'Karachi',  loc:'Nazimabad No 2, Karachi',          price:14000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1350, feat:false, status:'available' },
  { t:'Warehouse Korangi Industrial Area',     city:'Karachi',  loc:'Korangi Industrial Area, Karachi', price:320000,    pt:'rent', rt:'month', type:'commercial',  beds:0, baths:2, area:8000, feat:false, status:'available' },
];

// ─── NEW 30 EXTRA PROPERTIES ─────────────────────────────────────────────────
const PROPS_EXTRA = [
  // Rawalpindi
  { t:'10 Marla House Bahria Town Rawalpindi Phase 8',   city:'Rawalpindi', loc:'Bahria Town Phase 8, Rawalpindi',    price:38000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:2250, feat:true,  status:'available' },
  { t:'5 Marla Plot PWD Society Rawalpindi',             city:'Rawalpindi', loc:'PWD Housing Society, Rawalpindi',    price:9500000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:1125, feat:false, status:'available' },
  { t:'3 Bed House Satellite Town Rawalpindi',           city:'Rawalpindi', loc:'Satellite Town, Rawalpindi',         price:22000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1350, feat:false, status:'available' },
  { t:'2 Bed Flat Gulraiz Housing Rawalpindi Rent',      city:'Rawalpindi', loc:'Gulraiz Housing, Rawalpindi',        price:45000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:2, area:950,  feat:false, status:'available' },
  { t:'1 Kanal House Chaklala Scheme 3 Rawalpindi',      city:'Rawalpindi', loc:'Chaklala Scheme 3, Rawalpindi',      price:75000000,  pt:'sale', rt:null,    type:'residential', beds:5, baths:4, area:4500, feat:true,  status:'available' },
  { t:'Office Murree Road Rawalpindi Rent',              city:'Rawalpindi', loc:'Murree Road, Rawalpindi',            price:120000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:2, area:2000, feat:false, status:'available' },
  // Faisalabad
  { t:'10 Marla House Susan Road Faisalabad',            city:'Faisalabad', loc:'Susan Road, Faisalabad',             price:26000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:2250, feat:true,  status:'available' },
  { t:'5 Marla House Peoples Colony Faisalabad',         city:'Faisalabad', loc:'Peoples Colony No 1, Faisalabad',   price:12500000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1125, feat:false, status:'available' },
  { t:'1 Kanal Plot Canal Road Faisalabad',              city:'Faisalabad', loc:'Canal Road, Faisalabad',             price:35000000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:4500, feat:false, status:'available' },
  { t:'Commercial Shop Canal Road Faisalabad Rent',      city:'Faisalabad', loc:'Canal Road Commercial, Faisalabad', price:60000,     pt:'rent', rt:'month', type:'commercial',  beds:0, baths:1, area:300,  feat:false, status:'available' },
  { t:'2 Bed Apartment Gulshan-e-Madina Faisalabad',     city:'Faisalabad', loc:'Gulshan-e-Madina, Faisalabad',      price:9800000,   pt:'sale', rt:null,    type:'residential', beds:2, baths:2, area:950,  feat:false, status:'available' },
  // More Islamabad
  { t:'7 Marla House B-17 Multi Gardens Islamabad',      city:'Islamabad',  loc:'B-17 Multi Gardens, Islamabad',     price:32000000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:1575, feat:true,  status:'available' },
  { t:'1 Kanal Farmhouse Chak Shehzad Islamabad',        city:'Islamabad',  loc:'Chak Shehzad, Islamabad',           price:85000000,  pt:'sale', rt:null,    type:'residential', beds:5, baths:5, area:4500, feat:true,  status:'available' },
  { t:'2 Bed Apartment F-10 Islamabad Rent',             city:'Islamabad',  loc:'F-10 Markaz, Islamabad',            price:95000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:2, area:1100, feat:false, status:'available' },
  { t:'Commercial Plot G-9 Islamabad',                   city:'Islamabad',  loc:'G-9/1, Islamabad',                  price:42000000,  pt:'sale', rt:null,    type:'commercial',  beds:0, baths:0, area:500,  feat:false, status:'available' },
  // More Lahore
  { t:'5 Marla House Johar Town Lahore',                 city:'Lahore',     loc:'Johar Town Phase 1, Lahore',        price:22000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1125, feat:false, status:'available' },
  { t:'10 Marla Plot LDA City Lahore',                   city:'Lahore',     loc:'LDA City Phase 1, Lahore',          price:18500000,  pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:2250, feat:false, status:'available' },
  { t:'1 Kanal House Gulberg III Lahore Rent',           city:'Lahore',     loc:'Gulberg III, Lahore',               price:250000,    pt:'rent', rt:'month', type:'residential', beds:5, baths:5, area:4500, feat:false, status:'available' },
  { t:'Office MM Alam Road Lahore Rent',                 city:'Lahore',     loc:'MM Alam Road, Gulberg, Lahore',     price:180000,    pt:'rent', rt:'month', type:'office',      beds:0, baths:3, area:2800, feat:false, status:'available' },
  { t:'2 Bed Flat Bahria Orchard Lahore',                city:'Lahore',     loc:'Bahria Orchard, Lahore',            price:12000000,  pt:'sale', rt:null,    type:'residential', beds:2, baths:2, area:1000, feat:false, status:'available' },
  // More Karachi — new areas
  { t:'200 Sqyd House Johar Mor Karachi',                city:'Karachi',    loc:'Johar Mor, Karachi',                price:13500000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:2, area:1800, feat:false, status:'available' },
  { t:'120 Sqyd Plot Buffer Zone Sector 15-A',           city:'Karachi',    loc:'Buffer Zone Sector 15-A, Karachi',  price:4200000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:1080, feat:false, status:'available' },
  { t:'3 Bed House Saadi Town Karachi',                  city:'Karachi',    loc:'Saadi Town Block 2, Karachi',       price:11000000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:1350, feat:false, status:'available' },
  { t:'Apartment Federal B Area Block 15 Rent',          city:'Karachi',    loc:'Federal B Area Block 15, Karachi',  price:35000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:900,  feat:false, status:'available' },
  { t:'240 Sqyd House New Karachi Sector 5-L',           city:'Karachi',    loc:'New Karachi Sector 5-L, Karachi',   price:10500000,  pt:'sale', rt:null,    type:'residential', beds:3, baths:2, area:2160, feat:false, status:'available' },
  { t:'Plot Taiser Town Karachi 120 Sqyd',               city:'Karachi',    loc:'Taiser Town Sector 62, Karachi',    price:2200000,   pt:'sale', rt:null,    type:'plot',        beds:0, baths:0, area:1080, feat:false, status:'available' },
  { t:'Shop North Karachi Industrial Rent',              city:'Karachi',    loc:'North Karachi Industrial Area',     price:42000,     pt:'rent', rt:'month', type:'commercial',  beds:0, baths:1, area:250,  feat:false, status:'available' },
  { t:'4 Bed House Gulistan-e-Johar Blk 14',            city:'Karachi',    loc:'Gulistan-e-Johar Block 14, Karachi',price:15500000,  pt:'sale', rt:null,    type:'residential', beds:4, baths:3, area:1620, feat:true,  status:'available' },
  { t:'2 Bed Flat Nazimabad Rent Near Hospital',         city:'Karachi',    loc:'Nazimabad No 3, Karachi',           price:26000,     pt:'rent', rt:'month', type:'residential', beds:2, baths:1, area:850,  feat:false, status:'available' },
  { t:'Commercial Corner Plot SITE Area Karachi',        city:'Karachi',    loc:'SITE Area, Karachi',                price:22000000,  pt:'sale', rt:null,    type:'commercial',  beds:0, baths:0, area:400,  feat:false, status:'available' },
];

// ─── ORIGINAL 25 BLOGS ───────────────────────────────────────────────────────
const BLOGS_ORIGINAL = [
  { title:'Scheme 33 Karachi: Complete Investment Guide 2024',              category:'Investment',    areaSlug:'scheme-33',         areaLabel:'Scheme 33',         schemeSlug:'',                  schemeLabel:'',                 tags:['scheme 33','investment','karachi','plots','2024'],                                 excerpt:'Everything you need to know about investing in Scheme 33 Karachi — prices, development status, top sectors, and ROI expectations for 2024.' },
  { title:'ASF City Karachi: New Launch Prices & Full Review',              category:'Market Analysis',areaSlug:'scheme-33',         areaLabel:'Scheme 33',         schemeSlug:'asf-city',          schemeLabel:'ASF City',         tags:['asf city','scheme 33','affordable housing','new launch'],                         excerpt:'ASF City offers one of the most affordable entry points near Scheme 33. We break down pricing, location, development timeline, and real investment potential.' },
  { title:'Falaknaz Projects Scheme 33 — Honest Investment Review',         category:'Investment',    areaSlug:'scheme-33',         areaLabel:'Scheme 33',         schemeSlug:'falaknaz-projects', schemeLabel:'Falaknaz Projects', tags:['falaknaz','scheme 33','apartments','payment plan'],                               excerpt:'Falaknaz Projects has multiple apartment complexes in Scheme 33. We analyse the developer track record, payment plans, rental potential, and resale market.' },
  { title:'DHA Karachi Phase 8: Prices, Possession & Investment Guide',     category:'Buying Guide',  areaSlug:'clifton',           areaLabel:'Clifton',           schemeSlug:'dha-karachi',       schemeLabel:'DHA Karachi',      tags:['dha karachi','phase 8','possession','investment'],                                 excerpt:'DHA Phase 8 is Karachi most active real-estate market. Complete guide to current prices, top streets, available inventory, and future appreciation outlook.' },
  { title:'5 Best Sectors in DHA Karachi to Buy in 2024',                  category:'Investment',    areaSlug:'clifton',           areaLabel:'Clifton',           schemeSlug:'dha-karachi',       schemeLabel:'DHA Karachi',      tags:['dha karachi','best sectors','residential','buying guide'],                         excerpt:'From Phase 1 to Phase 8 — which DHA Karachi sectors offer the best value for end-users and investors right now? We rank them using price, development, and yield data.' },
  { title:'DHA Karachi Plots vs Houses: Which Should You Buy?',             category:'Property Tips', areaSlug:'clifton',           areaLabel:'Clifton',           schemeSlug:'dha-karachi',       schemeLabel:'DHA Karachi',      tags:['dha karachi','plots','houses','comparison','roi'],                                 excerpt:'The eternal DHA dilemma — buy a plot and build, or buy a ready house? We crunch the numbers on capital growth, rental yield, and total cost of ownership.' },
  { title:'Bahria Town Karachi: Best Precincts for Investment 2024',        category:'Investment',    areaSlug:'malir-cantt',       areaLabel:'Malir Cantt',       schemeSlug:'bahria-town-karachi',schemeLabel:'Bahria Town Karachi',tags:['bahria town','precinct','investment','karachi'],                                  excerpt:'With 50+ precincts, picking the right one in Bahria Town Karachi is critical. We rank the top precincts by development, price trajectory, and rental demand.' },
  { title:'Bahria Town Karachi Villa vs Apartment: Which to Buy?',          category:'Buying Guide',  areaSlug:'malir-cantt',       areaLabel:'Malir Cantt',       schemeSlug:'bahria-town-karachi',schemeLabel:'Bahria Town Karachi',tags:['bahria town','villa','apartment','comparison'],                                   excerpt:'Villa or apartment — which makes more financial sense in Bahria Town Karachi? Side-by-side comparison of prices, maintenance, rentals, and resale liquidity.' },
  { title:'Gulshan-e-Iqbal Property Market Report 2024',                   category:'Market Analysis',areaSlug:'gulshan-e-iqbal',   areaLabel:'Gulshan-e-Iqbal',   schemeSlug:'',                  schemeLabel:'',                 tags:['gulshan','market report','karachi','residential'],                                 excerpt:'Gulshan-e-Iqbal continues to be one of Karachi most active markets. Comprehensive breakdown of current prices, rental trends, and block-by-block outlook.' },
  { title:'Saima Projects Gulshan: Full Price & Project Review',            category:'Investment',    areaSlug:'gulshan-e-iqbal',   areaLabel:'Gulshan-e-Iqbal',   schemeSlug:'saima-projects',    schemeLabel:'Saima Projects',   tags:['saima','gulshan','apartments','new projects','floor plan'],                        excerpt:'Saima Projects has delivered 15+ projects in Gulshan-e-Iqbal. Detailed look at current launches, payment plans, developer credibility, and investor returns.' },
  { title:'North Nazimabad Karachi: Best Blocks to Buy Property',           category:'Buying Guide',  areaSlug:'north-nazimabad',   areaLabel:'North Nazimabad',   schemeSlug:'',                  schemeLabel:'',                 tags:['north nazimabad','blocks','buying guide','residential','karachi'],                 excerpt:'North Nazimabad remains excellent value. We rank every block by price, road quality, schools proximity, and expected appreciation over the next 3 years.' },
  { title:'Malir Cantt Karachi: A Hidden Gem for Investors',                category:'Investment',    areaSlug:'malir-cantt',       areaLabel:'Malir Cantt',       schemeSlug:'',                  schemeLabel:'',                 tags:['malir cantt','investment','affordable','karachi','east karachi'],                  excerpt:'Malir Cantt is quietly becoming one of Karachi top investment addresses. Low entry prices, strong rental demand, and major infrastructure upgrades underway.' },
  { title:'PECHS Karachi: Why It Remains the Most Stable Market',          category:'Market Analysis',areaSlug:'pechs',             areaLabel:'PECHS',             schemeSlug:'',                  schemeLabel:'',                 tags:['pechs','karachi','stable','residential','investment'],                             excerpt:'PECHS has delivered consistent appreciation for 50+ years. We analyse what makes this area so resilient and whether it still offers value to new investors.' },
  { title:'Islamabad Real Estate 2024: Sectors, Prices & Best Buys',       category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['islamabad','real estate','sectors','investment','2024'],                          excerpt:'Islamabad property market is maturing rapidly. Complete guide to sector-wise pricing, current hot zones, and investment strategies for the capital territory.' },
  { title:'Lahore Property Market: DHA vs Bahria vs LDA City',             category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['lahore','dha lahore','bahria town lahore','lda city','comparison'],                excerpt:'Three giants of Lahore real estate — DHA, Bahria Town, and LDA City. Head-to-head comparison of prices, development, resale market, and investment prospects.' },
  { title:'How to Buy Property as an Overseas Pakistani',                  category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['overseas','nrp','buying guide','legal','power of attorney'],                      excerpt:'Step-by-step guide for overseas Pakistanis to purchase property remotely — from selecting the right property to completing transfer without visiting Pakistan.' },
  { title:'Property Tax in Pakistan 2024: What Every Buyer Must Know',     category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['tax','cvt','stamp duty','withholding tax','filer','non-filer'],                    excerpt:'CVT, withholding tax, stamp duty, capital gains tax — a complete breakdown of every tax you will pay when buying, selling, or renting property in Pakistan.' },
  { title:'Top 5 Upcoming Housing Projects in Karachi 2024-25',            category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['new projects','karachi','upcoming','2024','investment','pre-launch'],              excerpt:'Five Karachi housing schemes set to launch in 2024-25 with strong investment credentials. Get in early before prices rise after official launch.' },
  { title:'Renting vs Buying in Pakistan: A Full Financial Breakdown',     category:'Property Tips', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['rent vs buy','financial analysis','decision','pakistan','tips'],                   excerpt:'Should you rent or buy your home in Pakistan right now? We model 5-year and 10-year scenarios using real market data so you can make a data-driven decision.' },
  { title:'How to Verify Property Documents in Karachi — Step by Step',    category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['documents','verification','fraud','title deed','noc','karachi'],                   excerpt:'Property fraud costs Pakistanis billions every year. This step-by-step guide shows you how to verify every critical document before signing any agreement.' },
  { title:'Pakistan Real Estate Market Outlook 2025',                      category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['market outlook','2025','pakistan','investment','interest rates'],                  excerpt:'Interest rates, GDP trajectory, CPEC developments, and policy changes — comprehensive analysis of Pakistan real estate market heading into 2025.' },
  { title:'Construction Cost per Sq Ft in Pakistan 2024',                 category:'Property Tips', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['construction cost','per sq ft','grey structure','finishing','pakistan'],           excerpt:'Planning to build your own home? Detailed cost breakdown by city, construction quality tier (economy, standard, premium), and structural type for 2024.' },
  { title:'Home Loan in Pakistan 2024: Banks, Rates & Eligibility',        category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['home loan','mortgage','meezan bank','hbl','sbp','interest rate'],                  excerpt:'Which bank offers the best home loan in Pakistan right now? Comparison of rates, maximum tenure, down payment requirements, and eligibility criteria for 2024.' },
  { title:'Karachi Apartments: New Launch vs Resale — Which to Pick?',    category:'Buying Guide',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['apartments','karachi','new launch','resale','comparison','roi'],                   excerpt:'New-launch apartments offer payment plans; resale offers immediate possession. We compare both options across risk, yield, appreciation, and overall value.' },
  { title:'10 Red Flags When Buying Property in Pakistan',                 category:'Property Tips', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['red flags','fraud','buying guide','safety','pakistan','legal'],                    excerpt:'From fake NOCs to double-selling — these are the 10 most common property frauds in Pakistan and exactly how to protect yourself before you pay a single rupee.' },
];

// ─── NEW 20 EXTRA BLOGS ───────────────────────────────────────────────────────
const BLOGS_EXTRA = [
  { title:'Rawalpindi Property Market 2024: Bahria Town vs Askari Housing', category:'Market Analysis',areaSlug:'rawalpindi',        areaLabel:'Rawalpindi',        schemeSlug:'bahria-town-rawalpindi',schemeLabel:'Bahria Town Rawalpindi',tags:['rawalpindi','bahria town','askari','investment','2024'],                          excerpt:'Rawalpindi real estate is booming. Detailed comparison of Bahria Town Rawalpindi, Askari Housing, and CDA sectors for investors and end-users in 2024.' },
  { title:'Faisalabad Real Estate: Best Areas to Invest in 2024',           category:'Investment',    areaSlug:'faisalabad',        areaLabel:'Faisalabad',        schemeSlug:'',                  schemeLabel:'',                 tags:['faisalabad','investment','susan road','canal road','residential'],                 excerpt:'Pakistan third largest city is emerging as a real-estate investment hub. Complete breakdown of top investment areas, price trends, and rental yields in Faisalabad.' },
  { title:'Gulistan-e-Johar Karachi: Block-by-Block Property Guide',        category:'Buying Guide',  areaSlug:'gulistan-e-johar',  areaLabel:'Gulistan-e-Johar', schemeSlug:'',                  schemeLabel:'',                 tags:['gulistan-e-johar','karachi','blocks','residential','property guide'],              excerpt:'Gulistan-e-Johar is one of Karachi fastest growing areas. This block-by-block guide covers pricing, livability, infrastructure, and investment potential.' },
  { title:'Surjani Town & Buffer Zone Karachi Investment Report',            category:'Investment',    areaSlug:'surjani-town',      areaLabel:'Surjani Town',      schemeSlug:'',                  schemeLabel:'',                 tags:['surjani town','buffer zone','affordable','karachi','investment'],                  excerpt:'Surjani Town and Buffer Zone offer some of Karachi most affordable entry points. Here is whether these areas represent genuine value or hidden risk for investors.' },
  { title:'SITE Area Karachi: Industrial & Commercial Investment Guide',     category:'Investment',    areaSlug:'site-area',         areaLabel:'SITE Area',         schemeSlug:'',                  schemeLabel:'',                 tags:['site area','industrial','commercial','karachi','warehouse','factory'],             excerpt:'SITE Industrial Area in Karachi is Pakistan manufacturing heartland. Guide to industrial plot prices, warehouse rentals, and the best streets for commercial investment.' },
  { title:'B-17 Multi Gardens Islamabad: Complete Buyer Guide',              category:'Buying Guide',  areaSlug:'islamabad',         areaLabel:'Islamabad',         schemeSlug:'b-17-multi-gardens', schemeLabel:'B-17 Multi Gardens',tags:['b-17','islamabad','multi gardens','investment','cda'],                            excerpt:'B-17 Multi Gardens is fast becoming Islamabad most popular affordable housing scheme. Detailed guide to prices, sector-by-sector development, and investment outlook.' },
  { title:'Bahria Town Rawalpindi: Phase 7 vs Phase 8 — Which to Buy?',    category:'Buying Guide',  areaSlug:'rawalpindi',        areaLabel:'Rawalpindi',        schemeSlug:'bahria-town-rawalpindi',schemeLabel:'Bahria Town Rawalpindi',tags:['bahria town rawalpindi','phase 7','phase 8','comparison','investment'],           excerpt:'Phase 7 or Phase 8 in Bahria Town Rawalpindi? Head-to-head comparison of prices, development status, commercial potential, and long-term appreciation.' },
  { title:'How to Rent Commercial Property in Karachi: Legal Guide',        category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['commercial rent','karachi','legal','agreement','noc','landlord'],                  excerpt:'Renting commercial property in Karachi involves multiple legal steps. From drafting a watertight lease agreement to registering it — everything you need to know.' },
  { title:'Korangi Industrial Area Karachi: Property & Rental Guide',       category:'Market Analysis',areaSlug:'korangi',           areaLabel:'Korangi',           schemeSlug:'',                  schemeLabel:'',                 tags:['korangi','industrial','karachi','warehouse','commercial','rental'],                excerpt:'Korangi houses thousands of factories and warehouses. Current rental and sale prices, infrastructure quality, and why businesses continue to choose Korangi.' },
  { title:'New Karachi Sector Investment Guide 2024',                       category:'Investment',    areaSlug:'new-karachi',       areaLabel:'New Karachi',       schemeSlug:'',                  schemeLabel:'',                 tags:['new karachi','affordable','plots','residential','investment','2024'],               excerpt:'New Karachi sectors are seeing renewed investor interest in 2024. Affordable pricing, improved infrastructure, and strong rental demand are driving the momentum.' },
  { title:'Capital Gains Tax on Property in Pakistan 2024 — Full Guide',   category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['capital gains tax','property','pakistan','filer','non-filer','2024'],              excerpt:'Capital gains tax on property was restructured in the Finance Act 2024. Here is exactly how much tax you will owe when selling property — filer vs non-filer breakdown.' },
  { title:'Stamp Duty & CVT Rates in Pakistan 2024 — Province by Province', category:'Legal Advice', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['stamp duty','cvt','sindh','punjab','islamabad','transfer tax','2024'],             excerpt:'Stamp duty and CVT rates vary significantly across Punjab, Sindh, KPK, and Islamabad. Province-by-province breakdown with worked examples for a Rs 1 crore property.' },
  { title:'How to Spot a Genuine Property Agent in Pakistan',               category:'Property Tips', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['property agent','pakistan','tips','fraud','verification','choosing agent'],        excerpt:'Pakistan has thousands of property agents — many unlicensed and some fraudulent. Here are 8 specific signs of a trustworthy, qualified real estate agent.' },
  { title:'Plot vs Apartment vs House in Pakistan: ROI Comparison 2024',   category:'Investment',    areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['plot vs apartment','roi','pakistan','investment','comparison','2024'],             excerpt:'Which delivers better returns — a raw plot, a constructed house, or an apartment in Pakistan? Side-by-side ROI analysis across capital appreciation and rental yield.' },
  { title:'How to Transfer Property Ownership in Karachi: Step-by-Step',   category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['property transfer','karachi','sbca','kda','registration','legal','documentation'], excerpt:'Transferring property ownership in Karachi involves SBCA, KDA, or KMC procedures depending on the area. This step-by-step guide walks you through every stage.' },
  { title:'Karachi vs Lahore vs Islamabad: Where to Invest in 2024?',      category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['karachi','lahore','islamabad','comparison','where to invest','2024'],              excerpt:'Three cities, three different investment profiles. Comprehensive comparison of property prices, rental yields, capital appreciation, and quality of life for 2024.' },
  { title:'CPEC & Real Estate: Which Pakistani Cities Will Benefit Most?',  category:'Market Analysis',areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['cpec','gwadar','real estate','impact','investment','pakistan'],                    excerpt:'CPEC is transforming Pakistan economic geography. Analysis of which cities and corridors are seeing the most real estate activity and price appreciation because of CPEC.' },
  { title:'Understanding Power of Attorney for Property in Pakistan',       category:'Legal Advice',  areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['power of attorney','poa','overseas','legal','property','pakistan'],                 excerpt:'Power of Attorney is essential for overseas Pakistanis managing property transactions remotely. Complete guide to types, drafting, attestation, and common pitfalls.' },
  { title:'Real Estate Investment Trusts (REITs) in Pakistan: Are They Worth It?', category:'Investment', areaSlug:'',            areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['reit','real estate investment trust','pakistan','stock exchange','investment'],    excerpt:'Pakistan REIT market is growing. Honest assessment of whether REITs offer better risk-adjusted returns than direct property ownership for Pakistani investors.' },
  { title:'Green Building Trends in Pakistani Real Estate 2024',            category:'Property Tips', areaSlug:'',                 areaLabel:'',                  schemeSlug:'',                  schemeLabel:'',                 tags:['green building','sustainable','solar','energy saving','pakistan','trends'],        excerpt:'Solar panels, energy-efficient design, and green certifications are entering Pakistani real estate. How these trends affect property values and what buyers should look for.' },
];

// ─── ORIGINAL 20 + NEW 15 CONTACT MESSAGES ───────────────────────────────────
const MESSAGES_ORIGINAL = [
  { name:'Ahmed Khan',     subj:'Interested in DHA Phase 6 Property',    msg:'I am looking to buy a property in DHA Karachi Phase 6. My budget is around 2.5 crore. Please share available options and arrange a visit.',                                              read:false },
  { name:'Sara Malik',     subj:'Query about Bahria Town Plot',           msg:'I am interested in a 240 sq yd plot in Bahria Town. What are current prices in Precinct 15 and 17? Any possession-paid options?',                                                        read:false },
  { name:'Usman Ali',      subj:'Need Rental in Gulshan',                 msg:'Looking for a 2-bedroom apartment for rent in Gulshan Block 10. My budget is PKR 35,000 per month. Please share available options.',                                                     read:false },
  { name:'Fatima Raza',    subj:'Construction Cost Inquiry',              msg:'Can you share the construction cost per square foot for a 3-bed house in grey structure + standard finishing in Scheme 33?',                                                             read:false },
  { name:'Bilal Ahmed',    subj:'Investment Advice Scheme 33',            msg:'I have PKR 50 lacs to invest. Should I buy a plot in Scheme 33 or a constructed house? Looking for best 5-year ROI.',                                                                    read:false },
  { name:'Zainab Sheikh',  subj:'Need Property Valuation',               msg:'I have a 200 sq yd house in North Nazimabad Block K. I want to sell it at market price. Can you please provide a valuation?',                                                             read:false },
  { name:'Hassan Siddiqui',subj:'Looking for Commercial Space',           msg:'We need a commercial office space around 3,000 sq ft in Clifton or Shahrah-e-Faisal. Please share available options.',                                                                  read:false },
  { name:'Nadia Butt',     subj:'Home Loan Query',                       msg:'I want to apply for a Meezan Bank home loan for a house in DHA Phase 6. Can you guide me on the documentation process?',                                                                  read:false },
  { name:'Kamran Mirza',   subj:'3 Bed House Budget 1.5 Crore',          msg:'My total budget is PKR 1.5 crore. I need a proper 3-bedroom house anywhere in Karachi. What are my best options right now?',                                                              read:false },
  { name:'Hina Qureshi',   subj:'Plot in Malir Cantt',                   msg:'What is the current rate per sq yd for plots in Malir Cantt? Is any builder finance or instalment option available?',                                                                     read:true  },
  { name:'Tariq Hussain',  subj:'Overseas Investment Inquiry',           msg:'I am an overseas Pakistani living in the UK. I want to invest around GBP 40,000 in Karachi real estate. Please advise on best options.',                                                  read:true  },
  { name:'Maria Alam',     subj:'Shop Rent Scheme 33',                   msg:'Looking for a shop for rent in Scheme 33 main area, around 200-250 sq ft. Good footfall area is important.',                                                                              read:true  },
  { name:'Asif Nazar',     subj:'New Project Booking Help',              msg:'What documents are required to buy a plot in Bahria Town Karachi? I am a first-time buyer and want to avoid any issues.',                                                                  read:true  },
  { name:'Sana Jamil',     subj:'2 Bed Flat for Rent',                   msg:'Can you email me the complete price list and floor plans for Falaknaz Dreams in Scheme 33? Very interested in 2-bedroom units.',                                                           read:true  },
  { name:'Imran Baig',     subj:'Selling My Property',                   msg:'I want to rent out my 5-marla house in DHA Phase 2. Can you help find a reliable tenant and manage the property?',                                                                        read:true  },
  { name:'Rabia Tanveer',  subj:'2 Bed Flat Rent Near School',           msg:'I need a 2-bedroom flat for rent in North Nazimabad near a good school. Budget is PKR 25,000-30,000 per month.',                                                                          read:true  },
  { name:'Waqar Shah',     subj:'Commercial Plot Inquiry',               msg:'Looking to purchase a commercial plot on any main road in Karachi under PKR 2 crore. Please share available options.',                                                                     read:true  },
  { name:'Lubna Mehmood',  subj:'Relocation from Lahore to Karachi',     msg:'My family wants to relocate from Lahore to Karachi. We need a good 4-bedroom house for rent. Budget PKR 80,000-100,000.',                                                                 read:true  },
  { name:'Fahad Rizwan',   subj:'Buy Flat as Rental Investment',         msg:'I want to buy a flat in Karachi as a rental investment. Budget PKR 80 lacs. Which area gives best rental yield right now?',                                                               read:true  },
  { name:'Amna Chaudhry',  subj:'Restaurant Space Required',             msg:'We are planning to open a restaurant in Karachi. Need a ground-floor commercial space on a busy road. Please advise.',                                                                    read:true  },
];

const MESSAGES_EXTRA = [
  { name:'Zubair Hassan',   subj:'Rawalpindi Property Inquiry',          msg:'I am looking for a 5 marla house in Bahria Town Rawalpindi Phase 8. Budget is PKR 38 lacs. Please guide me on available inventory and the payment process.',                              read:false },
  { name:'Madiha Farooq',   subj:'Faisalabad Plot Investment',           msg:'My uncle wants to buy a 10 marla plot in Faisalabad. He prefers Susan Road or Canal Road area. Budget PKR 35-40 lacs. What are the current rates?',                                        read:false },
  { name:'Shoaib Akhtar',   subj:'Islamabad Apartment Under 3 Crore',   msg:'Looking for a ready-to-move apartment in Islamabad. My budget is PKR 2.5-3 crore. Preferred areas are F-10, F-11, or G-11. Please share available options.',                               read:false },
  { name:'Rukhsana Begum',  subj:'DHA City Karachi Inquiry',             msg:'I am interested in a 125 sq yd plot in DHA City Karachi. Is it a good investment for the next 5 years? What are the current plot prices?',                                                 read:false },
  { name:'Faisal Rehman',   subj:'Warehouse for Rent Karachi',           msg:'My company needs a warehouse of 5,000-8,000 sq ft in Korangi or SITE area Karachi. Monthly budget is PKR 3-4 lacs. Please share available options.',                                       read:false },
  { name:'Aisha Gondal',    subj:'Home for Retired Couple',              msg:'My parents are retired and want a 3-bedroom bungalow for purchase in a quiet, peaceful area of Karachi. Budget is PKR 1.8-2.2 crore. Which areas do you recommend?',                        read:true  },
  { name:'Naveed Iqbal',    subj:'Transfer of Property Documents Help',  msg:'I inherited a house in Gulshan Block 3. I need help with the KMC transfer process. Can your legal team assist with documentation and transfer fees?',                                       read:true  },
  { name:'Saima Khatoon',   subj:'Overseas Investment from Canada',      msg:'I am a Pakistani living in Canada. I want to invest CAD 50,000 in a plot in Islamabad or Rawalpindi. How do I proceed remotely? What legal protection do I have?',                         read:true  },
  { name:'Rizwan Qureshi',  subj:'Office Space for IT Startup',          msg:'We are an IT startup of 20 people looking for a modern office space in DHA or Clifton area of Karachi. Budget PKR 150,000-200,000 per month. Fiber internet is must.',                     read:true  },
  { name:'Noor Fatima',     subj:'Plot in Gulistan-e-Johar',             msg:'I am looking for a 120 sq yd plot in Gulistan-e-Johar. Block 13 or 14 preferred. Current price range and possession status please. My budget is up to PKR 6 lacs.',                        read:true  },
  { name:'Hamid Sultan',    subj:'Property Valuation for Selling',       msg:'I own a 240 sq yd double storey house in Scheme 33 Sector 33-A. I want to sell and need a current market valuation. When can your team visit for assessment?',                             read:true  },
  { name:'Qurat ul Ain',    subj:'Studio Apartment for Rent',            msg:'I am a working woman moving to Karachi for a new job. I need a studio or 1-bed furnished apartment for rent in a safe area. Budget PKR 20,000-25,000. What are my options?',               read:true  },
  { name:'Adeel Zafar',     subj:'Investment Property Under 50 Lacs',    msg:'My savings are PKR 45 lacs. I want a property that will give me good returns in 3-5 years. Should I buy a plot in an upcoming scheme or a flat in an established area?',                   read:true  },
  { name:'Bushra Perveen',  subj:'House Verification Before Purchase',   msg:'I found a house in North Nazimabad Block K that I want to buy. The owner is showing me a sale deed. How can I verify the documents and ensure there is no litigation or lien on it?',      read:true  },
  { name:'Omar Shafiq',     subj:'Commercial Property for Pharmacy',     msg:'I want to open a pharmacy in a residential area of Karachi. Need a shop of about 200-300 sq ft on ground floor. Preferred areas: Gulshan, Gulistan, or North Nazimabad. What is available?', read:true },
];

// ─── Descriptions ─────────────────────────────────────────────────────────────
const PROP_DESCS: Record<string, string> = {
  residential: 'A well-maintained residential property in a sought-after neighbourhood. Features spacious rooms, quality tile work, and a neat exterior. Convenient access to schools, hospitals, and commercial centres. Documents clear and possession in hand.',
  plot:        'Excellent investment plot in a prime location with all utilities — electricity, gas, water — available. Ideal for immediate construction or land banking. Clear title, NOC from relevant authority, possession immediate.',
  commercial:  'Strategically positioned commercial unit with high visibility and consistent footfall. Suitable for retail, showroom, restaurant, or office. Ample parking, ground-floor access, and backup power provision. High rental demand area.',
  office:      'Modern open-plan office space in a prestigious business district. Features false ceiling, AC ducts, high-speed fibre-ready, reliable backup generator, and a professional reception lobby. Ideal for corporate or call-centre use.',
};

// ─── Staff users to seed ──────────────────────────────────────────────────────
const SELLERS = [
  { name:'Khalid Properties',   email:'khalid.prop@gmail.com',    password:'Seller@1234', role:'seller' },
  { name:'Rehman Real Estate',  email:'rehman.re@gmail.com',      password:'Seller@1234', role:'seller' },
  { name:'Amjad Builders',      email:'amjad.builders@gmail.com', password:'Seller@1234', role:'seller' },
  { name:'Al-Hamd Properties',  email:'alhamd.prop@gmail.com',    password:'Seller@1234', role:'seller' },
  { name:'City Homes Pakistan', email:'cityhomes.pk@gmail.com',   password:'Seller@1234', role:'seller' },
];

const WRITERS = [
  { name:'Hamza Shahid',   email:'hamza.writer@nayabrealestate.com',  password:'Writer@1234', role:'writer' },
  { name:'Areeba Javed',   email:'areeba.writer@nayabrealestate.com', password:'Writer@1234', role:'writer' },
  { name:'Saad Mehmood',   email:'saad.writer@nayabrealestate.com',   password:'Writer@1234', role:'writer' },
];

// ─── main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(URI);
  console.log('✅  Connected to MongoDB Atlas\n');

  const AdminUser = mongoose.models.AdminUser      || mongoose.model('AdminUser',      schemas.AdminUser);
  const Agent     = mongoose.models.Agent          || mongoose.model('Agent',          schemas.Agent);
  const Property  = mongoose.models.Property       || mongoose.model('Property',       schemas.Property);
  const Blog      = mongoose.models.Blog           || mongoose.model('Blog',           schemas.Blog);
  const Contact   = mongoose.models.ContactMessage || mongoose.model('ContactMessage', schemas.ContactMessage);

  let inserted = { agents:0, properties:0, blogs:0, messages:0, staff:0 };

  // ── Superadmin (only if not exists) ─────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || 'admin@nayabrealmarketing.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPass, 12);
    await AdminUser.create({ name:'Super Admin', email:adminEmail, password:hashed, role:'superadmin' });
    console.log(`✅  Superadmin created — ${adminEmail} / ${adminPass}`);
  } else {
    console.log(`ℹ️   Superadmin exists (${adminEmail})`);
  }

  // ── Sellers & Writers (additive) ────────────────────────────────────────────
  for (const s of [...SELLERS, ...WRITERS]) {
    const exists = await AdminUser.findOne({ email: s.email });
    if (!exists) {
      const hashed = await bcrypt.hash(s.password, 12);
      await AdminUser.create({ name:s.name, email:s.email, password:hashed, role:s.role, active:true });
      inserted.staff++;
      console.log(`  + ${s.role}: ${s.name} (${s.email})`);
    }
  }
  if (inserted.staff > 0) console.log(`✅  Added ${inserted.staff} staff accounts (sellers + writers)`);
  else console.log(`ℹ️   All staff accounts already exist`);

  // ── Agents (additive — skip by email) ───────────────────────────────────────
  const allAgentDefs = [...AGENTS_ORIGINAL, ...AGENTS_EXTRA];
  for (const [i, a] of allAgentDefs.entries()) {
    const exists = await Agent.findOne({ email: a.email });
    if (!exists) {
      await Agent.create({
        name: a.name, email: a.email, phone: a.phone,
        image: AGENT_IMGS[i % AGENT_IMGS.length],
        bio: a.bio, specialization: a.spec,
        properties: a.props, active: true,
      });
      inserted.agents++;
    }
  }
  console.log(`✅  Agents: ${inserted.agents} new added (${await Agent.countDocuments()} total)`);

  // ── Get all agent IDs for property assignment ────────────────────────────────
  const agentIds = (await Agent.find().select('_id')).map((d: any) => d._id.toString());

  // ── Properties (additive — skip by slug) ────────────────────────────────────
  const allPropDefs = [...PROPS_ORIGINAL, ...PROPS_EXTRA];
  for (const [i, p] of allPropDefs.entries()) {
    const propSlug = slug(`${p.t}-${i}`);
    const exists = await Property.findOne({ slug: propSlug });
    if (!exists) {
      await Property.create({
        title:       p.t,
        slug:        propSlug,
        description: PROP_DESCS[p.type],
        price:       p.price,
        priceType:   p.pt,
        rentPeriod:  p.rt ?? undefined,
        location:    p.loc,
        city:        p.city,
        area:        p.area,
        bedrooms:    p.beds,
        bathrooms:   p.baths,
        type:        p.type,
        status:      p.status,
        featured:    p.feat,
        images: [
          PROP_IMGS[i % PROP_IMGS.length],
          PROP_IMGS[(i + 3) % PROP_IMGS.length],
          PROP_IMGS[(i + 6) % PROP_IMGS.length],
        ],
        agentId: agentIds[i % agentIds.length],
        views:   views(),
      });
      inserted.properties++;
    }
  }
  console.log(`✅  Properties: ${inserted.properties} new added (${await Property.countDocuments()} total)`);

  // ── Blogs (additive — skip by slug) ─────────────────────────────────────────
  const allBlogDefs = [...BLOGS_ORIGINAL, ...BLOGS_EXTRA];
  for (const [i, b] of allBlogDefs.entries()) {
    const blogSlug = slug(b.title);
    const exists = await Blog.findOne({ slug: blogSlug });
    if (!exists) {
      await Blog.create({
        title:           b.title,
        slug:            blogSlug,
        excerpt:         b.excerpt,
        content:         blogHTML(b.title, b.areaLabel || 'Pakistan', b.category),
        image:           BLOG_IMGS[i % BLOG_IMGS.length],
        images:          i % 4 === 0
                           ? [BLOG_IMGS[(i+1) % BLOG_IMGS.length], BLOG_IMGS[(i+2) % BLOG_IMGS.length]]
                           : [],
        author:          'Nayab Real Marketing',
        category:        b.category,
        tags:            b.tags,
        published:       true,
        views:           views(),
        areaSlug:        b.areaSlug,
        areaLabel:       b.areaLabel,
        schemeSlug:      b.schemeSlug,
        schemeLabel:     b.schemeLabel,
        metaTitle:       `${b.title} | Nayab Real Marketing`,
        metaDescription: b.excerpt.slice(0, 160),
        metaKeywords:    b.tags.join(', '),
      });
      inserted.blogs++;
    }
  }
  console.log(`✅  Blogs: ${inserted.blogs} new added (${await Blog.countDocuments()} total)`);

  // ── Contact messages (always append — no unique key) ─────────────────────────
  const allMsgs = [...MESSAGES_ORIGINAL, ...MESSAGES_EXTRA];
  const currentMsgCount = await Contact.countDocuments();
  if (currentMsgCount < allMsgs.length) {
    // Only insert the ones we don't have yet (by count offset)
    const toInsert = allMsgs.slice(currentMsgCount);
    for (const m of toInsert) {
      const firstName = m.name.split(' ')[0].toLowerCase();
      await Contact.create({
        name:    m.name,
        email:   `${firstName}${ri(10,99)}@gmail.com`,
        phone:   `+92-3${ri(10,39)}-${ri(1000000,9999999)}`,
        subject: m.subj,
        message: m.msg,
        read:    m.read,
      });
      inserted.messages++;
    }
  }
  console.log(`✅  Messages: ${inserted.messages} new added (${await Contact.countDocuments()} total)`);

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n📊  Final database counts:');
  console.log(`     AdminUsers:  ${await AdminUser.countDocuments()}`);
  console.log(`     Agents:      ${await Agent.countDocuments()}`);
  console.log(`     Properties:  ${await Property.countDocuments()}`);
  console.log(`     Blogs:       ${await Blog.countDocuments()}`);
  console.log(`     Messages:    ${await Contact.countDocuments()}`);

  console.log('\n🔑  Credentials:');
  console.log(`     Superadmin: ${adminEmail} / ${adminPass}`);
  console.log(`     Sellers:    any from SELLERS list above / Seller@1234`);
  console.log(`     Writers:    any from WRITERS list above / Writer@1234`);

  console.log('\n🎉  Done! Your existing data was NOT deleted.\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('\n❌  Seed failed:', err.message); process.exit(1); });