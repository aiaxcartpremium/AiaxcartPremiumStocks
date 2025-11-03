import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getServerAuth() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  return { supabase, session };
}