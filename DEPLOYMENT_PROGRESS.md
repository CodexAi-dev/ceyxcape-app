# Deployment — Progress & Resume Notes

**Status:** PAUSED — resuming at "Deploy backend to Render".
**Reason paused:** Render requires a $1 card verification hold; user will recharge
the card, then continue.

## Final architecture (decided)
```
Frontend (Next.js)  →  Vercel        (free)
Backend  (Nest.js)  →  Render        (free tier)
Database (MySQL)    →  cPanel        (keep — Remote MySQL enabled)
Domain              →  Vercel later  (safe rollout: test on Vercel URL first,
                                       then point ceyxcape.com — old PHP site
                                       stays live until then)
```
> Why not all-cPanel: the cPanel plan is only **512 MB** disk — too small for
> Node.js `node_modules`. `npm install` failed with `-122` (out of space).
> So we moved frontend→Vercel, backend→Render (both free, no disk limit).

## ✅ Done
- Code is cPanel/cloud-ready and pushed to GitHub (CodexAi-dev/ceyxcape-app).
- Backend: binds 0.0.0.0, portable entities path, `start:prod` = `node dist/main`.
- Database imported into cPanel MySQL `ceyxcape_ceyxcape_new` (tours + gallery).
- cPanel **Remote MySQL** enabled (`%` access host added).
- Failed cPanel Node install cleaned up (app + folder deleted).
- Test subdomain exists: `app.ceyxcape.com` (may or may not be used now that
  frontend goes to Vercel — can ignore or reuse).

## 🔑 Connection details (for Render env vars)
```
NODE_ENV        production
DB_HOST         23.227.187.189        (cPanel server IP; ceyxcape.com also works)
DB_PORT         3306
DB_USER         ceyxcape_admin
DB_PASS         <user enters on Render>
DB_NAME         ceyxcape_ceyxcape_new
JWT_SECRET      DUfbExZbLUcjTnGpTvTkkt6Np9P09Bolxl47oMXr9GsA5ZH6670OTvRV3pRglNRN
JWT_EXPIRATION  7d
CORS_ORIGIN     https://placeholder.vercel.app   (REPLACE with real Vercel URL after step 2)
ADMIN_EMAIL     info@ceyxcape.com
```

## ▶️ RESUME HERE — remaining steps

### 1. Backend → Render
- render.com → New + → Web Service → repo `CodexAi-dev/ceyxcape-app`
- Root Directory: `backend`
- Build: `npm install && npm run build`
- Start: `npm run start:prod`
- Instance: Free
- Add the env vars above (type real DB_PASS).
- Deploy. Success = logs show "API running on port ...". Note the Render URL
  (e.g. https://ceyxcape-api.onrender.com).
- Test: open `https://<render-url>/api/tours` → should return tour JSON.

### 2. Frontend → Vercel
- vercel.com → Add New → Project → import `CodexAi-dev/ceyxcape-app`
- **Root Directory = `frontend`**  (important)
- Env vars:
  ```
  NEXT_PUBLIC_API_URL   = https://<render-url>/api
  NEXT_PUBLIC_SITE_URL  = https://<your-vercel-app>.vercel.app
  ```
- Deploy. Note the Vercel URL.

### 3. Connect them
- Back in Render → set `CORS_ORIGIN = https://<your-vercel-app>.vercel.app`
  (the real one) → redeploy/restart.
- Open the Vercel URL → homepage + tours should load real data.
- Submit an inquiry → check `/admin` (admin@ceyxcape.com / Admin@1234).

### 4. Go live (when confident)
- Add custom domain `ceyxcape.com` in Vercel → update DNS as Vercel instructs.
- Update `NEXT_PUBLIC_SITE_URL` + `CORS_ORIGIN` to the final domain.
- Submit `https://ceyxcape.com/sitemap.xml` to Google Search Console.
- Rotate Twilio key (was exposed earlier).

## ⚠️ Known watch-points
- Render free tier sleeps after ~15 min idle → first request after idle is slow
  (cold start). Our SEO build uses ISR so visitor pages are static/cached and
  not affected, but the very first inquiry submit after idle may lag.
- If backend logs show "Unable to connect to the database": re-check Remote MySQL
  `%` host, DB_HOST, and that DB_PASS is correct.
