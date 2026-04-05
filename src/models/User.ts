import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name:                string;
  email:               string;
  password?:           string;
  role:                'user' | 'seller' | 'writer' | 'agent' | 'manager' | 'superadmin';
  googleId?:           string;
  avatar?:             string;
  active:              boolean;
  lastLogin?:          Date;
  savedProperties:     string[];
  // Email verification
  emailVerified:       boolean;
  verificationToken?:  string;
  verificationExpiry?: Date;
  otpCode?:            string;
  otpExpiry?:          Date;
  createdAt:           Date;
  updatedAt:           Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:                { type: String, required: true, trim: true },
    email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:            { type: String, select: false },
    role:                { type: String, enum: ['user', 'seller', 'writer', 'agent', 'manager', 'superadmin'], default: 'user' },
    googleId:            { type: String, sparse: true },
    avatar:              { type: String },
    active:              { type: Boolean, default: true },
    lastLogin:           { type: Date },
    savedProperties:     [{ type: String }],
    emailVerified:       { type: Boolean, default: false },
    verificationToken:   { type: String },
    verificationExpiry:  { type: Date },
    otpCode:             { type: String, select: false },
    otpExpiry:           { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
