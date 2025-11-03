# Aiaxcart Premium Shop

Next.js 14 (app dir) + Supabase stock manager.

## Quick start
1. Create project on Vercel, import this folder.
2. Set env vars (already included in `.env.local` but add to Vercel too).
3. In Supabase SQL editor, run the `supabase_setup.sql` from this repo.
4. Deploy. Use **Login → Quick login** buttons.

## Pages
- `/` Home (only Home + Login in header)
- `/login` Login/Logout
- `/admin` Admin panel (requires login)
- `/owner` Owner panel (requires login)
