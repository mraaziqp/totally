# 🎬 Supabase Media Storage Setup

**Status:** ✅ **READY TO CONFIGURE**  
**Purpose:** Image uploads and media storage for galleries  
**Service:** Supabase Storage

---

## 📋 Your Supabase Keys

### **Key 1: Publishable Key (Client-side)**
```
NEXT_PUBLIC_SUPABASE_KEY=9D3sGEfRUUqy0houwEbV0w_B-v11Bpb
```
- **Type:** Publishable (safe for frontend)
- **Use:** Client-side uploads
- **Where:** .env and Vercel (public)

### **Key 2: Secret Key (Server-side)**
```
SUPABASE_SECRET=bWys4MoJIS66vPNGhogkUg_gTV8-xge
```
- **Type:** Secret (server-only)
- **Use:** Server-side operations
- **Where:** .env only (NOT in Vercel)

### **Key 3: Anon JWT Token (Client)**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDg5MDQsImV4cCI6MjA5Nzg4NDkwNH0.wQKo4vQ35-PXmzYTG5KYSAExSTGskQGqGO-THdBCDe8
```
- **Type:** JWT Token (client)
- **Use:** Client-side authentication
- **Where:** .env and Vercel (public)

### **Key 4: Service Role JWT Token (Server)**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMwODkwNCwiZXhwIjoyMDk3ODg0OTA0fQ.CulRYLmXf0DEq0ebkPOV5eWanWeOT8Bje6B7q8LgN08
```
- **Type:** JWT Token (service role)
- **Use:** Server-side full access
- **Where:** .env only (NOT in Vercel)

---

## 🎯 Environment Variables Setup

### **For .env (Local Development)**
Add all 4 keys:
```env
# Supabase - PUBLIC (safe for frontend)
NEXT_PUBLIC_SUPABASE_KEY=9D3sGEfRUUqy0houwEbV0w_B-v11Bpb
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDg5MDQsImV4cCI6MjA5Nzg4NDkwNH0.wQKo4vQ35-PXmzYTG5KYSAExSTGskQGqGO-THdBCDe8

# Supabase - SECRET (server-only, never in frontend)
SUPABASE_SECRET=bWys4MoJIS66vPNGhogkUg_gTV8-xge
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMwODkwNCwiZXhwIjoyMDk3ODg0OTA0fQ.CulRYLmXf0DEq0ebkPOV5eWanWeOT8Bje6B7q8LgN08

# Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://hhsoppbizeobea yngprn.supabase.co
```

### **For Vercel (Production)**
Add ONLY these 2 (the public ones):
```
NEXT_PUBLIC_SUPABASE_KEY=9D3sGEfRUUqy0houwEbV0w_B-v11Bpb
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDg5MDQsImV4cCI6MjA5Nzg4NDkwNH0.wQKo4vQ35-PXmzYTG5KYSAExSTGskQGqGO-THdBCDe8
NEXT_PUBLIC_SUPABASE_URL=https://hhsoppbizeobea yngprn.supabase.co
```

---

## 🔐 Key Distribution Summary

| Variable Name | Value | Location | Public? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_KEY` | 9D3sGEfRUUqy0... | .env + Vercel | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGc... (JWT) | .env + Vercel | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | https://hhsopp... | .env + Vercel | ✅ Yes |
| `SUPABASE_SECRET` | bWys4Mo... | .env only | ❌ No |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGc... (JWT) | .env only | ❌ No |

---

## 📝 Step-by-Step Setup

### **Step 1: Update .env Locally**
Add these to `k:\Projects\totally\.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hhsoppbizeobea yngprn.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=9D3sGEfRUUqy0houwEbV0w_B-v11Bpb
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDg5MDQsImV4cCI6MjA5Nzg4NDkwNH0.wQKo4vQ35-PXmzYTG5KYSAExSTGskQGqGO-THdBCDe8
SUPABASE_SECRET=bWys4MoJIS66vPNGhogkUg_gTV8-xge
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoc29wcGJpemVvYmVheW5ncHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMwODkwNCwiZXhwIjoyMDk3ODg0OTA0fQ.CulRYLmXf0DEq0ebkPOV5eWanWeOT8Bje6B7q8LgN08
```

### **Step 2: Add to Vercel**
1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Add these 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Step 3: Create Supabase Storage Bucket**
1. Go to Supabase Dashboard
2. Storage → Create new bucket
3. Name it: `media` (or `images`)
4. Make it public for image serving
5. Set CORS policy

### **Step 4: Set Upload Location in Admin Dashboard**
Update image upload destination to Supabase Storage

---

## 🎯 Usage in Code

### **Client-Side (Browser)**
```typescript
// Upload image via Supabase
const { data, error } = await supabase.storage
  .from('media')
  .upload(`units/${storeSlug}/${filename}`, file)
```

### **Server-Side (API)**
```typescript
// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

---

## 🔒 Security Guidelines

### **DO:**
✅ Keep `SUPABASE_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` in `.env` only  
✅ Share `NEXT_PUBLIC_*` variables with Vercel  
✅ Rotate keys regularly  
✅ Use scoped tokens with limited permissions  
✅ Enable RLS (Row Level Security) on storage buckets  

### **DON'T:**
❌ Put secret keys in Vercel  
❌ Commit `.env` to GitHub  
❌ Share secret keys via messages  
❌ Use keys in frontend code (except NEXT_PUBLIC_)  
❌ Log sensitive keys  

---

## ✅ Verification Checklist

After setup:
- [ ] .env updated with all keys
- [ ] Vercel environment variables set (3 public keys)
- [ ] Supabase storage bucket created
- [ ] CORS policy configured
- [ ] Test upload from admin dashboard
- [ ] Images display in gallery
- [ ] All 3 units can upload images

---

## 📚 Supabase Reference

**Project Name:** hhs oppbizeobea yngprn (default)

**Quick Links:**
- Dashboard: https://app.supabase.com
- Storage: https://app.supabase.com/project/hhsoppbizeobea yngprn/storage/buckets
- Settings: https://app.supabase.com/project/hhsoppbizeobea yngprn/settings/general

---

## 🚀 Next Steps

1. ✅ Update .env with Supabase keys
2. ✅ Add to Vercel environment
3. ✅ Create storage bucket
4. ✅ Test image uploads
5. ✅ Deploy to production

---

**Status:** ✅ **READY FOR IMPLEMENTATION**  
**Next:** Add keys to .env and redeploy

---

*All keys are stored in Supabase Dashboard under Settings → API*
