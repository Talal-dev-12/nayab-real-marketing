import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  specialization: string;
  properties: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    image: { type: String, default: '' },
    bio: { type: String, default: '' },
    specialization: { type: String, default: 'General' },
    properties: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Agent = mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
