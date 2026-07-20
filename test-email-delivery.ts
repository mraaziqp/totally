/**
 * Live Resend email delivery test
 * Run: npx tsx test-email-delivery.ts
 */
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

const key   = process.env.RESEND_API_KEY;
const from  = process.env.SENDER_EMAIL ?? 'info@cleandeep.co.za';
const name  = process.env.SENDER_NAME  ?? 'CleanDeep';
const admin = process.env.ADMIN_NOTIFY_EMAIL ?? 'cleandeep.cpt@gmail.com';

async function run() {
  if (!key) { console.error('❌  RESEND_API_KEY not set'); process.exit(1); }

  const resend = new Resend(key);

  console.log('─────────────────────────────────────────');
  console.log('Resend key (first 8):', key.slice(0, 8) + '...');
  console.log('Sender              :', `${name} <${from}>`);
  console.log('Admin notify email  :', admin);
  console.log('─────────────────────────────────────────');

  // 1. Send to admin
  console.log('\n[1] Sending admin notification test → ' + admin);
  const adminResult = await resend.emails.send({
    from: `${name} <${from}>`,
    to: admin,
    subject: '🔔 [TEST] New Booking Notification - CleanDeep',
    html: `<div style="font-family:Arial;padding:20px;background:#f3f4f6;border-radius:8px;">
      <h2 style="color:#10b981">✅ Admin notification is working!</h2>
      <p>This confirms booking emails will reach <strong>${admin}</strong> whenever a customer submits the booking form.</p>
      <p style="color:#6b7280;font-size:12px">Sent via Resend at ${new Date().toISOString()}</p>
    </div>`,
  });
  if (adminResult.error) {
    console.error('❌  Admin email FAILED:', JSON.stringify(adminResult.error, null, 2));
  } else {
    console.log('✅  Admin email sent — messageId:', adminResult.data?.id);
  }

  // 2. Send to a customer test address (the sender's own verified email for safe testing)
  const customerTest = admin; // Use same address as safe test target
  console.log('\n[2] Sending customer confirmation test → ' + customerTest);
  const custResult = await resend.emails.send({
    from: `${name} <${from}>`,
    to: customerTest,
    subject: '✓ [TEST] Booking Received - CleanDeep',
    html: `<div style="font-family:Arial;padding:20px;background:#f0fdf4;border-radius:8px;">
      <h2 style="color:#10b981">✅ Customer confirmation is working!</h2>
      <p>This is what a customer receives after submitting the booking form.</p>
      <p style="color:#6b7280;font-size:12px">Sent via Resend at ${new Date().toISOString()}</p>
    </div>`,
  });
  if (custResult.error) {
    console.error('❌  Customer email FAILED:', JSON.stringify(custResult.error, null, 2));
  } else {
    console.log('✅  Customer email sent — messageId:', custResult.data?.id);
  }

  console.log('\n─────────────────────────────────────────');
  console.log('Done. Check your inbox (and spam folder).');
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
