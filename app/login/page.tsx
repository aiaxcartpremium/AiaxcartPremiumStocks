'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) return alert(error.message);
    // Route by identity (admin vs owner)
    if (email.toLowerCase() === 'admin1@aiaxcart.shop') window.location.href = '/admin';
    else window.location.href = '/owner';
  }

  return (
    <div className="card">
      <h1 className="h1">Login</h1>
      <form className="row" onSubmit={signIn}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <div className="actions">
          <button className="btn" disabled={loading}>{loading?'Signing in…':'Login'}</button>
          <a className="back" href="/">← Back</a>
        </div>
      </form>
    </div>
  );
}