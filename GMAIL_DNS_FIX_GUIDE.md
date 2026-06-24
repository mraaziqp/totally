# 🚨 Gmail DNS Fix - GoDaddy Configuration

**Issue:** MX records pointing to wrong server (216.150.1.1)  
**Solution:** Update DNS records to Google's servers  
**Domain:** cleandeep.co.za  
**Time Required:** 5 minutes setup + 24-48 hours propagation

---

## 📋 Problem Summary

```
Current Error: "cleandeep.co.za 216.150.1.1: timed out"

Root Cause:
  ❌ MX record points to web host (216.150.1.1)
  ❌ Should point to Google's mail servers
  ✅ Gmail account exists but can't receive mail
```

---

## 🔧 SOLUTION: Update DNS Records in GoDaddy

### STEP 1: Log into GoDaddy

1. Go to https://www.godaddy.com
2. Click "Sign In" (top right)
3. Enter your GoDaddy credentials
4. Navigate to "My Products"

### STEP 2: Access DNS Records

1. Find your domain: **cleandeep.co.za**
2. Click the three dots (...) next to the domain
3. Click "Manage DNS"
4. You'll see the current DNS records

### STEP 3: Remove Old MX Records

**Look for any MX records pointing to:**
- 216.150.1.1
- Your web host IP
- Any non-Google addresses

**For each one:**
1. Click the trash/delete icon
2. Confirm deletion
3. Wait for it to remove

---

## ✅ STEP 4: Add Correct MX Records

### Primary MX Record (Add NEW)

| Field | Value |
|-------|-------|
| Type | MX |
| Name | @ |
| Value | aspmx.l.google.com |
| Priority | 10 |
| TTL | 3600 |

**Steps to Add:**
1. Click "Add Record"
2. Select Type: **MX**
3. Name: **@** (or leave blank)
4. Value: **aspmx.l.google.com**
5. Priority: **10**
6. Click "Save"

### Secondary MX Records (Add these too for reliability)

**Record 2:**
```
Type: MX
Name: @
Value: alt1.aspmx.l.google.com
Priority: 20
```

**Record 3:**
```
Type: MX
Name: @
Value: alt2.aspmx.l.google.com
Priority: 30
```

**Record 4:**
```
Type: MX
Name: @
Value: alt3.aspmx.l.google.com
Priority: 40
```

**Record 5:**
```
Type: MX
Name: @
Value: alt4.aspmx.l.google.com
Priority: 50
```

---

## 📧 STEP 5: Add SPF Record (Prevent Spam)

| Field | Value |
|-------|-------|
| Type | TXT |
| Name | @ |
| Value | v=spf1 include:_spf.google.com ~all |
| TTL | 3600 |

**Steps:**
1. Click "Add Record"
2. Select Type: **TXT**
3. Name: **@**
4. Value: **v=spf1 include:_spf.google.com ~all**
5. Click "Save"

---

## 🔐 STEP 6: Add DKIM Record

DKIM verification must be done in Google Workspace Admin Console first.

### In Google Admin Console:
1. Go to https://admin.google.com
2. Navigate to: **Apps → Google Workspace → Gmail → Authentication**
3. Click on "DKIM authentication"
4. Select your domain: **cleandeep.co.za**
5. Click "Generate new DKIM record"
6. Copy the TXT record details

### In GoDaddy DNS:
1. Click "Add Record"
2. Select Type: **TXT**
3. Name: Copy from Google (usually something like: **google._domainkey**)
4. Value: Copy the long string from Google
5. Click "Save"

---

## 📝 STEP 7: Add DMARC Record (Optional but Recommended)

| Field | Value |
|-------|-------|
| Type | TXT |
| Name | _dmarc |
| Value | v=DMARC1; p=none; rua=mailto:info@cleandeep.co.za |
| TTL | 3600 |

**Steps:**
1. Click "Add Record"
2. Select Type: **TXT**
3. Name: **_dmarc**
4. Value: **v=DMARC1; p=none; rua=mailto:info@cleandeep.co.za**
5. Click "Save"

---

## ⏳ STEP 8: Wait for Propagation

**Timeline:**
```
Immediately:  DNS records saved in GoDaddy
15 minutes:   Some servers see new records
1-4 hours:    Most servers updated
24-48 hours:  All global DNS servers updated
```

**To check status:**
1. Go to https://mxtoolbox.com
2. Enter: **cleandeep.co.za**
3. Check MX records section
4. Should show Google's mail servers

---

## ✅ STEP 9: Verify Gmail Connection

### Test 1: In Gmail (wait 1-2 hours first)
1. Send test email to: **info@cleandeep.co.za**
2. Should arrive in Gmail inbox
3. Check for spam folder if not arriving

### Test 2: Check MX Records
```bash
# Run this in terminal to verify
nslookup -type=MX cleandeep.co.za
# Should return Google's servers, not 216.150.1.1
```

### Test 3: Check DNS Propagation
1. Go to https://dnschecker.org
2. Select "MX" record type
3. Enter: **cleandeep.co.za**
4. Wait for all locations to show Google servers

---

## 🎯 Your Final DNS Should Look Like:

```
TYPE    NAME            VALUE                           PRIORITY
MX      @               aspmx.l.google.com              10
MX      @               alt1.aspmx.l.google.com         20
MX      @               alt2.aspmx.l.google.com         30
MX      @               alt3.aspmx.l.google.com         40
MX      @               alt4.aspmx.l.google.com         50
TXT     @               v=spf1 include:_spf.google.com ~all
TXT     google._domainkey [DKIM from Google Admin]
TXT     _dmarc          v=DMARC1; p=none; rua=mailto:info@cleandeep.co.za
```

---

## 🚫 What NOT To Do

❌ Don't keep old MX records pointing to 216.150.1.1  
❌ Don't use your web host's mail server  
❌ Don't delete all MX records at once  
❌ Don't wait forever - DNS usually updates in 1-4 hours  

---

## 📞 Troubleshooting

### Issue: Still getting "timed out" after 1 hour
**Solution:**
1. Clear all old MX records (delete 216.150.1.1 reference)
2. Ensure Google MX records are added
3. Wait 1-2 hours
4. Check with https://mxtoolbox.com

### Issue: Emails arrive but marked as spam
**Solution:**
1. Ensure SPF record is correct
2. Complete DKIM verification in Google Admin
3. Add DMARC record
4. Wait 24 hours

### Issue: Can't add records in GoDaddy
**Solution:**
1. Make sure you're in "Manage DNS" view
2. Not just domain settings page
3. Look for "DNS Zone File" section
4. Click "Add Record" button

---

## ✨ After DNS is Fixed

Once MX records point to Google:

1. **Emails will arrive** in Gmail from the domain
2. **Set up forwarding** (if needed) in Gmail settings
3. **Configure Resend** to use correct sender address
4. **Test booking emails** will now work perfectly

---

## 📊 Expected Results

**Before (Now):**
```
❌ cleandeep.co.za email doesn't work
❌ MX points to web host (216.150.1.1)
❌ Gmail can't receive emails
```

**After DNS Fix:**
```
✅ cleandeep.co.za email receives mail
✅ MX points to Google servers
✅ Gmail receives all emails
✅ Resend can send emails properly
```

---

## 🎯 Quick Checklist

While in GoDaddy DNS:

- [ ] Delete MX record pointing to 216.150.1.1
- [ ] Add MX: aspmx.l.google.com (priority 10)
- [ ] Add MX: alt1.aspmx.l.google.com (priority 20)
- [ ] Add MX: alt2.aspmx.l.google.com (priority 30)
- [ ] Add MX: alt3.aspmx.l.google.com (priority 40)
- [ ] Add MX: alt4.aspmx.l.google.com (priority 50)
- [ ] Add SPF TXT record
- [ ] Add DKIM TXT record (from Google Admin)
- [ ] Add DMARC TXT record (optional)
- [ ] Save all changes
- [ ] Wait 1-2 hours
- [ ] Verify with mxtoolbox.com
- [ ] Test sending email to info@cleandeep.co.za

---

## ⏰ Timeline

| Time | Action | Status |
|------|--------|--------|
| Now | Update DNS in GoDaddy | ⏳ Do this immediately |
| +15 min | Check mxtoolbox.com | Some servers updated |
| +1 hour | Try sending test email | Should mostly work |
| +24 hours | Full propagation | Fully working |

---

## 📞 Support

If still having issues after 24 hours:

1. **Check GoDaddy DNS again** - ensure records saved
2. **Verify with mxtoolbox.com** - confirm Google servers showing
3. **Check Google Admin Console** - ensure domain verified
4. **Wait 48 hours** - DNS propagation can take time
5. **Test with different email** - try from external account

---

**Once DNS is fixed:**
✅ Gmail will work
✅ Resend emails will send properly
✅ Your business email is fully operational

**Current Status:** Ready to fix in GoDaddy ⏳

---

**Last Updated:** 2026-06-10  
**Issue:** MX records misconfigured  
**Solution:** Point to Google servers  
**ETA to Fix:** 5 minutes setup + 1-24 hours propagation
