# Admin Dashboard Access Guide

## Quick Start: How to Access Your Dashboard

### 1. **Navigate to Your Admin Dashboard**
   - Go to: `https://cleandeep.co.za/admin/[your-unit-slug]`
   - Replace `[your-unit-slug]` with your unit identifier:
     - `deep-cleaning` - Deep Cleaning unit
     - `pressure-cleaning` - Pressure Cleaning unit
     - `gifting` - Gifting unit

   **Examples:**
   - https://cleandeep.co.za/admin/deep-cleaning
   - https://cleandeep.co.za/admin/pressure-cleaning
   - https://cleandeep.co.za/admin/gifting

### 2. **Authentication**
   - You'll be prompted for an admin password
   - Contact your administrator to get your password
   - Enter the password and click "Unlock Dashboard"

---

## Dashboard Features

### **Tab 1: Lead Manager**
Manage incoming customer inquiries and booking requests.

- **Quick Stats**: View total leads and new requests at a glance
- **Leads Table**: See all customer inquiries with:
  - Customer name, email, and phone
  - Location of the requested service
  - Date requested
  - Lead status (NEW, etc.)

**Tips:**
- Check this regularly to respond to customer inquiries
- Export leads if needed for your CRM or follow-up system

---

### **Tab 2: Storefront Editor**

#### **Section 0: Page Settings**
Configure SEO and general page information.

- **Page Title**: What appears in browser tabs and search results
  - Example: "Premium Deep Cleaning Services | Clean Deep"
- **Page Description**: Meta description for SEO
  - Should be 150-160 characters
  - Appears in search results below the title

#### **Section 1: Hero & Branding**
The main banner at the top of your storefront.

**Fields to customize:**
- **Contact Phone/WhatsApp**: Your main contact number
- **Contact Email**: Your email address
- **Hero Banner Image**: Large background image for the hero section
  - Use a direct HTTPS link (Unsplash, Imgur, etc.)
  - Recommended size: 1920x1080px or larger
- **Small Tagline**: A short phrase (optional)
  - Example: "Premium Cleaning Service"
- **Hero Main Headline**: Your main message
  - Keep under 60 characters
  - Make it punchy and memorable
  - Example: "Professional Cleaning That Transforms Spaces"
- **Mission Statement/Intro**: Tell customers what you're about
  - 2-3 sentences explaining your service quality and approach

**For Gifting Unit:**
- **Delivery/Availability Note**: Delivery radius and timeframes
  - Example: "Free delivery within Panorama & Plattekloof"

#### **Section 2: Services Grid**
Showcase your service offerings.

- **Section Heading**: Title for this section
  - Default: "Our Specialised Services"
  - Customize to match your brand voice
- **Section Description**: Brief intro to your services (optional)
  - Highlight what makes your services special
  - Example: "We offer comprehensive cleaning solutions tailored to your needs"

#### **Section 3: About & Values**
Tell your story and build customer trust.

- **Section Title**: Heading for your about section
  - Default: "Our Journey & Core Values"
- **The Full Story**: Your complete story
  - Share your experience and expertise
  - Explain your commitment to quality
  - Build emotional connection with customers
  - Write naturally, like speaking to a friend

**Writing Tips:**
- Be authentic and genuine
- Mention years of experience if applicable
- Highlight what makes you different from competitors
- Reference customer results and satisfaction

#### **Section 4: Client Testimonial**
Add social proof with a customer review.

- **Feedback Quote**: The actual testimonial text
  - Include specific results or benefits mentioned
  - Make it feel natural, not sales-y
- **Client Name**: Who gave the testimonial
- **Client Role/Label**: Their position or relationship
  - Example: "Community Leader", "Local Business Owner", "Homeowner"

**Tips:**
- Use real testimonials from actual customers
- Include specific details about the service
- Rotate testimonials periodically for freshness

#### **Section 5: Gallery Images & Media**
Showcase your work with before/after photos or portfolio images.

**How to Add Images:**

**Method 1: Direct URL (Easiest)**
1. Upload your image to a free service like:
   - Unsplash.com (create free account)
   - Imgur.com (no account needed)
   - Your own hosting
2. Copy the direct image link
3. Paste into the "Image URL" field
4. Preview will appear immediately

**Method 2: Upload to Project Folder**
1. Prepare your images in JPG or PNG format
2. Upload to: `public/images/[your-slug]/`
   - For deep-cleaning: `public/images/deep-cleaning/photo1.jpg`
   - For pressure-cleaning: `public/images/pressure-cleaning/photo1.jpg`
   - For gifting: `public/images/gifting/photo1.jpg`
3. Reference as: `/images/[your-slug]/filename.jpg`

**Image Tips:**
- First image displays larger (featured image)
- Use high-quality, well-lit photos
- Show before/after comparisons
- Include images of your team at work
- Add captions for context (optional)
- Recommended size: 800x600px or larger
- File size: Keep under 2MB for fast loading

**Gallery Organization:**
- Add 3-5 images minimum for best results
- Order images strategically (best first)
- Use captions to add context
- Update seasonally or quarterly

---

## Publishing Your Changes

### **Save & Publish**
Once you've made changes:
1. Review all your edits
2. Click the large **"Save & Publish Storefront"** button at the bottom
3. Wait for the confirmation message
4. Your changes appear live immediately

### **Preview Before Publishing**
- Look at the **"Live Preview Guide"** in the right panel
- Click **"View Live StoreFront"** to see how changes appear
- Test on mobile and desktop
- Verify all images load correctly

---

## Best Practices

### **Editing Your Content**

✅ **DO:**
- Keep headlines short and punchy (under 60 characters)
- Use clear, simple language
- Focus on customer benefits, not features
- Update content every 2-3 months
- Keep testimonials current and relevant
- Use professional photos
- Test links and images before publishing

❌ **DON'T:**
- Use ALL CAPS or excessive punctuation!!!
- Copy competitors' content
- Leave placeholder text
- Use blurry or unprofessional images
- Overpromise in headlines
- Forget to update your contact information
- Leave old testimonials indefinitely

### **Image Guidelines**

**Good Images:**
- Well-lit and in focus
- Professional quality (smartphone is fine)
- Show actual work/results
- Include people when possible (trust building)
- Consistent style or branding

**Avoid:**
- Blurry or dark photos
- Generic stock images (unless intentional)
- Low resolution or pixelated images
- Too many cluttered images

### **Text Guidelines**

**Headlines:**
- Action-oriented: "Transform Your Space in Hours"
- Benefit-focused: "Spotless Homes Without the Stress"
- Honest and specific
- Under 60 characters

**Body Copy:**
- Write like you speak
- Short paragraphs (2-3 sentences max)
- Use customer-focused language
- Focus on "you" (customer) not "we" (you)

**Testimonials:**
- Should sound natural, not overly polished
- Include specific results
- 2-4 sentences ideal
- Use first person

---

## Troubleshooting

### **Image Won't Load**
- Check the URL is complete and uses HTTPS (not HTTP)
- Try a different image host
- Ensure image size isn't too large (compress if needed)
- Clear browser cache (Ctrl+Shift+Delete)

### **Changes Not Appearing**
- Make sure you clicked "Save & Publish"
- Wait 30 seconds and refresh the page
- Try a different browser
- Clear browser cache

### **Can't Log In**
- Double-check your password (case-sensitive)
- Ensure Caps Lock is off
- Try again after a few seconds
- Contact your administrator if stuck

### **Text Not Displaying Correctly**
- Avoid special characters that might not render
- Don't paste from Word (causes formatting issues)
- Try using plain text editors like Notepad

---

## Content Update Schedule

**Recommended Timeline:**
- **Weekly:** Check and respond to leads
- **Monthly:** Review and update testimonials
- **Quarterly:** Refresh images with new work samples
- **Quarterly:** Review and update service descriptions
- **Seasonally:** Adjust messaging for seasonal services

---

## Contact & Support

If you need help or have questions:
- Contact your administrator for password resets
- For technical issues, contact the development team
- Keep your contact information in the dashboard current

---

## Quick Reference Checklist

Before publishing, verify:
- ✅ All contact info is correct and current
- ✅ Hero image loads and looks good
- ✅ Main headline is compelling
- ✅ Mission statement is authentic
- ✅ Services section title matches your brand
- ✅ About section tells your story
- ✅ Testimonial sounds real and specific
- ✅ Gallery images are high quality (3+ images)
- ✅ All images load without errors
- ✅ No typos or spelling mistakes
- ✅ Text flows naturally and logically
- ✅ Mobile view looks good (test on phone)

Good luck managing your storefront! 🚀
