# CeyXcape Deployment Guide

Three pieces go to two places:

| Piece | Goes to |
|-------|---------|
| **Database (MySQL)** | cPanel — ✅ already imported |
| **Backend (Nest.js API)** | cPanel "Setup Node.js App" — same server as the DB |
| **Frontend (Next.js)** | Vercel |

Do them in this order: **Backend (cPanel) → Frontend (Vercel)**. The frontend
needs the backend's URL, so the backend goes live first.

---

## PART 1 — Backend on cPanel (Setup Node.js App)

### 1.1 Upload the backend code
1. In cPanel → **File Manager**, create a folder, e.g. `ceyxcape-api`
   (put it OUTSIDE `public_html` if you can — it shouldn't be web-browsable).
2. Upload the **`backend/`** folder contents into it. Easiest: zip the `backend`
   folder locally (WITHOUT `node_modules` and WITHOUT `.env`), upload the zip,
   and extract it in File Manager.
   - ✅ Include: `src/`, `package.json`, `package-lock.json`, `tsconfig.json`
   - ❌ Exclude: `node_modules/`, `dist/`, `.env`

### 1.2 Create the Node.js app
1. cPanel → **Setup Node.js App** → **Create Application**
2. Fill in:
   - **Node.js version:** 18 or 20
   - **Application mode:** Production
   - **Application root:** the folder you made (e.g. `ceyxcape-api`)
   - **Application startup file:** `dist/main.js`
3. Click **Create**.

### 1.3 Set environment variables
In the same screen, under **Environment variables**, add (use YOUR values):

```
NODE_ENV          = production
PORT              = (leave blank — cPanel sets it)
DB_HOST           = localhost
DB_PORT           = 3306
DB_USER           = ceyxcape_ceyxcape         (your cPanel DB user)
DB_PASS           = (your DB user's password)
DB_NAME           = ceyxcape_ceyxcape_new     (the DB you imported)
JWT_SECRET        = (a long random string — change from the dev one!)
JWT_EXPIRATION    = 7d
CORS_ORIGIN       = https://YOUR-VERCEL-APP.vercel.app   (set after Part 2)
ADMIN_EMAIL       = info@ceyxcape.com
# Email (optional — to send real inquiry emails):
MAIL_HOST         = smtp.gmail.com
MAIL_PORT         = 587
MAIL_USER         = (gmail address)
MAIL_PASSWORD     = (gmail app password)
MAIL_FROM         = noreply@ceyxcape.com
# Twilio (optional, for SMS):
TWILIO_SID        = (your real sid)
TWILIO_AUTH_TOKEN = (your real token)
```

> `DB_HOST = localhost` works because the backend and database are on the SAME
> cPanel server — no Remote MySQL needed. 🎉

### 1.4 Install dependencies & build
cPanel gives you a command to "Enter the virtual environment" (a `source ...`
line). Open cPanel → **Terminal** (or SSH), paste that line, then run:

```bash
cd ~/ceyxcape-api          # your app root
npm install                # installs dependencies
npm run build              # compiles TypeScript → dist/
```

### 1.5 Start it
Back in **Setup Node.js App**, click **Restart**. Your API is now live at:
```
https://yourdomain.com/  (or a subdomain cPanel assigns)
```
Test it: visit `https://yourdomain.com/api/tours` — you should see JSON of tours.

> Note the exact API URL cPanel gives you — you'll need it for the frontend.

---

## PART 2 — Frontend on Vercel

### 2.1 Import the project
1. Go to **vercel.com** → **Add New → Project**
2. Import your GitHub repo **CodexAi-dev/ceyxcape-app**
3. ⚠️ **Set the Root Directory to `frontend`** (since the repo has two folders).
   Vercel → project settings → Root Directory → `frontend`.
4. Framework preset: **Next.js** (auto-detected).

### 2.2 Set environment variables (Vercel → Settings → Environment Variables)
```
NEXT_PUBLIC_API_URL   = https://yourdomain.com/api    (the backend URL from 1.5)
NEXT_PUBLIC_SITE_URL  = https://YOUR-VERCEL-APP.vercel.app   (or your real domain)
```

### 2.3 Deploy
Click **Deploy**. Vercel builds and gives you a live URL.

---

## PART 3 — Connect the two

1. Copy your live **Vercel URL** (e.g. `https://ceyxcape.vercel.app`).
2. Back in cPanel → Setup Node.js App → env vars, set:
   ```
   CORS_ORIGIN = https://ceyxcape.vercel.app
   ```
   (comma-separate if you have multiple, e.g. add your custom domain later)
3. **Restart** the Node.js app.
4. Open your Vercel URL → the homepage, tours, etc. should load real data. ✅

---

## After it's live
- **Custom domain:** add it in Vercel (Settings → Domains), then also add it to
  `CORS_ORIGIN` and `NEXT_PUBLIC_SITE_URL`.
- **Submit sitemap to Google:** Search Console → add property → submit
  `https://yourdomain.com/sitemap.xml`.
- **Rotate secrets:** use fresh JWT_SECRET / Twilio keys in production.
