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
  // Area / Scheme classification
  areaSlug?: string;
  areaLabel?: string;
  schemeSlug?: string;
  schemeLabel?: string;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface AreaSummary {
  slug: string;
  label: string;
  image: string;
  description: string;
  blogCount: number;
  schemes: SchemeSummary[];
}

export interface SchemeSummary {
  slug: string;
  label: string;
  logo: string;
  image: string;
  areaSlug: string;
  areaLabel: string;
  blogCount: number;
}

export interface ManagedArea {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
  createdAt: string;
}

export interface ManagedScheme {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  image: string;
  areaId: string;
  areaName: string;
  description: string;
  order: number;
  createdAt: string;
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
  areaScheme?: string;
  area: number;
  areaUnit?: 'sqft' | 'sqyd' | 'marla' | 'kanal';
  bedrooms: number;
  bathrooms: number;
  type: 'residential' | 'commercial' | 'office' | 'plot' | 'shop';
  status: 'available' | 'sold' | 'rented';
  images: string[];
  amenities?: string[];
  featured: boolean;
  agentId: string;
  submittedBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionNote?: string;
  createdAt: string;
  views: number;
}

export interface Agent {
  _id: string;
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

export interface Inquiry {
  _id:           string;
  userId:        string;
  userName:      string;
  userEmail:     string;
  propertyId:    string;
  propertyTitle: string;
  propertySlug:  string;
  message:       string;
  phone?:        string;
  read:          boolean;
  createdAt:     string;
}

export interface UserProfile {
  _id:             string;
  name:            string;
  email:           string;
  role:            string;
  avatar?:         string;
  savedProperties: string[];
  createdAt:       string;
}
