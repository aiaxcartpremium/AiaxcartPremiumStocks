'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [busy,setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/';

  async function doLogin(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if(error){ alert(error.message); return; }
    router.push(next);
  }

  return (
    <section className="card">
      <h1>Login</h1>
      <form onSubmit={doLogin}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        <button style={{marginTop:12}} disabled={busy}>{busy?'Logging in…':'Login'}</button>
      </form>
    </section>
  );
}