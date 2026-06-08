# Old → New Data Migration Guide

This migrates the **3 real tours** and **13 gallery images** from the old PHP
database into the new inquiry-system database. (Old bookings, payments, users
etc. are intentionally skipped.)

## Files involved

| File | Purpose |
|------|---------|
| `database/schema.sql` | Creates the new tables (run this first) |
| `database/migration-old-data.sql` | Inserts the real tours + gallery (run this second) |
| `database/build-migration.js` | Regenerates the migration from the old dump (only if needed) |

---

## Step 1 — Create the database & tables

In **cPanel → phpMyAdmin** (or local XAMPP):

1. Create a database named `ceyxcape_new` (or your chosen name).
2. Import `database/schema.sql` into it.

> If your cPanel DB name differs (e.g. `username_ceyxcape`), edit the
> `USE ceyxcape_new;` line at the top of both `.sql` files to match, **or**
> just import each file while that database is selected in phpMyAdmin.

## Step 2 — Import the real data

Import `database/migration-old-data.sql`.

> ⚠️ This file **deletes the sample seed tours/gallery first**, then inserts the
> real ones — so run it on a fresh DB (or accept that the 10 sample tours are
> replaced by the 3 real ones). The admin user from `schema.sql` is kept.

After import you should have: **3 tours, 13 gallery images.**

---

## Step 3 — Copy the image FILES

The database stores image *names*; the actual image *files* must be copied from
the old server. Here's exactly what goes where:

### ✅ Gallery images — already done
The 13 gallery image files already exist in
`frontend/public/images/gallery/`. **No action needed.**

### ⬜ Tour images — you need to copy these
From the **old server's `uploads/tours/` folder**, copy into the **new
project's `frontend/public/uploads/tours/` folder**:

**3 tour main images:**
```
tour_6913197bc9c17.png
tour_1773666592_69b80120d0234.webp
tour_1773666269_69b7ffdda92c7.webp
```

**40 tour gallery images** — from the old `uploads/tours/gallery/` folder,
copy into the new project's `frontend/public/uploads/tours/gallery/` folder.
(These are the `gallery_*.jpeg` files referenced by tours #7 and #8.)

> Tip: easiest is to download the **entire** old `uploads/tours/` folder
> (including its `gallery/` subfolder) and drop it into
> `frontend/public/uploads/tours/`. Extra files don't hurt.

In **production**, these files live wherever your backend serves `/uploads`
from (the frontend proxies `/uploads/*` → the API origin via `next.config.js`).

---

## Verify

Start the app and visit `/tours` — you should see the 3 real tours with images,
and `/gallery` should show the 13 photos.
