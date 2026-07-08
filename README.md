# Transporter — Delivery Tracking System

A full-stack delivery booking and tracking platform built with Next.js, PostgreSQL, and Prisma. Customers can book deliveries and track them in real time, drivers manage their assigned jobs, and admins run the whole operation from a dashboard.

Built as a first-year software development internship project.

## Features

- **Customer flow** — book a delivery (pickup/delivery address, package type, weight, notes), get a tracking ID, follow live status on an interactive map, rate completed deliveries
- **Driver flow** — view assigned deliveries, update delivery status as a job progresses
- **Admin dashboard** — see stats across all deliveries and users, assign drivers to pending deliveries, manage delivery records
- **Authentication** — email/password accounts with hashed passwords and signed session cookies, three roles: `CUSTOMER`, `DRIVER`, `ADMIN`
- **Live tracking map** — Leaflet-based map showing delivery location/status
- **Email notifications** — automatic email when a delivery's status changes
- **Delivery status history** — full audit trail of every status change per delivery

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | [Prisma](https://www.prisma.io/) |
| Styling | Tailwind CSS |
| Maps | Leaflet / react-leaflet |
| Auth | bcrypt password hashing + custom signed session cookies (Web Crypto HMAC) |
| Email | Nodemailer |
| Icons | lucide-react |

## Project Structure

```
app/
├── api/                      # API routes (route handlers)
│   ├── auth/
│   │   ├── login/            # POST - authenticate, set session cookie
│   │   ├── register/         # POST - create CUSTOMER or DRIVER account
│   │   └── logout/           # POST - clear session cookie
│   ├── admin/dashboard/      # GET  - stats + recent deliveries (ADMIN only)
│   ├── drivers/               # GET  - list all drivers (ADMIN only)
│   │   └── [id]/deliveries/  # GET  - a driver's assigned deliveries
│   ├── deliveries/            # GET/POST - list/create deliveries
│   │   └── [id]/
│   │       ├── route.ts      # GET/PATCH/DELETE a single delivery
│   │       └── assign-driver # PATCH - assign a driver (ADMIN only)
│   └── ratings/                # GET/POST - delivery ratings
├── admin/                    # Admin dashboard page
├── driver/                   # Driver dashboard page
├── login/, register/          # Auth pages
├── book_delivery/, package_type/, review_and_confirm/  # Booking flow
├── track/                    # Delivery tracking page
└── components/TrackingMap.tsx # Leaflet map component

lib/
├── prisma.ts                 # Prisma client singleton
├── session.ts                # Signed session token creation/verification
└── email.ts                  # Nodemailer email sending

prisma/
└── schema.prisma             # Database schema

middleware.ts                  # Route protection based on session role
```

## Database Schema

**User**
- `id`, `email` (unique), `password` (bcrypt hash), `name`, `role` (`CUSTOMER` | `DRIVER` | `ADMIN`)
- Relations: deliveries booked as a customer, deliveries assigned as a driver

**Delivery**
- Sender/receiver details, pickup/delivery addresses, package type, weight, driver notes
- `status` (`PENDING` → `ASSIGNED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED` / `CANCELLED`)
- Optional rating (score, tags, feedback)
- Linked to the customer who booked it and the driver assigned to it

**DeliveryStatusHistory**
- Every status change for a delivery, timestamped — powers the tracking timeline

## Authentication & Authorization

Sessions are handled with a custom lightweight token (no external auth library):

1. On login, the server signs a payload (`userId`, `role`, expiry) with an HMAC-SHA256 secret (`SESSION_SECRET`) and sets it as an **httpOnly** cookie. The browser can't read or modify it.
2. `middleware.ts` verifies the signed cookie and redirects unauthenticated/unauthorized users away from `/admin`, `/driver`, and `/track`.
3. Every sensitive API route (admin dashboard, driver list, assign-driver, delivery update/delete) independently re-checks the session server-side — protection doesn't rely on the frontend alone.
4. Public self-registration can only create `CUSTOMER` or `DRIVER` accounts. `ADMIN` accounts must be created directly in the database (e.g. via Prisma Studio) — there's no public sign-up path to admin.

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local or hosted)

### 1. Clone and install
```bash
git clone <your-repo-url>
cd transporter-delivery-tracking
npm install
```

### 2. Configure environment variables
Copy `example.env` to `.env` and fill in your own values:
```bash
cp example.env .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/transporter_db` |
| `EMAIL_USER` | Gmail address used to send status notification emails |
| `EMAIL_PASS` | [Gmail App Password](https://support.google.com/accounts/answer/185833) (not your regular password) |
| `TEST_EMAIL` | Address that receives status-change notification emails during development |
| `SESSION_SECRET` | Long random string used to sign session cookies. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

**Never commit your `.env` file.** It's already in `.gitignore` — only `example.env` (with placeholder values) should be tracked in git.

### 3. Set up the database
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 5. Create an admin account (optional)
Public registration only allows `CUSTOMER` or `DRIVER`. To create an admin:
```bash
npx prisma studio
```
Register a normal account, then open Prisma Studio, find that user in the `User` table, and change `role` to `ADMIN`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Known Limitations / Possible Improvements

- `/track` currently loads all deliveries and filters client-side; a production version should scope the query to a specific tracking ID/code server-side rather than returning every record.
- No pagination on delivery/driver list endpoints — fine at small scale, would need it for production volume.
- Driver actions (e.g. updating a delivery's status) currently check for *any* logged-in driver rather than confirming the delivery is assigned to *that specific* driver.
- No password reset flow.

## License

This project was built for educational/internship purposes.
