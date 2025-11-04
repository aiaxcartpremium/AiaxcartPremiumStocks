// lib/supabaseClient.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';

export const browserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// If you later need server actions, you can export a server client too:
export const serverClient = (cookies: () => string) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: cookies } }
  );
