# CeyXcape Deployment Guide — All on cPanel

Everything runs on your cPanel host, under ONE domain. Two Node.js apps + the
MySQL database, all on the same server.

```
app.yourdomain.com         → Next.js frontend   (Node.js app #1)
app.yourdomain.com/api     → Nest.js backend    (Node.js app #2)
database                   → cPanel MySQL        ✅ already imported
```

## Safe rollout (the old site stays live!)

Your old PHP site is still live at `yourdomain.com`. We deploy the NEW app to a
**test subdomain** first, verify it, then switch the main domain later.

```
Phase 1: build/test new app at  app.yourdomain.com   (old site untouched)
Phase 2: when happy → point yourdomain.com to the new app
```

---

## STEP 0 — Create the test subdomain

cPanel → **Domains** (or **Subdomains**) → create:
- Subdomain: `app`  →  gives `app.yourdomain.com`
- Note its document root folder (e.g. `/home/USER/app.yourdomain.com`).

---

## STEP 1 — Backend API (Node.js app #2)

### 1a. Upload
- File Manager → make a folder e.g. `ceyxcape-api` (in home dir, NOT public_html).
- Upload `ceyxcape-backend-upload.zip`, extract it (gives `src/`, `package.json`…).

### 1b. Create the Node.js app
cPanel → **Setup Node.js App** → **Create Application**:
- Node version: **20**
- Mode: **Production**
- Application root: `ceyxcape-api`
- Application URL: choose `app.yourdomain.com` and path **`/api`**
- Startup file: `dist/main.js`

### 1c. Environment variables (add in the app screen)
```
NODE_ENV     = production
DB_HOST      = localhost
DB_PORT      = 3306
DB_USER      = <your cPanel DB user>
DB_PASS      = <db password>
DB_NAME      = ceyxcape_ceyxcape_new
JWT_SECRET   = <long random string — NOT the dev one>
JWT_EXPIRATION = 7d
CORS_ORIGIN  = https://app.yourdomain.com
ADMIN_EMAIL  = info@ceyxcape.com
# optional email:
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=<gmail>
MAIL_PASSWORD=<gmail app password>
MAIL_FROM=noreply@ceyxcape.com
```
(`DB_HOST=localhost` works — DB is on the same server. No Remote MySQL needed.)

### 1d. Install + build (cPanel Terminal/SSH)
Copy the "enter virtual environment" command cPanel shows, run it, then:
```bash
cd ~/ceyxcape-api
npm install
npm run build
```
Back in Setup Node.js App → **Restart**.

### 1e. Test
Visit `https://app.yourdomain.com/api/tours` → should return JSON of tours. ✅

---

## STEP 2 — Frontend (Node.js app #1)

### 2a. Upload
- File Manager → the subdomain's folder (e.g. `app.yourdomain.com`).
- Upload `ceyxcape-frontend-upload.zip`, extract (gives `src/`, `public/`,
  `package.json`, `server.js`, `next.config.js`…).

### 2b. Create the Node.js app
Setup Node.js App → Create Application:
- Node version: **20**
- Mode: **Production**
- Application root: the subdomain folder
- Application URL: `app.yourdomain.com` (path `/`)
- Startup file: **`server.js`**

### 2c. Environment variables
```
NODE_ENV             = production
NEXT_PUBLIC_API_URL  = https://app.yourdomain.com/api
NEXT_PUBLIC_SITE_URL = https://app.yourdomain.com
```

### 2d. Install + build (Terminal)
```bash
cd ~/app.yourdomain.com        # the frontend root
npm install
npm run build                  # creates the .next production build
```
Setup Node.js App → **Restart**.

### 2e. Test
Open `https://app.yourdomain.com` → homepage with real tours should load. ✅

---

## STEP 3 — Verify on the subdomain
- Homepage, /tours, a tour detail, /custom-tour, /gallery all load with real data.
- Submit an inquiry → check it appears in /admin (login admin@ceyxcape.com).
- Tour images display (served via /uploads proxy).

If all good → proceed to switch the main domain.

---

## STEP 4 — Switch the main domain (when ready)
Once confident, repoint `yourdomain.com` to the new app:
- Easiest: in Setup Node.js App, change the frontend app's URL from
  `app.yourdomain.com` to `yourdomain.com` (and update the two NEXT_PUBLIC_*
  envs + the backend CORS_ORIGIN to the main domain), then rebuild/restart.
- The old PHP site is then replaced.

### After going live
- **Submit sitemap:** Google Search Console → `https://yourdomain.com/sitemap.xml`
- **Rotate secrets:** fresh JWT_SECRET, Twilio keys.
- Update `CORS_ORIGIN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` to the
  final domain everywhere.
