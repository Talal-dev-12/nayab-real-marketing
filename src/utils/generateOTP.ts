import crypto from 'crypto';

export function generateOTP(length: number = 6): string {
  if (length === 6) {
    return crypto.randomInt(100000, 999999).toString();
  }
  
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max).toString();
}
