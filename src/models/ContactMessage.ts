import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    userId: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactMessageSchema.index({ read: 1, createdAt: -1 });

export const ContactMessage = mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
