import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
const FROM     = `"Nayab Real Marketing" <${process.env.SMTP_USER}>`;

// ── Shared layout wrapper ─────────────────────────────────────────────────────
function layout(title: string, body: string) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px">
    <div style="background:#0f1e3d;padding:24px;border-radius:12px 12px 0 0;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">${title}</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:14px">Nayab Real Marketing</p>
    </div>
    <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,.06)">
      ${body}
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px">
        © Nayab Real Marketing · <a href="${BASE_URL}" style="color:#c0392b">nayabrealmarketing.com</a>
      </p>
    </div>
  </div>`;
}

// ── 1. Email verification ─────────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${BASE_URL}/api/auth/verify-email?token=${token}`;
  const html = layout('✉️ Verify Your Email', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${name}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      Thank you for registering as a <strong>Seller</strong> on Nayab Real Marketing.
      Please verify your email address to activate your account and start listing properties.
    </p>
    <div style="text-align:center;margin:28px 0">
      <a href="${link}"
        style="background:#c0392b;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
        Verify Email Address
      </a>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center">
      This link expires in <strong>24 hours</strong>. If you didn't sign up, you can safely ignore this email.
    </p>
    <div style="background:#f8fafc;border-radius:8px;padding:12px;margin-top:16px">
      <p style="color:#64748b;font-size:12px;margin:0;word-break:break-all">
        Or copy this link: <a href="${link}" style="color:#c0392b">${link}</a>
      </p>
    </div>
  `);
  await transporter.sendMail({ from: FROM, to, subject: 'Verify your Nayab Real account', html });
}

// ── 1b. OTP verification email ────────────────────────────────────────────────
export async function sendOtpEmail(to: string, name: string, otp: string) {
  const html = layout('🔐 Your Verification Code', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${name}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      Thank you for registering on <strong>Nayab Real Marketing</strong>.
      Use the code below to verify your email address and activate your account.
    </p>
    <div style="text-align:center;margin:28px 0">
      <div style="display:inline-block;background:#f1f5f9;padding:18px 40px;border-radius:12px;border:2px dashed #c0392b">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#0f1e3d">${otp}</span>
      </div>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center">
      This code expires in <strong>10 minutes</strong>. If you didn't sign up, you can safely ignore this email.
    </p>
  `);
  await transporter.sendMail({ from: FROM, to, subject: `${otp} — Verify your Nayab Real account`, html });
}

// ── 2. Admin notification: new property submitted ─────────────────────────────
export async function sendNewPropertyNotification({
  adminEmails, sellerName, sellerEmail, propertyTitle, propertyId,
}: {
  adminEmails:   string[];
  sellerName:    string;
  sellerEmail:   string;
  propertyTitle: string;
  propertyId:    string;
}) {
  const reviewLink = `${BASE_URL}/dashboard/properties/${propertyId}/edit`;
  const html = layout('🏠 New Property Submitted for Review', `
    <p style="color:#1e293b;font-size:16px">A seller has submitted a new property listing for your review.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Seller:</strong> ${sellerName}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Email:</strong>
        <a href="mailto:${sellerEmail}" style="color:#c0392b">${sellerEmail}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Property:</strong> ${propertyTitle}</td></tr>
    </table>
    <div style="background:#fef9c3;border-left:4px solid #f59e0b;padding:14px;border-radius:0 8px 8px 0;margin:16px 0">
      <p style="color:#92400e;font-size:14px;margin:0">
        ⚠️ This listing is <strong>pending approval</strong> and is not visible to the public yet.
      </p>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${reviewLink}"
        style="background:#c0392b;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
        Review &amp; Approve →
      </a>
    </div>
  `);
  await transporter.sendMail({
    from: FROM, to: adminEmails.join(', '),
    subject: `New Listing for Review: ${propertyTitle}`,
    html,
  });
}

// ── 3. Seller notification: property approved ─────────────────────────────────
export async function sendPropertyApprovedEmail(to: string, sellerName: string, propertyTitle: string, slug: string) {
  const publicLink = `${BASE_URL}/properties/${slug}`;
  const html = layout('✅ Your Property is Live!', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${sellerName}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      Great news! Your property listing <strong>${propertyTitle}</strong> has been approved
      and is now live on Nayab Real Marketing.
    </p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      We are dedicated to helping you reach thousands of potential buyers quickly and securely. 
      Why stop here? List more properties with <strong>Nayab Real Marketing</strong> and grow your amazing portfolio!
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="${publicLink}"
        style="background:#16a34a;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
        View Live Listing →
      </a>
    </div>
  `);
  await transporter.sendMail({ from: FROM, to, subject: `✅ Approved: ${propertyTitle}`, html });
}

// ── 4. Seller notification: property rejected ─────────────────────────────────
export async function sendPropertyRejectedEmail(
  to: string, sellerName: string, propertyTitle: string, note: string
) {
  const dashLink = `${BASE_URL}/dashboard/properties`;
  const html = layout('❌ Listing Update Required', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${sellerName}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      Your property listing <strong>${propertyTitle}</strong> requires some changes before it can go live.
    </p>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px;border-radius:0 8px 8px 0;margin:16px 0">
      <p style="color:#7f1d1d;font-size:14px;margin:0"><strong>Admin note:</strong><br>${note}</p>
    </div>
    <p style="color:#475569;font-size:14px">
      Please edit your listing to address the above points, then resubmit for review.
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="${dashLink}"
        style="background:#c0392b;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
        Go to My Listings →
      </a>
    </div>
  `);
  await transporter.sendMail({ from: FROM, to, subject: `Action Required: ${propertyTitle}`, html });
}

// ── 5. Contact inquiry (existing) ─────────────────────────────────────────────
export async function sendContactNotification({
  to, fromName, fromEmail, phone, subject, message, propertyTitle,
}: {
  to: string[]; fromName: string; fromEmail: string;
  phone?: string; subject: string; message: string; propertyTitle?: string;
}) {
  const propertyLine = propertyTitle
    ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Property:</strong> ${propertyTitle}</td></tr>` : '';
  const html = layout('📨 New Client Inquiry', `
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>From:</strong> ${fromName}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Email:</strong>
        <a href="mailto:${fromEmail}" style="color:#c0392b">${fromEmail}</a></td></tr>
      ${phone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Phone:</strong> ${phone}</td></tr>` : ''}
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Subject:</strong> ${subject}</td></tr>
      ${propertyLine}
    </table>
    <div style="margin-top:16px;background:#f8fafc;border-left:4px solid #c0392b;padding:16px;border-radius:0 8px 8px 0">
      <p style="color:#1e293b;font-size:15px;line-height:1.7;margin:0">${message.replace(/\n/g, '<br>')}</p>
    </div>
    <div style="margin-top:24px;text-align:center">
      <a href="${BASE_URL}/dashboard/messages"
        style="background:#c0392b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
        View in Admin Panel →
      </a>
    </div>
  `);
  await transporter.sendMail({
    from: FROM, to: to.join(', '), replyTo: fromEmail,
    subject: `New Inquiry: ${subject}`, html,
  });
}

// ── 6. Password Reset OTP ─────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, name: string, otp: string) {
  const html = layout('🔑 Reset Your Password', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${name}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      You requested to reset your password for <strong>Nayab Real Marketing</strong>.
      Use the code below to complete the process.
    </p>
    <div style="text-align:center;margin:28px 0">
      <div style="display:inline-block;background:#fff1f0;padding:18px 40px;border-radius:12px;border:2px dashed #c0392b">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#c0392b">${otp}</span>
      </div>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center">
      This code expires in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.
    </p>
  `);
  await transporter.sendMail({ from: FROM, to, subject: `${otp} — Reset your Nayab Real password`, html });
}

// ── 7. Seller notification: property under review ──────────────────────────────
export async function sendPropertyUnderReviewEmail(to: string, sellerName: string, propertyTitle: string) {
  const html = layout('⏳ Your Property is Under Review', `
    <p style="color:#1e293b;font-size:16px">Hi <strong>${sellerName}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      Thank you for listing with <strong>Nayab Real Marketing</strong>!
      Your property listing <strong>${propertyTitle}</strong> has been received and is currently under review.
    </p>
    <p style="color:#475569;font-size:14px;line-height:1.7">
      We will notify you once it has been approved and published to the site.
      Keep an eye on your dashboard or email for updates.
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="${BASE_URL}/dashboard/properties"
         style="background:#c0392b;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
        Go to Dashboard
      </a>
    </div>
  `);
  await transporter.sendMail({ from: FROM, to, subject: `Under Review: ${propertyTitle}`, html });
}
