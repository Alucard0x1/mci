# MCI Training Platform

Professional training platform for Data Center, Business Continuity, and Cybersecurity programs.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, React Router, Lucide Icons
- **Backend:** Express.js, better-sqlite3, JWT Authentication
- **Build:** Vite

## Prerequisites

- Node.js v18+
- npm

## Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```
JWT_SECRET=replace-with-a-secure-random-string
PORT=3001
```

Generate a secure secret with `openssl rand -hex 32`.

### 3. Start Backend (Express + SQLite)

```bash
npm run server
```

Runs on `http://localhost:3001`. The SQLite database is automatically created and seeded on first run (`data/mci.db`).

### 4. Start Frontend (Vite + React)

In a separate terminal:

```bash
npm run dev
```

Runs on `http://localhost:3000`.

## Access

| Page | URL |
|---|---|
| Homepage | `http://localhost:3000` |
| Login | `http://localhost:3000/login` |
| Dashboard | `http://localhost:3000/dashboard` |

## Login Credentials

| Field | Value |
|---|---|
| Email | `admin@mci-training.com` |
| Password | `admin123` |

## API Endpoints

### Public (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Course detail |
| GET | `/api/calendar?category=&type=` | Training calendar |
| GET | `/api/testimonials` | Testimonials |
| GET | `/api/alumni-logos` | Alumni logos |
| GET | `/api/resources?category=` | Resources & articles |
| GET | `/api/instructors` | All instructors |
| POST | `/api/enquiries` | Submit contact form |
| POST | `/api/syllabus-download` | Syllabus download (lead capture) |
| POST | `/api/waitlist` | Join waitlist |
| GET | `/api/health` | Health check |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user (requires Bearer token) |

### Dashboard (requires Bearer token)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Summary statistics |
| GET | `/api/dashboard/enquiries` | List enquiries |
| GET | `/api/dashboard/leads` | List syllabus download leads |
| GET | `/api/dashboard/waitlist` | List waitlist entries |

## Project Structure

```
├── server/                  # Express.js backend
│   ├── index.ts             # Server entry point
│   ├── db/
│   │   ├── schema.ts        # Database schema & initialization
│   │   └── seed.ts          # Seed data
│   ├── middleware/
│   │   └── auth.ts          # JWT middleware
│   └── routes/
│       ├── auth.ts          # Login & auth routes
│       ├── courses.ts       # Course endpoints
│       ├── dashboard.ts     # Protected dashboard routes
│       └── public.ts        # Public API routes
├── lib/                     # Frontend utilities
│   ├── api.ts               # API client helper
│   └── AuthContext.tsx       # React auth context
├── components/              # Reusable UI components
├── pages/                   # Route pages (including Login & Dashboard)
├── data/                    # SQLite database (auto-generated)
├── constants.ts             # Static data (legacy, now in DB)
├── types.ts                 # TypeScript interfaces
└── App.tsx                  # Router & app shell
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend (Vite, port 3000) |
| `npm run server` | Start backend (Express, port 3001) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

## Deployment

See `deploy-prompt.md` for full server deployment instructions (Nginx + PM2 + SSL).
