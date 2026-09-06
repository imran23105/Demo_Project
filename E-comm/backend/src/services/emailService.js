const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const emailTemplates = {
  welcome: (name) => ({
    subject: '🎉 Welcome to Nebula — Your Shopping Adventure Begins!',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">NEBULA</h1>
          <p style="color: #a8c8e8; margin: 8px 0 0; font-size: 14px;">Live Better. Every Day.</p>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="color: #1e3a5f; margin-bottom: 16px;">Welcome, ${name}! 🛍️</h2>
          <p style="color: #555; line-height: 1.6;">Thank you for joining Nebula. We're thrilled to have you as part of our community.</p>
          <p style="color: #555; line-height: 1.6;">Explore thousands of products, enjoy exclusive deals, and experience seamless shopping.</p>
          <a href="${process.env.CLIENT_URL}/shop" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px;">Start Shopping →</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #aaa; font-size: 12px; background: #f0f0f0; border-radius: 0 0 8px 8px;">
          <p>© 2025 Nebula E-Commerce. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (name, orderNumber, totalAmount, items) => ({
    subject: `✅ Order Confirmed — ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">NEBULA</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e3a5f;">Order Confirmed! 🎉</h2>
          <p>Hi ${name}, your order <strong>${orderNumber}</strong> has been confirmed.</p>
          <p style="font-size: 18px; font-weight: bold; color: #1e3a5f;">Total: ₹${totalAmount}</p>
          <p>You'll receive a shipping notification once your order is dispatched.</p>
          <a href="${process.env.CLIENT_URL}/orders" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">Track Order →</a>
        </div>
      </div>
    `,
  }),

  resetPassword: (name, resetUrl) => ({
    subject: '🔐 Reset Your Nebula Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">NEBULA</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e3a5f;">Password Reset Request</h2>
          <p>Hi ${name}, we received a request to reset your password.</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: bold;">Reset Password →</a>
          <p style="margin-top: 20px; color: #888; font-size: 13px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  }),

  verifyEmail: (name, verificationUrl) => ({
    subject: '📧 Verify Your Nebula Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">NEBULA</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1e3a5f;">Verify Your Email</h2>
          <p>Hi ${name}, please verify your email address to complete registration.</p>
          <a href="${verificationUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: bold;">Verify Email →</a>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async ({ to, ...template }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`ℹ️ [Email] Skipped sending email to ${to} (EMAIL_USER / EMAIL_PASS not configured in .env)`);
    return null;
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: `"Nebula Store" <${process.env.EMAIL_USER}>`,
    to,
    ...template,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email send failed:', error.message);
    // Don't throw — email failure shouldn't break the request
  }
};

module.exports = { sendEmail, emailTemplates };
