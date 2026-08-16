# Admin Panel

React + Vite + TypeScript admin dashboard for the Sog'liq/telemedicine platform. Talks to the [`Server`](../Server) REST API.

## Stack

React 18, Vite, TypeScript, Tailwind CSS, React Router, Axios, TanStack Query, React Hook Form + Zod, Recharts, Lucide React.

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL if the API isn't on localhost:5000
npm run dev
```

Runs on `http://localhost:5174` by default. Make sure the `Server`'s `CLIENT_URL` env includes this origin for CORS.

Demo admin login: `admin@healthy.uz` / `Admin123!`

## Notes on the backend contract

- List endpoints (`/api/admin/users`, `/doctors`, `/patients`, `/appointments`, `/articles`, `/sports`) return the full collection with no server-side pagination, search, or filtering — this app does all of that client-side.
- "Blocking" a user is `PUT /api/admin/users/:id/status` with `{ isActive: boolean }`; there is no separate status enum.
- There's no `GET /api/admin/categories` — the public `GET /api/categories` is used to list categories in the admin UI too.
- Dashboard charts (Users Growth, Appointments, Doctors, Patients) are computed client-side from the list endpoints since the backend only exposes aggregate totals, not time-series data.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build
