import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  images: string[];
  author: string;
  authorId: string;   // ← links to AdminUser._id for writer ownership
  category: string;
  tags: string[];
  published: boolean;
  views: number;
  // ── Area / Scheme taxonomy ────────────────────────────────────
  areaSlug: string;
  areaLabel: string;
  schemeSlug: string;
  schemeLabel: string;
  // ── SEO ──────────────────────────────────────────────────────
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true },
    excerpt:         { type: String, required: true },
    content:         { type: String, required: true },
    image:           { type: String, default: '' },
    images:          [{ type: String }],
    author:          { type: String, default: 'Nayab Real Marketing' },
    authorId:        { type: String, default: '' },   // ← writer ownership
    category:        { type: String, default: 'General' },
    tags:            [{ type: String }],
    published:       { type: Boolean, default: false },
    views:           { type: Number, default: 0 },
    // area / scheme — optional
    areaSlug:        { type: String, default: '', lowercase: true, trim: true },
    areaLabel:       { type: String, default: '', trim: true },
    schemeSlug:      { type: String, default: '', lowercase: true, trim: true },
    schemeLabel:     { type: String, default: '', trim: true },
    // SEO
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords:    { type: String, default: '' },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ areaSlug: 1, published: 1 });
BlogSchema.index({ schemeSlug: 1, published: 1 });
BlogSchema.index({ authorId: 1 });

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
