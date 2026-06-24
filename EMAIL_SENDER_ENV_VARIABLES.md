# 🔧 Email Sender Environment Variables
**Production-Ready Email Configuration**

**Date Updated:** 2026-06-24  
**Status:** ✅ COMPLETE & CONFIGURABLE

---

## 📋 Overview

Email sender is now fully configurable via environment variables. No code changes needed to update sender address or name.

---

## 🔑 Environment Variables

### **SENDER_EMAIL**
```
Variable Name: SENDER_EMAIL
Type: String (email address)
Default: info@cleandeep.co.za
Required: No (uses default if not set)
Purpose: The email address that sends all system emails
```

**Valid Examples:**
- `info@cleandeep.co.za` (Primary)
- `noreply@cleandeep.co.za` (Alternative)
- `support@cleandeep.co.za` (Support)

**Important:** Must be verified with Resend API. Only use email addresses you own and have verified.

---

### **SENDER_NAME**
```
Variable Name: SENDER_NAME
Type: String (display name)
Default: TotalLŸ
Required: No (uses default if not set)
Purpose: The display name that appears in email clients
```

**Valid Examples:**
- `TotalLŸ` (Brand name)
- `TotalLŸ Team` (With team)
- `TotalLŸ Support` (With department)
- `Clean Deep` (Service specific)

---

## 📁 Configuration Files

### **.env (Local Development)**
```env
# Email Sender Configuration
SENDER_EMAIL="info@cleandeep.co.za"
SENDER_NAME="TotalLŸ"
```

### **Vercel Environment Variables (Production)**

**Steps to Configure:**

1. Go to: https://vercel.com
2. Select your project
3. Settings → Environment Variables
4. Add these variables:

| Variable Name | Value | Example |
|---|---|---|
| SENDER_EMAIL | Your email | info@cleandeep.co.za |
| SENDER_NAME | Display name | TotalLŸ |

---

## 🔄 How It Works

### **In Code (api/_lib/email.ts):**
```javascript
// Configuration from environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@cleandeep.co.za';
const SENDER_NAME = process.env.SENDER_NAME || 'TotalLŸ';
const SENDER_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;

// Used in all 3 email functions:
const result = await resend.emails.send({
  from: SENDER_ADDRESS,  // ← Uses environment variables
  to: customerEmail,
  subject: '...',
  html: '...',
});
```

### **Email That Gets Sent:**
```
From: TotalLŸ <info@cleandeep.co.za>
To: customer@email.com
Subject: ✓ Booking Received - Deep Cleaning
```

---

## ✅ Email Functions Using This

All 3 email functions use the configurable sender:

### **1. Customer Booking Confirmation**
```javascript
sendBookingConfirmation(data)
├─ From: SENDER_ADDRESS (from env vars)
├─ To: customer email
└─ Purpose: Confirm booking received
```

### **2. Admin Notification**
```javascript
sendAdminNotification(data)
├─ From: SENDER_ADDRESS (from env vars)
├─ To: admin email
└─ Purpose: Notify admin of new booking
```

### **3. Test Email**
```javascript
sendTestEmail(toEmail)
├─ From: SENDER_ADDRESS (from env vars)
├─ To: test recipient
└─ Purpose: Verify email service working
```

---

## 🚀 Deployment Checklist

### **Before Deploying to Vercel:**

- [ ] Email address is verified with Resend
- [ ] Email address is in correct format (something@cleandeep.co.za)
- [ ] Sender name is appropriate for brand
- [ ] Tested locally with .env variables
- [ ] All 3 email functions configured

### **After Adding to Vercel:**

1. Go to Vercel → Settings → Environment Variables
2. Add: `SENDER_EMAIL=info@cleandeep.co.za`
3. Add: `SENDER_NAME=TotalLŸ`
4. Click "Save"
5. Redeploy project
6. Test with email manager in dashboard
7. Verify emails arrive from correct sender

---

## 🔐 Security Notes

### **DO:**
✅ Use verified email addresses only  
✅ Keep secrets out of code  
✅ Use environment variables  
✅ Test before deploying  
✅ Monitor email delivery  

### **DON'T:**
❌ Hardcode email addresses  
❌ Use unverified addresses  
❌ Share email credentials  
❌ Use test addresses in production  

---

## 📧 Email Examples

### **What Customer Receives:**

**From:** TotalLŸ <info@cleandeep.co.za>  
**To:** john@example.com  
**Subject:** ✓ Booking Received - Deep Cleaning  

In Email Client:  
```
From: TotalLŸ <info@cleandeep.co.za>
Subject: ✓ Booking Received - Deep Cleaning
```

### **What Admin Receives:**

**From:** TotalLŸ <info@cleandeep.co.za>  
**To:** admin@cleandeep.co.za  
**Subject:** New Booking Request - Deep Cleaning  

In Email Client:  
```
From: TotalLŸ <info@cleandeep.co.za>
Subject: New Booking Request - Deep Cleaning
```

---

## 🔄 Changing the Sender

### **To Change Email Address:**

**Local (Development):**
1. Edit `.env`
2. Change: `SENDER_EMAIL="your-new-email@cleandeep.co.za"`
3. Save file
4. Restart dev server
5. Test with email manager

**Production (Vercel):**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Edit: `SENDER_EMAIL` variable
4. Save
5. Click "Redeploy"
6. Wait for deployment
7. Test in dashboard

### **To Change Display Name:**

**Local (Development):**
1. Edit `.env`
2. Change: `SENDER_NAME="Your New Name"`
3. Save file
4. Restart dev server
5. Test

**Production (Vercel):**
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Edit: `SENDER_NAME` variable
4. Save
5. Click "Redeploy"
6. Test

---

## 🧪 Testing the Configuration

### **Test Email Manager (Dashboard)**

1. Go to unit manager dashboard
2. Click EMAIL tab
3. Enter your email address
4. Click "Send Test Email"
5. Check inbox
6. **Verify:**
   - Email arrived ✓
   - From: info@cleandeep.co.za ✓
   - Display name: TotalLŸ ✓
   - Content correct ✓

---

## 📊 Current Configuration

### **Default Values (If Not Set):**
```
SENDER_EMAIL = info@cleandeep.co.za
SENDER_NAME = TotalLŸ
SENDER_ADDRESS = TotalLŸ <info@cleandeep.co.za>
```

### **Current Production Configuration:**

When deployed to Vercel with environment variables set:
- ✅ SENDER_EMAIL: info@cleandeep.co.za
- ✅ SENDER_NAME: TotalLŸ
- ✅ All emails from: TotalLŸ <info@cleandeep.co.za>

---

## 🔍 Verification

### **How to Verify Configuration is Working:**

1. **Check .env (Local)**
   ```bash
   grep SENDER_ .env
   ```
   Expected output:
   ```
   SENDER_EMAIL="info@cleandeep.co.za"
   SENDER_NAME="TotalLŸ"
   ```

2. **Check Code (Local)**
   ```bash
   grep SENDER_ADDRESS api/_lib/email.ts
   ```
   Expected output shows SENDER_ADDRESS variable used

3. **Test in Dashboard**
   - Send test email
   - Check it arrives from correct sender

4. **Check Vercel**
   - Vercel Dashboard → Settings → Environment Variables
   - Both variables should be present
   - Values correct

---

## 💡 Pro Tips

1. **Multiple Environments:**
   - Dev: `SENDER_EMAIL=dev-test@cleandeep.co.za`
   - Staging: `SENDER_EMAIL=staging@cleandeep.co.za`
   - Production: `SENDER_EMAIL=info@cleandeep.co.za`

2. **Easy Updates:**
   - Change sender without redeploying code
   - Just update environment variable
   - Perfect for A/B testing

3. **Fallbacks:**
   - If variable not set, uses default
   - Never breaks (always has fallback)
   - Safe to deploy

---

## 🚀 Status

**Configuration:** ✅ COMPLETE  
**Environment Variables:** ✅ IMPLEMENTED  
**Code Updates:** ✅ ALL 3 FUNCTIONS  
**Defaults:** ✅ SET & TESTED  
**Production Ready:** ✅ YES  

---

**Last Updated:** 2026-06-24  
**Status:** ✅ PRODUCTION READY
