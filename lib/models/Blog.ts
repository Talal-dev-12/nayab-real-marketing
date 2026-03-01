import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    author: { type: String, default: 'Nayab Real Marketing' },
    category: { type: String, default: 'Real Estate' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
BlogSchema.pre('save', function (this: IBlog) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});
// Index for fast slug lookups and text search
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
