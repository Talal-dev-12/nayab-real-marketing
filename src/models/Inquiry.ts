import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  userId:        string;   // User._id who sent it
  userName:      string;
  userEmail:     string;
  propertyId:    string;   // Property._id
  propertyTitle: string;
  propertySlug:  string;
  message:       string;
  phone?:        string;
  read:          boolean;
  createdAt:     Date;
  updatedAt:     Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    userId:        { type: String, required: true },
    userName:      { type: String, required: true },
    userEmail:     { type: String, required: true },
    propertyId:    { type: String, required: true },
    propertyTitle: { type: String, required: true },
    propertySlug:  { type: String, required: true },
    message:       { type: String, required: true },
    phone:         { type: String, default: '' },
    read:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

InquirySchema.index({ userId: 1, createdAt: -1 });
InquirySchema.index({ propertyId: 1 });
InquirySchema.index({ read: 1, createdAt: -1 });

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
