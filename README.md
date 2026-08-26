# Kevin Syonin — Portfolio

Personal portfolio with a public site and an admin dashboard.

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Express (also deployed as a Vercel serverless function via `api/index.js`)
- **Database:** Supabase Postgres
- **Media:** Cloudinary
- **Design:** "Lotus" theme — cream & lotus-blue palette, serif display type (Fraunces), floating dynamic-island navigation

## Project structure

```
├── api/               Vercel serverless entry (re-exports the Express app)
├── server/            Express API
│   ├── config/        Database connection & schema init
│   ├── middleware/    Auth (JWT) & upload (Cloudinary) middleware
│   ├── routes/        REST routes per resource
│   └── scripts/       One-off migration/maintenance scripts
└── src/
    ├── components/    Public site sections
    │   ├── decor/     Lotus SVG artwork
    │   └── ui/        Shared UI building blocks
    ├── constants/     Nav links & site identity
    ├── context/       Theme & auth providers
    ├── hooks/         useApiData — shared data fetching
    ├── lib/           Date, media-URL & skill-icon helpers
    └── pages/admin/   Admin dashboard
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   cd server && npm install
   ```

2. Create env files from the examples and fill in your values:

   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

   `server/.env` needs your Supabase `DATABASE_URL`, a `JWT_SECRET`,
   Cloudinary keys, and Gmail app-password for the contact form.

3. Run backend and frontend in two terminals:

   ```bash
   npm run server
   ```

   ```bash
   npm run dev
   ```

   Frontend: http://localhost:5173 · API: http://localhost:5000

## Notes

- `.env` files are gitignored — never commit credentials.
- `server/scripts/` contains legacy one-off scripts; they read `DATABASE_URL` from the environment.
