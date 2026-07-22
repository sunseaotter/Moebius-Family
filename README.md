# The Global Moebius Family

A place for Moebius community members to register, browse, and connect with
each other. Built with Next.js (App Router), PostgreSQL, Prisma, and
NextAuth (Auth.js v5).

## Stack

- **Next.js 16** (TypeScript, App Router, Tailwind CSS v4)
- **PostgreSQL** via **Prisma ORM 7** (`@prisma/adapter-pg` driver adapter)
- **NextAuth v5** — credentials (email/password) login, JWT sessions
- **nodemailer** — SMTP email (works with Zeabur Email/ZSend or any SMTP provider)

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Database

Local dev uses Prisma's built-in local Postgres server — no Docker or
system Postgres install needed:

```bash
npx prisma dev -d -n moebius
npx prisma dev ls   # shows the current DATABASE_URL / port
```

Copy the `TCP` connection string it prints into `.env` as `DATABASE_URL`
(the port is randomly assigned each time the server is (re)created — once
running, it stays on the same port until you `npx prisma dev rm moebius`).

Then sync the schema:

```bash
npx prisma db push      # local dev: no shadow DB needed
npx prisma generate
npx prisma db seed      # creates the admin account from .env
```

> Note: `npx prisma migrate dev` needs a shadow database, which Prisma's
> local dev server doesn't support yet — use `db push` locally. Against a
> real PostgreSQL instance (e.g. Zeabur), use `prisma migrate deploy` with
> the migration in `prisma/migrations/` instead (see Deployment below).

### 3. Environment variables

Copy `.env` and fill in real values before deploying. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth session secret — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Public site URL (used in email links) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Outgoing email. If `SMTP_HOST` is empty, emails are logged to the console instead of sent (fine for local dev). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used only by `prisma db seed` to create the admin account |

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000. Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
to access `/admin`.

## How it works

- **Registration** (`/register`) creates a `PENDING` account. New users can
  log in immediately and browse the site, but won't appear in the member
  directory until an admin approves them from `/admin`.
- **Admin** (`sunseaotter@gmail.com`, seeded as `role=ADMIN`) reviews
  pending registrations and approves/rejects them; the member gets an
  email either way.
- **Member directory** (`/members`) lists `APPROVED` members with keyword
  search across name, nationality, TTT group, and Life Purpose.
- **Member profile** (`/members/[id]`) shows the member's public details;
  their contact email is only shown if they opted in
  (`contactEmailPublic`).
- **Forgot password** (`/forgot-password` → emailed link →
  `/reset-password/[token]`) issues a 30-minute one-time token.

## Deployment (Zeabur + GitHub)

1. Push this repo to GitHub.
2. In Zeabur, create a project, add a **PostgreSQL** service, and deploy
   this repo as a service (Zeabur auto-detects Next.js).
3. Set the environment variables above on the Next.js service — point
   `DATABASE_URL` at the Zeabur Postgres service, set a real `AUTH_SECRET`,
   `AUTH_URL` to your production domain, SMTP settings (e.g. Zeabur
   Email/ZSend), and the admin seed vars.
4. Run migrations against the real database once:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   (via Zeabur's service shell/exec, or locally with `DATABASE_URL`
   pointed at the production database).
