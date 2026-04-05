import mongoose, { Schema, Document } from 'mongoose';

export type AreaUnit = 'sqft' | 'sqyd' | 'marla' | 'kanal';

export interface IProperty extends Document {
  title:          string;
  slug:           string;
  description:    string;
  price:          number;
  priceType:      'sale' | 'rent';
  rentPeriod?:    'month' | 'year';
  location:       string;
  city:           string;
  area:           number;       // always stored in sqft internally
  areaUnit:       AreaUnit;     // unit the seller entered
  bedrooms:       number;
  bathrooms:      number;
  type:           'residential' | 'commercial' | 'office' | 'plot' | 'shop';
  status:         'available' | 'sold' | 'rented';
  images:         string[];
  featured:       boolean;
  agentId:        string;
  submittedBy?:   string;
  views:          number;
  /** Approval workflow */
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionNote?: string;
  createdAt:      Date;
  updatedAt:      Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true },
    description:    { type: String, required: true },
    price:          { type: Number, required: true, min: 0 },
    priceType:      { type: String, enum: ['sale', 'rent'], required: true },
    rentPeriod:     { type: String, enum: ['month', 'year'] },
    location:       { type: String, required: true },
    city:           { type: String, required: true },
    area:           { type: Number, required: true },
    areaUnit:       { type: String, enum: ['sqft', 'sqyd', 'marla', 'kanal'], default: 'sqft' },
    bedrooms:       { type: Number, default: 0 },
    bathrooms:      { type: Number, default: 0 },
    type:           { type: String, enum: ['residential', 'commercial', 'office', 'plot', 'shop'], required: true },
    status:         { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
    images:         [{ type: String }],
    featured:       { type: Boolean, default: false },
    agentId:        { type: String, required: true },
    submittedBy:    { type: String },
    views:          { type: Number, default: 0 },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionNote:  { type: String },
  },
  { timestamps: true }
);

PropertySchema.index({ slug: 1 });
PropertySchema.index({ featured: 1, status: 1 });
PropertySchema.index({ city: 1, type: 1, priceType: 1 });
PropertySchema.index({ submittedBy: 1 });
PropertySchema.index({ approvalStatus: 1 });

export const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
