# Aiax Stock Pro

Pastel pink, classy stock & record system with Owner/Admin, holds, masked creds, CSV import/export, price presets, soft delete, sales with expiry bump.

## Setup
1) Create Supabase project. Copy `.env.example` to Vercel env.
2) Run `supabase.sql` in SQL Editor.
3) Create two users in Auth → Users. Insert roles into `profiles`.
4) Deploy to Vercel.

## Routes
- `/` home
- `/login?as=admin` or `/login?as=owner`
- `/owner` add stocks, CSV import/export, soft-delete
- `/admin` browse summary, hold/confirm reveal
- `/admin/records` edit buyer/channel/amount/discount/+days
