import mongoose, { Schema, Document } from 'mongoose';

export interface IArea extends Document {
  name:         string;
  slug:         string;
  image:        string;   // Cloudinary URL — drone shot / high-quality visual
  description:  string;
  order:        number;   // manual sort for carousel display
  restaurants:  string[];
  popularPlaces: string[];
  markets:      string[];
  createdAt:    Date;
  updatedAt:    Date;
}

const AreaSchema = new Schema<IArea>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    image:       { type: String, default: '' },
    description: { type: String, default: '' },
    order:       { type: Number, default: 0 },
    restaurants: { type: [String], default: [] },
    popularPlaces: { type: [String], default: [] },
    markets:     { type: [String], default: [] },
  },
  { timestamps: true }
);

AreaSchema.index({ order: 1 });

export const Area = mongoose.models.Area || mongoose.model<IArea>('Area', AreaSchema);
