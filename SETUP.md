# The Collection — Setup Guide

A private car inventory app. You (the admin) add cars with photos, specs, and
mileage. Anyone with the site link sees a read-only "collection" view you can
send to a buyer — they can't edit anything.

## What you're setting up

- **Vercel** — hosts the app (same as Carminey)
- **Supabase** — free database + photo storage (like a mini backend)

Total cost: $0 for a collection this size on both free tiers.

## 1. Create a Supabase project

1. Go to supabase.com → sign in → **New project**.
2. Once it's created, go to **SQL Editor** → **New query**.
3. Paste the contents of `supabase-schema.sql` (included in this project) and click **Run**.
4. Go to **Storage** → **New bucket** → name it exactly `car-photos` → toggle **Public bucket** ON → **Create**.
5. Go to **Project Settings → API**. You'll need three values from this page:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "reveal" — keep this one secret, never share it)

## 2. Set up the project locally

In Claude Code (or terminal), from this project folder:

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in the three Supabase values from step 1, plus an
`ADMIN_PASSWORD` of your choosing — that's the password you'll use to sign in
and edit the collection.

Test it locally:

```bash
npm run dev
```

Visit `http://localhost:3000` for the public view, and `http://localhost:3000/admin`
to sign in and start adding cars.

## 3. Deploy to Vercel

1. Push this project to a GitHub repo (or ask Claude Code to do it).
2. Go to vercel.com → **Add New → Project** → import the repo.
3. Before deploying, add the same 4 environment variables from `.env.local`
   under **Environment Variables**.
4. Deploy. You'll get a URL like `car-collection.vercel.app`.

## Using it

- **You**: go to `yoursite.vercel.app/admin`, sign in with your password, add
  the 30 cars with photos, specs, and mileage.
- **Buyer**: send them `yoursite.vercel.app` (no `/admin`) — that's the
  read-only page listing every car. Clicking a car opens its full detail page
  with photos and specs.

## A note on security

The admin password is simple by design — one editor, one password, no user
accounts. It's enough to keep random visitors from editing, but don't treat
it as bank-grade security. Don't reuse a password from anywhere else, and if
you ever need to revoke access, just change `ADMIN_PASSWORD` in Vercel and
redeploy.
