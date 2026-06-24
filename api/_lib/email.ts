import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  location: string;
  requestedDate?: string;
  storeSlug: string;
  storeName: string;
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    const { customerName, customerEmail, location, requestedDate, storeName } = data;

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
        </div>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
          <p style="margin: 0; color: #92400e;">
            <strong>What happens next?</strong><br>
            Our team will review your request and contact you within 24 hours to confirm your appointment and discuss any specific requirements.
          </p>
        </div>

        <div style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>Thank you for choosing TotalLŸ. We look forward to serving you!</p>
          <p style="margin-bottom: 0;">
            <strong>TotalLŸ Team</strong><br>
            <a href="https://cleandeep.co.za" style="color: #10b981; text-decoration: none;">www.cleandeep.co.za</a>
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'TotalLŸ <bookings@cleandeep.co.za>',
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
    const { customerName, customerEmail, customerPhone, location, requestedDate, storeName } = data;
    const adminEmail = 'admin@cleandeep.co.za';

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
      from: 'TotalLŸ <noreply@cleandeep.co.za>',
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
    const result = await resend.emails.send({
      from: 'TotalLŸ <test@cleandeep.co.za>',
      to: toEmail,
      subject: 'Test Email - TotalLŸ',
      html: '<p>This is a test email from TotalLŸ. If you received this, Resend is configured correctly!</p>',
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
