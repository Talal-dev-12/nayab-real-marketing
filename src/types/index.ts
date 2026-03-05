export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceType: 'sale' | 'rent';
  rentPeriod?: 'month' | 'year';
  location: string;
  city: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: 'residential' | 'commercial' | 'office' | 'plot';
  status: 'available' | 'sold' | 'rented';
  images: string[];
  featured: boolean;
  agentId: string;
  createdAt: string;
  views: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  specialization: string;
  properties: number;
  active: boolean;
  createdAt: string;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
