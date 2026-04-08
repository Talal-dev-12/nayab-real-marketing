import mongoose, { Schema, Document } from 'mongoose';

export interface IHousingScheme extends Document {
  name:         string;
  slug:         string;
  logo:         string;   // Cloudinary URL — official scheme logo
  image:        string;   // optional banner/cover image
  areaId:       string;   // optional ref to parent Area
  areaName:     string;   // denormalised for display
  description:  string;
  order:        number;   // manual sort for carousel display
  createdAt:    Date;
  updatedAt:    Date;
}

const HousingSchemeSchema = new Schema<IHousingScheme>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    logo:        { type: String, default: '' },
    image:       { type: String, default: '' },
    areaId:      { type: String, default: '' },
    areaName:    { type: String, default: '' },
    description: { type: String, default: '' },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

HousingSchemeSchema.index({ order: 1 });
HousingSchemeSchema.index({ areaId: 1 });

export const HousingScheme = mongoose.models.HousingScheme || mongoose.model<IHousingScheme>('HousingScheme', HousingSchemeSchema);
