import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration from environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@cleandeep.co.za';
const SENDER_NAME = process.env.SENDER_NAME || 'CleanDeep';
const SENDER_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  location: string;
  requestedDate?: string;
  storeSlug: string;
  storeName: string;
  notes?: string;
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    const { customerName, customerEmail, location, requestedDate, storeName, notes } = data;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0;">✓ Booking Received!</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your service request has been submitted</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${customerName}</p>
          <p style="margin: 10px 0;"><strong>Service Provider:</strong> ${storeName}</p>
          <p style="margin: 10px 0;"><strong>Location:</strong> ${location}</p>
          ${requestedDate ? `<p style="margin: 10px 0;"><strong>Preferred Date:</strong> ${new Date(requestedDate).toLocaleDateString()}</p>` : ''}
          <p style="margin: 10px 0;"><strong>Contact:</strong> ${customerEmail}</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Details:</strong> ${notes}</p>` : ''}
        </div>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
          <p style="margin: 0; color: #92400e;">
            <strong>What happens next?</strong><br>
            Our team will review your request and contact you within 24 hours to confirm your appointment and discuss any specific requirements.
          </p>
        </div>

        <div style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>Thank you for choosing CleanDeep. We look forward to serving you!</p>
          <p style="margin-bottom: 0;">
            <strong>CleanDeep Team</strong><br>
            <a href="https://cleandeep.co.za" style="color: #10b981; text-decoration: none;">www.cleandeep.co.za</a>
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: customerEmail,
      subject: `✓ Booking Received - ${storeName}`,
      html: emailHtml,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send admin notification about new booking
 */
export async function sendAdminNotification(data: BookingEmailData) {
  try {
    const { customerName, customerEmail, customerPhone, location, requestedDate, storeName, notes } = data;
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'cleandeep.cpt@gmail.com';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1f2937; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0;">📩 New Booking Request</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">${storeName}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Customer Details</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${customerName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #10b981;">${customerEmail}</a></p>
          <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${customerPhone}" style="color: #10b981;">${customerPhone}</a></p>
          <p style="margin: 10px 0;"><strong>Location:</strong> ${location}</p>
          ${requestedDate ? `<p style="margin: 10px 0;"><strong>Preferred Date:</strong> ${new Date(requestedDate).toLocaleDateString()}</p>` : ''}
          ${notes ? `<p style="margin: 10px 0;"><strong>Details:</strong> ${notes}</p>` : ''}
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://cleandeep.co.za/admin/${data.storeSlug}" style="background-color: #10b981; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
            View in Dashboard
          </a>
        </div>

        <p style="color: #6b7280; font-size: 12px;">
          This is an automated notification. Log in to your admin dashboard to manage this booking.
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: adminEmail,
      subject: `New Booking Request - ${storeName}`,
      html: emailHtml,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send test email to verify Resend configuration
 */
export async function sendTestEmail(toEmail: string) {
  try {
    // Validate email format
    if (!toEmail || !toEmail.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: toEmail,
      subject: 'Test Email - TotalLŸ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0;">✓ Test Email Successful</h1>
          </div>
          <p style="color: #333; line-height: 1.6;">
            This is a test email from TotalLŸ. If you received this, Resend is configured correctly!
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            <strong>Email Configuration:</strong><br>
            Service: Resend<br>
            From: ${SENDER_ADDRESS}<br>
            To: ${toEmail}
          </p>
        </div>
      `,
    });

    if (!result.data?.id) {
      return { success: false, error: 'No message ID returned from email service' };
    }

    console.log(`Test email sent successfully to ${toEmail}, messageId: ${result.data.id}`);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: `Failed to send test email: ${errorMessage}` };
  }
}

/**
 * Send password reset email to store contact email
 */
export async function sendPasswordResetEmail(storeName: string, storeSlug: string, toEmail: string, temporaryPassword: string) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0f172a; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🔑 Password Reset Request</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">TotalLŸ Command Center</p>
        </div>

        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
          <p style="margin-top: 0; color: #334155;">Hello,</p>
          <p style="color: #334155; line-height: 1.6;">
            A password reset was requested for the admin dashboard of <strong>${storeName}</strong>.
          </p>
          <p style="color: #334155; line-height: 1.6;">
            We have generated a secure temporary password for your account:
          </p>
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #cbd5e1;">
            <code style="font-family: monospace; font-size: 20px; font-weight: bold; color: #0f172a; letter-spacing: 2px;">${temporaryPassword}</code>
          </div>
          <p style="color: #334155; line-height: 1.6;">
            Please use this temporary password to log in. Once logged in, go to the <strong>Settings</strong> tab to set a new password of your choice.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://cleandeep.co.za/admin/${storeSlug}" style="background-color: #10b981; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
            Access Admin Dashboard
          </a>
        </div>

        <div style="color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="margin: 0 0 5px 0;">This email was sent from an automated system. Please do not reply to it.</p>
          <p style="margin: 0;">TotalLŸ &copy; 2026</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: toEmail,
      subject: `🔑 Password Reset - ${storeName}`,
      html: emailHtml,
    });

    if (!result.data?.id) {
      return { success: false, error: 'No message ID returned from email service' };
    }

    console.log(`Password reset email sent successfully to ${toEmail} for store ${storeSlug}`);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: `Failed to send password reset email: ${errorMessage}` };
  }
}

