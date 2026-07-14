# Managing Your Website Content — CleanDeep

Log in at **yourdomain.co.za/admin/deep-cleaning** with your dashboard password.

## Adding a Customer Review (Testimonial)

1. Click the **Pages** tab.
2. Scroll to section **4 — Client Testimonials**.
3. Fill in the **Add a New Review** box:
   - **Client Name** — the customer's real name.
   - **Role / Area** (optional) — e.g. "Homeowner, Bellville".
   - **Review Text** — paste what the customer actually said (WhatsApp message, Google review, email — copy their real words).
   - **Rating** — click the stars (1–5).
   - **Client Photo** (optional) — upload a photo of the customer if you have one and they're OK with it. If you skip this, their initials are shown instead.
4. Click **Add Review**.

It appears on the live site immediately under "Honest Reviews from our Customers" — no need to click "Save & Publish" for this part, testimonials save on their own.

**To hide a review without deleting it:** click the eye icon next to it in the list — useful if a customer asks you to take it down later, or you want to swap in a fresher one without losing the old one.

**To remove a review permanently:** click the trash icon.

> Only add reviews from customers who actually said these things. The old page had four made-up reviews copied from an unrelated business — these have been removed.

## Changing the About Section Photo

1. **Pages** tab → section **3 — About & Values Section**.
2. Under **About Section Photo**, click **Upload Photo** and pick an image from your computer or phone.
3. Click **Save & Publish Storefront** at the bottom of the page.

## Adding Photos of Completed Jobs

1. **Pages** tab → section **5 — Gallery Images & Media**.
2. Click **Add Another Photo Slot**, then click **Upload** on that row and pick a photo.
3. Optionally add a caption (e.g. "Carpet — Before & After").
4. Repeat for more photos. The first photo in the list is shown larger on the site.
5. Click **Save & Publish Storefront**.

The old gallery pointed to two photos that were never actually uploaded (they showed as broken images) — these placeholders have been cleared, so the gallery section stays hidden until you upload real photos.

## One-time setup still needed

Image uploads require a working Supabase Storage bucket. Right now the Supabase project referenced in `.env` (`hhsoppbizeobeayngprn.supabase.co`) doesn't resolve — it may have been deleted or the reference is wrong. Before uploads will work:

1. Log into [app.supabase.com](https://app.supabase.com) and confirm your project's URL and API keys (Settings → API).
2. Create a **public** storage bucket named `media` (Storage → New bucket).
3. Update `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env` (local) and in Vercel's Environment Variables (production) if they've changed.

Until then, uploads will show a clear error message rather than failing silently.
