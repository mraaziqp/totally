# ✅ Admin Dashboard Testing Checklist

**Complete Pre-Launch Testing Guide**

**Date:** 2026-06-24  
**Status:** Ready for Testing

---

## 📋 **Pre-Launch Testing (Do This Before Sending to Unit Managers)**

### **Test 1: Dashboard Access**

```
STEP 1: Navigate to deep-cleaning dashboard
URL: https://cleandeep.co.za/admin/deep-cleaning
Expected: Login screen appears

STEP 2: Try incorrect password
Enter: "wrongpassword"
Expected: Error message appears

STEP 3: Enter correct password
Enter: "totally2026"
Expected: Dashboard loads successfully

STEP 4: Check layout
Expected:
✓ Header with unit name visible
✓ Navigation tabs clearly visible
✓ Content area visible
✓ No layout breaking
✓ Mobile responsive

STEP 5: Check all 4 tabs exist
Tab 1: LEADS ✓
Tab 2: EMAIL ✓
Tab 3: SERVICES ✓
Tab 4: PAGES ✓

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 2: Leads Tab**

```
STEP 1: Click LEADS tab
Expected: Leads list appears

STEP 2: Check leads display
Look for:
✓ Customer names
✓ Customer emails
✓ Customer phone numbers
✓ Location information
✓ Status badges
✓ Date information

STEP 3: Verify leads from database
Expected: All 3 sample leads show
- Lead 1: Sample customer 1
- Lead 2: Sample customer 2
- Lead 3: Sample customer 3

STEP 4: Check card styling
Expected:
✓ Cards render properly
✓ Text is readable
✓ Layout is organized
✓ No overflow issues
✓ Mobile friendly

STEP 5: Check stats cards
Expected:
✓ Total Leads count showing
✓ New Requests count showing
✓ Numbers are correct

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 3: Email Tab**

```
STEP 1: Click EMAIL tab
Expected: Email manager loads

STEP 2: Check stat cards
Should show:
✓ Service: Resend
✓ Status: Active
✓ Domain: cleandeep.co.za

STEP 3: Test email input
Action: Click email input field
Expected:
✓ Field is clickable
✓ Cursor appears
✓ Placeholder text visible
✓ Field accepts input

STEP 4: Enter test email
Action: Type valid email address
Expected: Email appears in field

STEP 5: Click "Send Test Email" button
Action: Click button
Expected:
✓ Button changes to "Sending..."
✓ Spinner animation shows
✓ Button is disabled

STEP 6: Wait for response (up to 30 seconds)
Expected:
✓ Success message appears
✓ Message says email sent
✓ No error message
✓ Email field clears

STEP 7: Check actual inbox
Action: Check your email inbox
Expected:
✓ Test email arrives
✓ From: resend.com domain
✓ Contains test message
✓ Arrives within 30 seconds

STEP 8: Test with invalid email
Action: Enter "notanemail"
Expected:
✓ Field accepts input
✓ Click send
✓ Error message appears
✓ Graceful error handling

STEP 9: Check styling
Expected:
✓ Success message is green
✓ Error message is red
✓ Text is readable
✓ Icons display correctly

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 4: Services Tab**

```
STEP 1: Click SERVICES tab
Expected: Services view loads

STEP 2: Check services list
Should show:
✓ Service 1: Deep Cleaning
✓ Service 2: Carpet Cleaning
✓ Service 3: Window Cleaning
[Additional services...]

STEP 3: Verify service display
Each service should show:
✓ Service name (bold)
✓ Service description
✓ Price (if set)
✓ Professional styling

STEP 4: Check empty state (if no services)
Expected:
✓ Icon shows
✓ Message says "No services yet"
✓ Admin note visible
✓ Clean layout

STEP 5: Mobile view
Action: Shrink browser to mobile width
Expected:
✓ Services still readable
✓ Names not cut off
✓ Descriptions visible
✓ Professional appearance

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 5: Pages Tab - Contact Info**

```
STEP 1: Click PAGES tab
Expected: Page editor loads

STEP 2: Look for "Hero & Branding" section
Expected: Section 1 visible with card styling

STEP 3: Find phone number field
Label should say: "Contact Phone / WhatsApp"
Action: Click field
Expected:
✓ Field is editable
✓ Cursor appears
✓ Has placeholder text
✓ No errors

STEP 4: Enter test phone number
Action: Clear field, type "073 123 4567"
Expected:
✓ Phone number appears
✓ Field updates in real-time
✓ No validation errors

STEP 5: Find email field
Label should say: "Contact Email"
Action: Click field
Expected:
✓ Field is editable
✓ Placeholder shows
✓ Ready for input

STEP 6: Enter test email
Action: Type "test@example.com"
Expected:
✓ Email appears in field
✓ Updates correctly
✓ Field accepts email format

STEP 7: Scroll to save button
Expected:
✓ Green button visible
✓ Text says "Save & Publish Storefront"
✓ Button is not disabled

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 6: Pages Tab - Hero Section**

```
STEP 1: Check hero image field
Label: "Hero Banner Image (URL)"
Expected:
✓ Text input field visible
✓ Placeholder shows image URL format
✓ Optional preview on right

STEP 2: Test with valid image URL
Action: Paste valid image URL
Example: https://images.unsplash.com/photo-...
Expected:
✓ Image preview appears on right
✓ Shows thumbnail of image
✓ No broken image error
✓ Professional appearance

STEP 3: Check headline field
Label: "Hero Main Headline"
Action: Click and type "Test Headline"
Expected:
✓ Text appears in field
✓ Field updates correctly
✓ Professional styling

STEP 4: Check tagline field
Label: "Small Tagline (Optional)"
Action: Type "Test Tagline"
Expected:
✓ Text appears
✓ Field optional (works empty too)
✓ Styled correctly

STEP 5: Check mission statement
Label: "Mission Statement / Intro"
Action: Click, should be large textarea
Expected:
✓ Large text area (for paragraphs)
✓ Accepts multi-line text
✓ No character limit message

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 7: Pages Tab - Services Section**

```
STEP 1: Find "Services Grid" section (Step 2)
Expected: Section with card styling

STEP 2: Check section heading field
Label: "Section Heading"
Current value: "Our Specialised Services"
Action: Try to edit
Expected:
✓ Field is editable
✓ Can change text
✓ Updates field value

STEP 3: Check description field
Label: "Section Description (Optional)"
Expected:
✓ Textarea visible
✓ Multi-line capable
✓ Editable with changes

STEP 4: Verify styling
Expected:
✓ Fields properly labeled
✓ Clear visual hierarchy
✓ Professional appearance

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 8: Pages Tab - About Section**

```
STEP 1: Find "About & Values Section" (Step 3)
Expected: Card with Step 3 indicator

STEP 2: Check heading field
Label: "Section Title"
Default: "Our Journey & Core Values"
Action: Edit to "Test Title"
Expected:
✓ Changes apply
✓ Field updates
✓ No errors

STEP 3: Check full story textarea
Label: "The Full Story"
Expected:
✓ Large textarea
✓ Can accept long text
✓ Multiple paragraphs
✓ Line breaks work

STEP 4: Enter test story
Action: Type multi-line story
Expected:
✓ Text appears correctly
✓ Formatting preserved
✓ No text loss

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 9: Pages Tab - Testimonials**

```
STEP 1: Find "Client Testimonial" section (Step 4)
Expected: Section with card styling

STEP 2: Check testimonial quote field
Label: "Feedback Quote"
Expected:
✓ Large textarea
✓ Accepts quoted text
✓ Placeholder visible

STEP 3: Check author name field
Label: "Client Name"
Action: Type test name
Expected:
✓ Text updates
✓ Field accepts input

STEP 4: Check author role field
Label: "Client Role / Label"
Action: Type "Business Owner"
Expected:
✓ Text appears
✓ Field editable
✓ No errors

STEP 5: All fields work together
Action: Fill all 3 testimonial fields
Expected:
✓ All values saved
✓ No interference
✓ Clean layout

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 10: Pages Tab - Gallery**

```
STEP 1: Find "Gallery Images & Media" section (Step 5)
Expected: Section with Step 5 indicator

STEP 2: Check info box
Expected:
✓ Shows upload methods
✓ Explains how to add images
✓ Clear instructions

STEP 3: Check image rows
Expected:
✓ If images exist, they show
✓ Thumbnail preview visible
✓ URL field present
✓ Caption field present
✓ Delete button (X) present

STEP 4: Add test image
Action: Click "Add Image" button
Expected:
✓ New image row appears
✓ Empty fields ready
✓ Can type URL

STEP 5: Enter image URL
Action: Paste valid image URL
Expected:
✓ Thumbnail loads (or fails gracefully)
✓ URL field shows pasted text
✓ No console errors

STEP 6: Add caption
Action: Type "Test Image"
Expected:
✓ Caption appears
✓ Field accepts text
✓ No errors

STEP 7: Delete test image
Action: Click X button on image row
Expected:
✓ Row disappears
✓ Smooth animation
✓ No errors
✓ Other images unaffected

STEP 8: Verify button
Action: Look for "Add Image" button
Expected:
✓ Button visible
✓ Clickable
✓ Adds new row when clicked

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 11: Save & Publish Button**

```
STEP 1: Make a test change
Action: Change any field (e.g., phone number)
Expected: Change appears in field

STEP 2: Scroll to bottom
Expected:
✓ Green button visible
✓ Text says "Save & Publish Storefront"
✓ Has save icon
✓ Button is not disabled

STEP 3: Click save button
Action: Click green button
Expected:
✓ Button shows loading state
✓ Spinner animation
✓ Button disabled while saving
✓ Text changes to "Publishing Updates..."

STEP 4: Wait for save to complete
Expected (5-10 seconds):
✓ Button returns to normal
✓ Success indication (optional toast)
✓ No error messages
✓ Changes are saved

STEP 5: Verify changes saved
Action: Refresh page
Expected:
✓ Your changes still there
✓ Data persisted to database
✓ Not lost on refresh

STEP 6: Check live site
Action: Go to https://cleandeep.co.za/services/deep-cleaning
Expected:
✓ Your test changes visible
✓ Phone number updated
✓ Changes live in 2-3 seconds
✓ Professional appearance

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 12: Logout & Security**

```
STEP 1: Look for logout button
Expected: Logout option in header

STEP 2: Click logout
Action: Click logout button
Expected:
✓ Session ends
✓ Redirected to login screen
✓ Dashboard no longer accessible

STEP 3: Try to access without password
Action: Try to go to /admin/deep-cleaning
Expected:
✓ Login screen shows
✓ Can't access dashboard
✓ Password required

STEP 4: Login again
Action: Enter correct password
Expected:
✓ Dashboard loads
✓ Previous data still there
✓ No data loss

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 13: Mobile Responsiveness**

```
STEP 1: Open dashboard on phone
Use: Smartphone (iOS or Android)
Expected:
✓ Loads without errors
✓ Touch friendly
✓ Readable text size
✓ No horizontal scrolling

STEP 2: Test LEADS tab
Action: View leads on mobile
Expected:
✓ Leads visible
✓ Info readable
✓ Touch friendly
✓ Professional appearance

STEP 3: Test EMAIL tab
Action: Send test email from mobile
Expected:
✓ Input field accessible
✓ Button clickable
✓ Works end-to-end
✓ Response received

STEP 4: Test PAGES tab
Action: Edit a field on mobile
Expected:
✓ Fields are large enough
✓ Keyboard doesn't hide content
✓ Can scroll easily
✓ Changes work

STEP 5: Test save on mobile
Action: Save changes from phone
Expected:
✓ Button accessible
✓ Works correctly
✓ Changes saved
✓ No mobile-specific bugs

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

### **Test 14: Browser Compatibility**

Test in each browser:

#### **Chrome**
```
URL: https://cleandeep.co.za/admin/deep-cleaning
Steps:
□ Login works
□ All tabs load
□ Email test sends
□ Typing works
□ Save works
□ Changes appear on site

Status: PASS / FAIL
Notes: _________________
```

#### **Firefox**
```
Steps: Same as Chrome
Status: PASS / FAIL
Notes: _________________
```

#### **Safari**
```
Steps: Same as Chrome
Status: PASS / FAIL
Notes: _________________
```

#### **Edge**
```
Steps: Same as Chrome
Status: PASS / FAIL
Notes: _________________
```

---

### **Test 15: Performance Testing**

```
STEP 1: Check load time
Action: Open dashboard, measure time
Expected: Loads in under 3 seconds

STEP 2: Check form responsiveness
Action: Type in text field
Expected: No lag, instant response

STEP 3: Check save speed
Action: Click save button
Expected: Saves in 2-5 seconds

STEP 4: Check live site update
Action: Make change, check website
Expected: Updates appear in 2-3 seconds

STEP 5: Check image loading
Action: Add image with URL
Expected: Loads quickly, no timeout

PERFORMANCE SCORES:
- Dashboard load: _____ seconds
- Form responsiveness: _____ (good/ok/slow)
- Save speed: _____ seconds
- Live update: _____ seconds
- Overall: _____ (excellent/good/ok/slow)

STATUS: _________ (PASS/FAIL)
NOTES: _________________________________________
```

---

## 🔍 **Issues Found & Resolution**

```
Issue #1: ________________________
Impact: High / Medium / Low
Steps to reproduce: ________________________
Current behavior: ________________________
Expected behavior: ________________________
Resolution: ________________________
Status: Fixed / Pending / Escalated
```

```
Issue #2: ________________________
Impact: High / Medium / Low
Steps to reproduce: ________________________
Current behavior: ________________________
Expected behavior: ________________________
Resolution: ________________________
Status: Fixed / Pending / Escalated
```

---

## ✅ **Final Sign-Off Checklist**

### **Functionality**
- [ ] All 4 tabs load and work
- [ ] Dashboard login works
- [ ] Email testing works
- [ ] All form fields editable
- [ ] Save/Publish works
- [ ] Changes appear on live site
- [ ] Logout works
- [ ] Password protection works

### **Data**
- [ ] All sample data visible
- [ ] Phone number updateable
- [ ] Email updateable
- [ ] Text content editable
- [ ] Images manageable
- [ ] Changes persist on refresh
- [ ] Database connection stable

### **User Experience**
- [ ] Clean interface
- [ ] Clear instructions
- [ ] Professional styling
- [ ] Logical flow
- [ ] No confusing elements
- [ ] Error messages helpful
- [ ] Success feedback clear

### **Mobile**
- [ ] Mobile responsive
- [ ] Touch friendly
- [ ] Readable on small screens
- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] All features accessible

### **Performance**
- [ ] Fast load times
- [ ] Responsive forms
- [ ] Quick saves
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] Efficient images

### **Browser Compatibility**
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] No browser-specific bugs

### **Security**
- [ ] Password required
- [ ] Incorrect password rejected
- [ ] Can't bypass login
- [ ] Logout works
- [ ] Session timeout works

### **Documentation**
- [ ] All guides written
- [ ] Quick starts prepared
- [ ] FAQs compiled
- [ ] Screenshots included
- [ ] Clear instructions
- [ ] Support info provided

---

## 📊 **Test Results Summary**

**Date Tested:** _______________  
**Tester Name:** _______________  
**Dashboard Version:** 2.0  

**Overall Status:** ☐ PASS ☐ FAIL ☐ PENDING

**Critical Issues:** _____ (must fix before launch)  
**Major Issues:** _____ (should fix)  
**Minor Issues:** _____ (nice to fix)  

**Recommendation:**
☐ Ready to launch immediately
☐ Ready to launch with known issues
☐ Not ready, needs fixes

**Sign-Off:**
Tester Signature: _______________  
Admin Signature: _______________  
Date: _______________

---

## 🚀 **When All Tests Pass**

Once all tests pass:

1. ✅ Email launch package to unit managers
2. ✅ Provide all documentation
3. ✅ Offer optional training call
4. ✅ Monitor first week logins
5. ✅ Support any initial questions

---

**Testing Complete: _______________**

