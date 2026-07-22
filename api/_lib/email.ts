import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration from environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@cleandeep.co.za';
const SENDER_NAME = process.env.SENDER_NAME || 'CleanDeep';
const SENDER_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;

// Business inbox that gets bcc'd on every customer-facing email, so the
// business can see exactly what the customer received.
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'cleandeep.cpt@gmail.com';

// User-supplied values (names, notes, messages) are interpolated directly
// into HTML emails — escape them so a name/note containing < or & can't
// break the layout or inject markup.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
    const safeName = escapeHtml(customerName);
    const safeEmail = escapeHtml(customerEmail);
    const safeLocation = escapeHtml(location);
    const safeStoreName = escapeHtml(storeName);
    const safeNotes = notes ? escapeHtml(notes.replace(/(https?:\/\/[^\s]+)/g, '').trim()) : '';

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#10b981;color:white;padding:24px;border-radius:12px;margin-bottom:20px;text-align:center;">
          <div style="font-size:36px;margin-bottom:8px;">✓</div>
          <h1 style="margin:0;font-size:22px;">Booking Received!</h1>
          <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">Your service request has been submitted</p>
        </div>

        <div style="background:#f3f4f6;padding:20px;border-radius:10px;margin-bottom:20px;">
          <h2 style="color:#1f2937;margin-top:0;">Booking Details</h2>
          <p style="margin:10px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:10px 0;"><strong>Service Provider:</strong> ${safeStoreName}</p>
          <p style="margin:10px 0;"><strong>Area:</strong> ${safeLocation}</p>
          ${requestedDate ? `<p style="margin:10px 0;"><strong>Preferred Date:</strong> ${new Date(requestedDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
          <p style="margin:10px 0;"><strong>Contact:</strong> ${safeEmail}</p>
          ${safeNotes ? `<p style="margin:10px 0;"><strong>Details:</strong> ${safeNotes}</p>` : ''}
        </div>

        <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin-bottom:20px;border-radius:5px;">
          <p style="margin:0;color:#92400e;">
            <strong>What happens next?</strong><br>
            Our team will review your request and contact you within 24 hours to confirm your appointment and discuss any specific requirements.
          </p>
        </div>

        <div style="color:#6b7280;font-size:14px;border-top:1px solid #e5e7eb;padding-top:20px;">
          <p>Thank you for choosing CleanDeep. We look forward to serving you!</p>
          <p style="margin-bottom:0;">
            <strong>CleanDeep Team</strong><br>
            <a href="https://cleandeep.co.za" style="color:#10b981;text-decoration:none;">www.cleandeep.co.za</a>
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: customerEmail,
      bcc: ADMIN_NOTIFY_EMAIL,
      subject: `Booking Received - ${storeName}`,
      html: emailHtml,
    });

    if (!result.data?.id) {
      console.error('Resend rejected booking confirmation email:', result.error);
      return { success: false, error: result.error?.message || 'No message ID returned from email service' };
    }

    return { success: true, messageId: result.data.id };
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
    const adminEmail = ADMIN_NOTIFY_EMAIL;
    const safeName = escapeHtml(customerName);
    const safeEmail = escapeHtml(customerEmail);
    const safePhone = escapeHtml(customerPhone);
    const safeLocation = escapeHtml(location);
    const safeStoreName = escapeHtml(storeName);

    // Split image URLs out of notes for thumbnail rendering
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const imageUrls: string[] = [];
    const cleanNotes = escapeHtml((notes || '').replace(urlRegex, (url) => {
      imageUrls.push(url);
      return '';
    }).trim());

    const thumbs = imageUrls
      .map(url => `<a href="${escapeHtml(url)}" target="_blank"><img src="${escapeHtml(url)}" width="90" height="90" style="object-fit:cover;border-radius:6px;border:2px solid #10b981;margin:4px;" /></a>`)
      .join('');

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;background:#f8fafc;">
        <div style="background:linear-gradient(135deg,#1f2937,#374151);color:white;padding:24px;border-radius:12px;margin-bottom:16px;text-align:center;">
          <div style="font-size:36px;margin-bottom:6px;">📩</div>
          <h1 style="margin:0;font-size:20px;">New Booking Request</h1>
          <p style="margin:6px 0 0;opacity:0.8;font-size:13px;">${safeStoreName}</p>
        </div>

        <div style="background:white;padding:20px;border-radius:12px;margin-bottom:12px;border:1px solid #e5e7eb;">
          <h2 style="color:#1f2937;margin-top:0;font-size:15px;border-bottom:2px solid #10b981;padding-bottom:8px;">Customer Details</h2>
          <p style="margin:8px 0;font-size:14px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:8px 0;font-size:14px;"><strong>Phone:</strong> <a href="tel:${safePhone}" style="color:#10b981;font-weight:bold;font-size:16px;">${safePhone}</a></p>
          <p style="margin:8px 0;font-size:14px;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#10b981;">${safeEmail}</a></p>
          <p style="margin:8px 0;font-size:14px;"><strong>Area:</strong> ${safeLocation}</p>
          ${requestedDate ? `<p style="margin:8px 0;font-size:14px;"><strong>Preferred Date:</strong> <span style="color:#10b981;font-weight:bold;">${new Date(requestedDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>` : ''}
        </div>

        ${cleanNotes || imageUrls.length > 0 ? `
        <div style="background:white;padding:20px;border-radius:12px;margin-bottom:12px;border:1px solid #e5e7eb;">
          <h2 style="color:#1f2937;margin-top:0;font-size:15px;border-bottom:2px solid #10b981;padding-bottom:8px;">Booking Details</h2>
          ${cleanNotes ? `<p style="color:#374151;line-height:1.7;white-space:pre-wrap;font-size:14px;">${cleanNotes}</p>` : ''}
          ${imageUrls.length > 0 ? `<p style="margin:8px 0;font-size:13px;"><strong>Customer Photos:</strong></p><div>${thumbs}</div>` : ''}
        </div>` : ''}

        <div style="text-align:center;margin:20px 0;">
          <a href="https://cleandeep.co.za/admin/${data.storeSlug}" style="background:#10b981;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;font-size:15px;">
            View in Admin Dashboard
          </a>
        </div>

        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          Reply to this email to contact the customer directly
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: adminEmail,
      replyTo: customerEmail,
      subject: `New Booking: ${customerName} - ${location}`,
      html: emailHtml,
    });

    if (!result.data?.id) {
      console.error('Resend rejected admin notification email:', result.error);
      return { success: false, error: result.error?.message || 'No message ID returned from email service' };
    }

    return { success: true, messageId: result.data.id };
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
    if (!toEmail || !toEmail.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: toEmail,
      subject: 'Test Email - CleanDeep',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#10b981;color:white;padding:20px;border-radius:10px;margin-bottom:20px;">
            <h1 style="margin:0;">Test Email Successful</h1>
          </div>
          <p style="color:#333;line-height:1.6;">
            This is a test email from CleanDeep. If you received this, Resend is configured correctly!
          </p>
          <p style="color:#666;font-size:12px;margin-top:20px;">
            <strong>Email Configuration:</strong><br>
            Service: Resend<br>
            From: ${escapeHtml(SENDER_ADDRESS)}<br>
            To: ${escapeHtml(toEmail)}
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
    const safeStoreName = escapeHtml(storeName);
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#0f172a;color:white;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center;">
          <h1 style="margin:0;font-size:24px;">Password Reset Request</h1>
          <p style="margin:5px 0 0;opacity:0.9;font-size:14px;">CleanDeep Admin</p>
        </div>

        <div style="background:#f8fafc;padding:25px;border-radius:10px;margin-bottom:20px;border:1px solid #e2e8f0;">
          <p style="margin-top:0;color:#334155;">Hello,</p>
          <p style="color:#334155;line-height:1.6;">
            A password reset was requested for the admin dashboard of <strong>${safeStoreName}</strong>.
          </p>
          <p style="color:#334155;line-height:1.6;">
            We have generated a secure temporary password for your account:
          </p>
          <div style="background:#f1f5f9;padding:15px;border-radius:8px;text-align:center;margin:20px 0;border:1px dashed #cbd5e1;">
            <code style="font-family:monospace;font-size:20px;font-weight:bold;color:#0f172a;letter-spacing:2px;">${temporaryPassword}</code>
          </div>
          <p style="color:#334155;line-height:1.6;">
            Please use this temporary password to log in. Once logged in, go to the <strong>Settings</strong> tab to set a new password of your choice.
          </p>
        </div>

        <div style="text-align:center;margin-bottom:25px;">
          <a href="https://cleandeep.co.za/admin/${storeSlug}" style="background:#10b981;color:white;padding:12px 25px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;">
            Access Admin Dashboard
          </a>
        </div>

        <div style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
          <p style="margin:0;">CleanDeep &copy; 2026</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: toEmail,
      subject: `Password Reset - ${storeName}`,
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

/**
 * Send a booking status update to the customer from the admin dashboard
 */
export async function sendClientUpdate(data: {
  customerName: string;
  customerEmail: string;
  storeName: string;
  storeSlug: string;
  message: string;
  status?: string;
}) {
  try {
    const { customerName, customerEmail, storeName, message, status } = data;
    const safeName = escapeHtml(customerName);
    const safeStoreName = escapeHtml(storeName);
    const safeMessage = escapeHtml(message);

    const statusColors: Record<string, string> = {
      NEW: '#3b82f6',
      CONTACTED: '#8b5cf6',
      CONFIRMED: '#10b981',
      COMPLETED: '#059669',
      CANCELLED: '#ef4444',
    };
    const statusColor = statusColors[status || 'NEW'] || '#10b981';
    const statusLabel = status || 'UPDATE';

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:${statusColor};color:white;padding:24px;border-radius:12px;margin-bottom:20px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">&#128364;</div>
          <h1 style="margin:0;font-size:20px;">Booking Update</h1>
          <p style="margin:6px 0 0;opacity:0.9;font-size:13px;">${safeStoreName} — Status: ${statusLabel}</p>
        </div>
        <div style="background:#f8fafc;padding:20px;border-radius:12px;margin-bottom:20px;border:1px solid #e5e7eb;">
          <p style="margin:0 0 8px;color:#374151;font-size:14px;">Dear <strong>${safeName}</strong>,</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        </div>
        <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:15px;border-radius:5px;margin-bottom:20px;">
          <p style="margin:0;color:#065f46;font-size:13px;">
            <strong>Need to reach us?</strong><br>
            Reply directly to this email or call us on 067 024 0972.
          </p>
        </div>
        <div style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;text-align:center;">
          <p style="margin:0 0 4px;"><strong>${safeStoreName} Team</strong></p>
          <a href="https://cleandeep.co.za" style="color:#10b981;text-decoration:none;">www.cleandeep.co.za</a>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: customerEmail,
      bcc: ADMIN_NOTIFY_EMAIL,
      subject: `Booking Update from ${storeName}`,
      html: emailHtml,
    });

    if (!result.data?.id) {
      return { success: false, error: 'No message ID returned' };
    }
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('Error sending client update email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
