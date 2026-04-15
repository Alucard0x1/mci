import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'email-smtp.ap-southeast-1.amazonaws.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || 'admissions@missioncritical.institute';
const APP_URL = process.env.APP_URL || 'https://missioncritical.institute';

export async function sendRegistrationConfirmation(data: {
  to: string;
  name: string;
  registrationNumber: string;
  courseTitle: string;
  courseCode: string;
  scheduleDate: string;
  scheduleLocation: string;
  total: number;
  paymentMethod: string;
}) {
  const isPaid = data.paymentMethod === 'card';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <div style="background: #6B0F1A; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Mission Critical Institute</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #6B0F1A; margin-top: 0;">Registration ${isPaid ? 'Confirmed' : 'Received'}</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for registering with Mission Critical Institute. ${isPaid ? 'Your payment has been received and your seat is confirmed.' : 'Your registration has been received. Please complete payment to confirm your seat.'}</p>
        
        <div style="background: #f9f9f9; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #666;">Registration No.</td><td style="padding: 6px 0; font-weight: bold;">${data.registrationNumber}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Course</td><td style="padding: 6px 0; font-weight: bold;">${data.courseTitle} (${data.courseCode})</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Date</td><td style="padding: 6px 0;">${data.scheduleDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Location</td><td style="padding: 6px 0;">${data.scheduleLocation}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Total</td><td style="padding: 6px 0; font-weight: bold;">USD ${data.total.toFixed(2)}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Payment</td><td style="padding: 6px 0;">${isPaid ? '✅ Paid' : '⏳ Pending — ' + data.paymentMethod}</td></tr>
          </table>
        </div>

        ${!isPaid ? `<p><strong>Payment Instructions:</strong> ${data.paymentMethod === 'bank_transfer' ? 'Please transfer the amount to our bank account. Details will be sent separately.' : 'A corporate invoice will be sent to your billing contact.'}</p>` : ''}
        
        <p>Joining instructions will be sent 48 hours before the program start date.</p>
        <p style="margin-top: 24px;">If you have any questions, contact us at <a href="mailto:admissions@missioncritical.institute" style="color: #6B0F1A;">admissions@missioncritical.institute</a></p>
      </div>
      <div style="background: #f4f6f8; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
        Mission Critical Institute · Singapore<br/>
        <a href="${APP_URL}" style="color: #6B0F1A;">missioncritical.institute</a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Mission Critical Institute" <${FROM}>`,
      to: data.to,
      subject: `Registration ${isPaid ? 'Confirmed' : 'Received'} — ${data.registrationNumber}`,
      html,
    });
    console.log(`Email sent to ${data.to}`);
  } catch (err) {
    console.error('Email send failed:', err);
    // Don't throw — email failure shouldn't block registration
  }
}
