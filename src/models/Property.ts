import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
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
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ['sale', 'rent'], required: true },
    rentPeriod: { type: String, enum: ['month', 'year'] },
    location: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    type: { type: String, enum: ['residential', 'commercial', 'office', 'plot'], required: true },
    status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    agentId: { type: String, required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PropertySchema.index({ slug: 1 });
PropertySchema.index({ featured: 1, status: 1 });
PropertySchema.index({ city: 1, type: 1, priceType: 1 });

export const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
