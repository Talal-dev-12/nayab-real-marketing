import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail: use App Password, not your real password
  },
});

export async function sendContactNotification({
  to,          // admin email addresses
  fromName,
  fromEmail,
  phone,
  subject,
  message,
  propertyTitle,
}: {
  to: string[];
  fromName: string;
  fromEmail: string;
  phone?: string;
  subject: string;
  message: string;
  propertyTitle?: string;
}) {
  const propertyLine = propertyTitle
    ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Property:</strong> ${propertyTitle}</td></tr>`
    : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px">
      <div style="background:#0f1e3d;padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">📨 New Client Inquiry</h1>
        <p style="color:#94a3b8;margin:6px 0 0;font-size:14px">Nayab Real Marketing</p>
      </div>
      <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>From:</strong> ${fromName}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Email:</strong> <a href="mailto:${fromEmail}" style="color:#c0392b">${fromEmail}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Phone:</strong> ${phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#64748b;font-size:14px"><strong>Subject:</strong> ${subject}</td></tr>
          ${propertyLine}
        </table>
        <div style="margin-top:16px;background:#f8fafc;border-left:4px solid #c0392b;padding:16px;border-radius:0 8px 8px 0">
          <p style="color:#1e293b;font-size:15px;line-height:1.7;margin:0">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div style="margin-top:24px;text-align:center">
          <a href="${process.env.NEXTAUTH_URL}/admin/messages"
            style="background:#c0392b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
            View in Admin Panel →
          </a>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:20px">
          Nayab Real Marketing Admin System · Reply directly to ${fromEmail}
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Nayab Real Marketing" <${process.env.SMTP_USER}>`,
    to: to.join(', '),
    replyTo: fromEmail,
    subject: `New Inquiry: ${subject}`,
    html,
  });
}
