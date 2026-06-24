# 🎯 Complete Admin Dashboard Guide
**For Unit Managers - Deep Cleaning, Pressure Cleaning & Gifting**

**Date:** 2026-06-24  
**Status:** ✅ **Your Dashboard is Ready to Use**

---

## 📍 **Step 1: Access Your Admin Dashboard**

Each unit has their own private dashboard. Choose your unit below:

### **Deep Cleaning Unit**
```
🔗 Link: https://cleandeep.co.za/admin/deep-cleaning
📧 Email: deepcleaning@totally.co.za
💼 Team: Deep Cleaning Services
```

### **Pressure Cleaning Unit**
```
🔗 Link: https://cleandeep.co.za/admin/pressure-cleaning
📧 Email: pressurewashing@totally.co.za
💼 Team: Pressure Washing Services
```

### **Gifting Unit**
```
🔗 Link: https://cleandeep.co.za/admin/gifting
📧 Email: gifting@totally.co.za
💼 Team: Premium Gifting Services
```

---

## 🔑 **Step 2: Login to Your Dashboard**

1. Click your dashboard link above
2. You'll see a password login screen
3. Enter your admin password: **`totally2026`**
4. Click **"Unlock Dashboard"**

**That's it! You're now inside your command center.**

---

## 📊 **Step 3: Dashboard Tabs Explained**

Once logged in, you'll see 4 powerful tabs at the top:

### **TAB 1: 📋 LEADS**
**What it does:** View all customer booking requests

**How to use:**
- See all incoming customer leads
- Check customer name, email, phone, location
- View requested service dates
- Track lead status (NEW, CONTACTED, etc.)
- This is your sales pipeline

**What appears here:**
- Customer name & contact info
- Where they need service
- When they requested it
- Status of each request

---

### **TAB 2: 📧 EMAIL**
**What it does:** Test and verify your email service

**How to use:**
1. Click the **Email** tab
2. Enter your test email address
3. Click **"Send Test Email"**
4. Check your inbox within 30 seconds
5. If you get the email, your system is working! ✅

**Why test?**
- Confirms customers will receive booking confirmations
- Verifies all automated emails work correctly
- Essential before going live

**What you should see:**
- Service status: **Resend** (Active)
- Domain: **cleandeep.co.za** (Verified)
- Test email feature ready to use

---

### **TAB 3: 📦 SERVICES**
**What it does:** View your services/products

**What you'll see:**
- List of all your services
- Service names and descriptions
- Pricing (if set)
- Current service count

**Note:** Services are managed by your admin. If you need to add new services or change pricing, contact your system administrator.

---

### **TAB 4: 📄 PAGES** (Most Important!)
**What it does:** Edit EVERYTHING customers see on your storefront

This is your complete content management system. You can edit:

#### **0️⃣ Page Settings**
- Page title (appears in browser tab)
- Meta description (helps with Google search)

#### **1️⃣ Hero Section**
- **Contact Phone** (WhatsApp number customers call you on)
- **Contact Email** (Where inquiries go)
- **Hero Banner Image** (Big banner at top of page)
- **Tagline** (Small subtitle)
- **Hero Headline** (Big main heading)
- **Mission Statement** (Your intro/welcome message)
- **Delivery Note** (For gifting: delivery info)

#### **2️⃣ Services Section**
- **Section Heading** (e.g., "Our Specialised Services")
- **Description** (Intro text about your services)

#### **3️⃣ About & Values Section**
- **Section Title** (e.g., "Our Story")
- **Full Story Text** (Tell your company's story)

#### **4️⃣ Client Testimonials**
- **Feedback Quote** (What a happy customer said)
- **Client Name** (Who said it)
- **Client Role** (What they do)

#### **5️⃣ Gallery Images & Media**
- **Upload Images** (Your portfolio, before/after photos)
- **Add Captions** (Text overlay on images)
- **Manage Gallery** (Reorder, delete, organize)

---

## 🚀 **How to Edit Your Pages**

### **Editing a Text Field:**
1. Click on any text input box
2. Clear the existing text
3. Type your new content
4. The field updates instantly

### **Editing Images:**
1. Find image URL field
2. Paste a direct image link (from Unsplash, Imgur, etc.)
3. OR upload to your server and reference it
4. Click **"Add Image"** to add more

### **Saving Your Changes:**
1. Make all your edits
2. Scroll to the bottom
3. Click **"Save & Publish Storefront"** (green button)
4. Wait for confirmation
5. Changes appear LIVE immediately! ✨

---

## 📸 **Adding Images to Your Gallery**

### **Method 1: Direct Image URLs (Easiest)**
```
1. Go to https://unsplash.com (free images)
2. Find a photo you like
3. Copy the image link
4. Paste it in the "Image URL" field
5. Click "Save & Publish"
```

### **Method 2: Upload to Your Server**
```
1. Upload image to: public/images/{yourunit}/photo.jpg
2. Reference as: /images/{yourunit}/photo.jpg
3. Click "Save & Publish"
```

### **Image Tips:**
- First image shows larger on service pages
- Add captions for context
- 5-10 images ideal for gallery
- Use high-quality images (clean, professional)

**Example Image URLs:**
```
https://images.unsplash.com/photo-1...
/images/deep-cleaning/before-after-1.jpg
/images/gifting/product-showcase.jpg
```

---

## ✅ **Step-by-Step: Edit Your Page**

### **Example: Update Your Contact Number**

1. **Go to your dashboard**
   ```
   https://cleandeep.co.za/admin/your-unit
   ```

2. **Login** with password `totally2026`

3. **Click the "PAGES" tab**

4. **Find "Hero & Branding" section (Step 1)**

5. **Look for "Contact Phone / WhatsApp" field**

6. **Click the input box and enter your number:**
   ```
   072 359 1276
   ```

7. **Scroll down to green button**

8. **Click "Save & Publish Storefront"**

9. **Wait for success message** ✅

10. **Check your live site** - number now updated!

---

## 🎨 **Page Structure Overview**

```
┌─────────────────────────────────────┐
│  Browser Tab Title (Page Settings)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Hero Banner & Headlines        │ ← Edit in Step 1
│     (Contact, Image, Tagline)       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Your Mission Statement      │ ← Edit in Step 1
│     (Welcome message to customers)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Services Section             │ ← Edit in Step 2
│    (Your services + descriptions)   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         About Us / Story            │ ← Edit in Step 3
│    (Your company history & values)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Client Testimonial             │ ← Edit in Step 4
│    (Happy customer feedback)         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Gallery / Portfolio         │ ← Edit in Step 5
│    (Your work photos & images)      │
└─────────────────────────────────────┘
```

---

## 💾 **Before You Save - Important Tips**

### **Headlines:**
- Keep them under 60 characters
- Make them punchy and clear
- Examples:
  - ✅ "Premium Cleaning for Your Home"
  - ✅ "Professional Pressure Washing"
  - ✅ "Unique Gifts, Perfect Moments"

### **Contact Information:**
- Use real, current numbers
- Check spelling of email
- Test your number works
- Update WhatsApp link if needed

### **Description Text:**
- 2-3 sentences per section
- Be clear about what you offer
- Use simple language
- Focus on customer benefits

### **Images:**
- Use high-quality photos
- Show your best work
- Include before/after (cleaning services)
- Make sure images load (test URLs)

---

## 🧪 **Testing Your Changes**

### **After Saving:**

1. **Wait 2-3 seconds** for changes to publish

2. **Open your live site:**
   ```
   https://cleandeep.co.za/services/your-unit
   ```

3. **Refresh the page** (Ctrl+R or Cmd+R)

4. **Check if changes appear:**
   - ✅ New text visible?
   - ✅ Images loading?
   - ✅ Phone number correct?
   - ✅ Layout looks good?

5. **If something's wrong:**
   - Go back to dashboard
   - Check your edits
   - Try saving again
   - Contact support if needed

---

## 📧 **Email Manager - Daily Workflow**

### **Every Morning:**
1. Login to dashboard
2. Check **LEADS** tab
3. See new customer requests
4. Respond to leads

### **Weekly:**
1. Test email service (EMAIL tab)
2. Send test email to yourself
3. Verify it arrives
4. Check everything working

### **Monthly:**
1. Update page content (PAGES tab)
2. Add new portfolio images
3. Update testimonials
4. Refresh descriptions

---

## 🔒 **Security & Best Practices**

### **DO:**
✅ Use a strong password  
✅ Log out when finished  
✅ Keep your phone number updated  
✅ Test changes before publishing  
✅ Backup important text elsewhere  

### **DON'T:**
❌ Share your password  
❌ Leave dashboard open  
❌ Use very short headlines  
❌ Save without testing  
❌ Use broken image links  

---

## 🆘 **Troubleshooting**

### **Problem: Changes not appearing**
**Solution:**
1. Click "Save & Publish" again
2. Hard refresh your browser (Ctrl+Shift+R)
3. Wait 5 seconds and refresh again
4. Check if changes appear

### **Problem: Image not showing**
**Solution:**
1. Check image URL is correct
2. Try a different image URL
3. Test in new browser tab
4. Contact support if URL broken

### **Problem: Email test fails**
**Solution:**
1. Check email address is correct
2. Wait 30 seconds before checking inbox
3. Check spam folder
4. Try different email address
5. Contact support if still failing

### **Problem: Can't login**
**Solution:**
1. Check caps lock is OFF
2. Verify password is: `totally2026`
3. Clear browser cache
4. Try different browser
5. Contact support

---

## 📞 **Need Help?**

### **Contact Your System Admin:**
```
Email: admin@cleandeep.co.za
Available: Mon-Fri 9AM-5PM
Response Time: Usually within 1 hour
```

### **Common Questions:**

**Q: Can I change my password?**  
A: Contact your admin for password changes

**Q: How many images can I upload?**  
A: Unlimited! Add as many as you want

**Q: Do changes go live immediately?**  
A: Yes! Within 2-3 seconds of clicking "Save"

**Q: Can multiple people access my dashboard?**  
A: Yes, everyone uses the same password

**Q: What if I make a mistake?**  
A: Just edit it again and re-save. No limits!

**Q: Can I delete my leads?**  
A: Contact your admin - keep them for records

---

## 🎯 **Your First Tasks (Right Now!)**

### **Task 1: Login & Explore** (5 min)
```
1. Go to your dashboard link
2. Enter password: totally2026
3. Click through each tab
4. Get familiar with layout
```

### **Task 2: Update Contact Info** (2 min)
```
1. Click PAGES tab
2. Find "Contact Phone" & "Contact Email"
3. Enter your real numbers
4. Click "Save & Publish"
```

### **Task 3: Add Your Story** (10 min)
```
1. Go to Step 3: About & Values
2. Write a short paragraph about your business
3. Keep it to 50-100 words
4. Click "Save & Publish"
```

### **Task 4: Add Portfolio Images** (10 min)
```
1. Find gallery images section (Step 5)
2. Add 3-5 images of your work
3. Use image URLs or upload
4. Click "Save & Publish"
```

### **Task 5: Test Email** (5 min)
```
1. Click EMAIL tab
2. Enter your email address
3. Click "Send Test Email"
4. Check your inbox
5. Confirm you got the email
```

---

## ✨ **Pro Tips**

1. **Save frequently** - Don't lose your work
2. **Test changes** - Always check live site
3. **Keep it simple** - Customers like clarity
4. **Add images** - Visual content converts better
5. **Update often** - Fresh content = more customers
6. **Be honest** - Authentic testimonials build trust
7. **Mobile first** - Most customers use phones
8. **Keep contact info current** - Easy to reach you

---

## 🎉 **You're All Set!**

Your dashboard is fully configured and ready to use. You now have complete control over:

✅ Contact information  
✅ Page headlines & text  
✅ Hero images & banners  
✅ Service descriptions  
✅ Your company story  
✅ Customer testimonials  
✅ Portfolio gallery  
✅ Email testing  
✅ Lead management  

**Start with Task 1 above and you'll be live in 30 minutes!**

---

## 📊 **Quick Reference**

| Feature | Where | Status |
|---------|-------|--------|
| View Leads | LEADS tab | ✅ Ready |
| Test Email | EMAIL tab | ✅ Ready |
| Edit Pages | PAGES tab | ✅ Ready |
| View Services | SERVICES tab | ✅ Ready |
| Contact Number | Step 1 | ✅ Editable |
| Hero Image | Step 1 | ✅ Editable |
| About Text | Step 3 | ✅ Editable |
| Gallery Images | Step 5 | ✅ Editable |

---

## 🚀 **Next Steps**

1. **Right now:** Go to your dashboard and login
2. **Today:** Update your contact info & story
3. **This week:** Add portfolio images
4. **Going live:** Tell customers about your dashboard
5. **Ongoing:** Update content weekly

---

**Dashboard Ready:** ✅ YES  
**All Features:** ✅ ENABLED  
**Your Unit:** ✅ CONFIGURED  
**Go Live Status:** ✅ READY  

**Start here:** [Click Your Dashboard Link Above]

---

**Questions?** Contact admin@cleandeep.co.za  
**Dashboard Version:** 2.0 - Enhanced  
**Last Updated:** 2026-06-24

