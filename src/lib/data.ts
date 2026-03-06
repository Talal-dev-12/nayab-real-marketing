import { Blog, Property, Agent, ContactMessage, TrafficData } from '@/types';

// Default seed data
export const defaultBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Top 10 Tips for Buying Your First Home in Pakistan',
    slug: 'tips-buying-first-home-pakistan',
    excerpt: 'Buying your first home is an exciting milestone. Here are the essential tips to help you navigate the real estate market in Pakistan.',
    content: `<p>Buying your first home is one of the most significant financial decisions you will ever make. In Pakistan's dynamic real estate market, it's essential to be well-prepared.</p>
    <h2>1. Set a Realistic Budget</h2>
    <p>Before you start looking at properties, determine how much you can afford. Consider not just the purchase price, but also registration fees, agent commissions, and renovation costs.</p>
    <h2>2. Get Pre-Approved for Financing</h2>
    <p>If you're considering a bank loan, get pre-approved first. This gives you a clear picture of your budget and makes you a more attractive buyer.</p>
    <h2>3. Choose the Right Location</h2>
    <p>Location is everything in real estate. Consider proximity to schools, hospitals, markets, and public transport when evaluating properties.</p>
    <h2>4. Work with a Trusted Agent</h2>
    <p>A reliable real estate agent can save you time and money. They know the local market and can help you find properties that match your requirements.</p>`,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    author: 'Nayab Real Marketing',
    category: 'Buying Guide',
    tags: ['home buying', 'first home', 'Pakistan', 'real estate tips'],
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    views: 1245,
  },
  {
    _id: '2',
    title: 'Karachi Real Estate Market Trends 2024',
    slug: 'karachi-real-estate-market-trends-2024',
    excerpt: 'An in-depth analysis of Karachi\'s real estate market, including price trends, hot neighborhoods, and investment opportunities.',
    content: `<p>Karachi, as Pakistan's economic hub, continues to see dynamic real estate activity. In 2024, several trends are shaping the market.</p>
    <h2>Rising Demand in DHA and Bahria Town</h2>
    <p>Gated communities continue to see strong demand driven by security concerns and better infrastructure.</p>
    <h2>Commercial Real Estate Growth</h2>
    <p>The commercial sector is seeing increased activity as businesses expand post-pandemic.</p>`,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    author: 'Nayab Real Marketing',
    category: 'Market Analysis',
    tags: ['Karachi', 'market trends', '2024', 'investment'],
    published: true,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    views: 987,
  },
  {
    _id: '3',
    title: 'How to Invest in Real Estate with Limited Capital',
    slug: 'invest-real-estate-limited-capital',
    excerpt: 'You don\'t need millions to start investing in real estate. Discover smart strategies to get started with what you have.',
    content: `<p>Real estate investment doesn't always require huge capital. Here are practical ways to start investing in property with limited funds.</p>
    <h2>Plot Investment</h2>
    <p>Buying a plot in an emerging area requires less capital than a built property but offers excellent appreciation potential.</p>
    <h2>Partnership Investments</h2>
    <p>Partner with other investors to pool resources and invest in bigger properties than you could afford alone.</p>`,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    author: 'Nayab Real Marketing',
    category: 'Investment',
    tags: ['investment', 'capital', 'strategy', 'beginners'],
    published: true,
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    views: 756,
  },
];

export const defaultProperties: Property[] = [
  {
    _id: '1',
    title: '5 Marla House in DHA Phase 6',
    slug: 'house-dha-phase-6-karachi',
    description: 'Beautiful 5 marla house in the heart of DHA Phase 6. Fully furnished with modern amenities.',
    price: 25000000,
    priceType: 'sale',
    location: 'DHA Phase 6, Karachi',
    city: 'Karachi',
    area: 1125,
    bedrooms: 3,
    bathrooms: 2,
    type: 'residential',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    featured: true,
    agentId: '1',
    createdAt: '2024-01-10T10:00:00Z',
    views: 342,
  },
  {
    _id: '2',
    title: '10 Marla Corner Plot in Bahria Town',
    slug: 'corner-plot-bahria-town-karachi',
    description: 'Prime location 10 marla corner plot in Bahria Town Karachi. Ideal for construction.',
    price: 18000000,
    priceType: 'sale',
    location: 'Bahria Town, Karachi',
    city: 'Karachi',
    area: 2250,
    bedrooms: 0,
    bathrooms: 0,
    type: 'plot',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    featured: true,
    agentId: '2',
    createdAt: '2024-01-15T10:00:00Z',
    views: 218,
  },
  {
    _id: '3',
    title: 'Commercial Office in Clifton Block 5',
    slug: 'office-clifton-block-5-karachi',
    description: 'Fully furnished commercial office space available for rent in prime Clifton location.',
    price: 150000,
    priceType: 'rent',
    rentPeriod: 'month',
    location: 'Clifton Block 5, Karachi',
    city: 'Karachi',
    area: 1800,
    bedrooms: 0,
    bathrooms: 2,
    type: 'office',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    featured: false,
    agentId: '1',
    createdAt: '2024-02-01T10:00:00Z',
    views: 167,
  },
];

export const defaultAgents: Agent[] = [
  {
    _id: '1',
    name: 'Muhammad Nayab',
    email: 'nayab@nayabrealestate.com',
    phone: '+92-300-1234567',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Senior real estate consultant with 10+ years of experience in Karachi\'s property market.',
    specialization: 'Residential & Commercial',
    properties: 45,
    active: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    _id: '2',
    name: 'Sara Ahmed',
    email: 'sara@nayabrealestate.com',
    phone: '+92-321-9876543',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Specializing in luxury properties and plot investments across Karachi\'s premium societies.',
    specialization: 'Luxury & Plots',
    properties: 32,
    active: true,
    createdAt: '2023-03-15T10:00:00Z',
  },
  {
    _id: '3',
    name: 'Ali Hassan',
    email: 'ali@nayabrealestate.com',
    phone: '+92-333-5551234',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in commercial real estate and investment properties with a focus on ROI maximization.',
    specialization: 'Commercial & Investment',
    properties: 28,
    active: true,
    createdAt: '2023-06-01T10:00:00Z',
  },
];

export const generateTrafficData = (): TrafficData[] => {
  const data: TrafficData[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 200 + 100),
      pageViews: Math.floor(Math.random() * 500 + 200),
      bounceRate: Math.floor(Math.random() * 30 + 30),
    });
  }
  return data;
};

export const defaultMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '+92-300-1111111',
    subject: 'Interested in DHA Property',
    message: 'I am interested in the 5 marla house in DHA Phase 6. Please contact me for a viewing.',
    read: false,
    createdAt: '2024-03-10T14:30:00Z',
  },
  {
    id: '2',
    name: 'Fatima Malik',
    email: 'fatima@example.com',
    phone: '+92-321-2222222',
    subject: 'Plot Inquiry',
    message: 'Looking for a plot in Bahria Town. What are the available options?',
    read: true,
    createdAt: '2024-03-09T10:15:00Z',
  },
];

// Storage keys
export const STORAGE_KEYS = {
  BLOGS: 'nrm_blogs',
  PROPERTIES: 'nrm_properties',
  AGENTS: 'nrm_agents',
  MESSAGES: 'nrm_messages',
  TRAFFIC: 'nrm_traffic',
  ADMIN_AUTH: 'nrm_admin_auth',
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
