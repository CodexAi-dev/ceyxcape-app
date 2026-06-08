# CeyXcape — Private Sri Lanka Tours Platform

A tourism / lead-generation website for private Sri Lanka tours. Visitors browse
tours, view destination guides, and submit inquiries; the business follows up by
email / WhatsApp. Includes an admin panel to manage tours, inquiries and the gallery.

> **Model:** This is an **inquiry-based** site (not online booking/payment).
> The booking/payment scaffolding in the code is intentionally inactive.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Backend** | Nest.js 10, TypeORM, JWT auth, Swagger |
| **Database** | MySQL (via XAMPP in development) |
| **Hosting (target)** | Frontend → Vercel · Backend → Render · DB → cloud MySQL |

The project is split into two apps:

```
ceyxcape-app/
├── frontend/    # Next.js website + admin UI  (port 3000)
├── backend/     # Nest.js REST API            (port 3001)
├── database/    # schema.sql (MySQL)
└── .github/     # CI workflow
```

---

## Prerequisites

- **Node.js 18+** and npm
- **XAMPP** (or any MySQL 8 server) running on `localhost:3306`

---

## Getting Started (local development)

### 1. Database

Start MySQL in XAMPP, then import the schema (creates the `ceyxcape_new`
database, tables, an admin user and sample tours):

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root < database\schema.sql
```

> The backend uses TypeORM `synchronize: true` in development, so tables are
> also auto-created — but `schema.sql` seeds the sample data.

### 2. Backend API (terminal 1)

```powershell
cd backend
npm install
npm run start:dev
```

Runs at **http://localhost:3001/api** · Swagger docs at **http://localhost:3001/api**

Configure `backend/.env` (see `backend/.env.example`). Key values:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=ceyxcape_new
JWT_SECRET=<your secret>
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend (terminal 2)

```powershell
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:3000**

Configure `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Admin Panel

Visit **http://localhost:3000/admin** and log in:

| Email | Password |
|-------|----------|
| `admin@ceyxcape.com` | `Admin@1234` |

From here you can manage Tours, Inquiries and the Gallery. (Access is enforced
server-side by `JwtAuthGuard` + `RolesGuard`.)

---

## API Overview

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| **Tours** | `GET /tours`, `GET /tours/:id`, `GET /tours/featured`, admin CRUD + image upload |
| **Inquiries** | `POST /inquiries` (public), admin list/read/delete |
| **Gallery** | `GET /gallery` (public), admin upload/delete |
| **Admin** | `GET /admin/stats` |

Full interactive docs: run the backend and open `http://localhost:3001/api`.

---

## SEO

This project ships with a production SEO foundation:

- **ISR-rendered** tour pages (`/tours/[id]`) — static HTML, resilient to a slow API
- **Per-page metadata** + canonical URLs (`generateMetadata`)
- **Dynamic** `sitemap.xml` and `robots.txt`
- **JSON-LD** structured data (Organization, Product/Tour, Breadcrumbs)
- **OpenGraph / Twitter** cards for social link previews
- **Destination** landing pages (`/destinations/[slug]`) for location keywords

### Required production env vars (Vercel)

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com      # powers canonicals, sitemap, OG
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

---

## CI

Every push to `main` runs `.github/workflows/ci.yml`:
type-check → lint → build → security audit (both apps) + a repo-wide secret scan.

---

## Scripts

**Backend** (`cd backend`): `npm run start:dev` · `npm run build` · `npm test`
**Frontend** (`cd frontend`): `npm run dev` · `npm run build` · `npm run lint` · `npm run type-check`
