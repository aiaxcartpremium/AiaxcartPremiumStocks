'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="wrap">
      <div className="brand">Aiaxcart Premium Shop</div>
      <nav className="nav">
        <Link className="btn ghost" href="/">Home</Link>
        {!authed ? (
          <Link className="btn pink" href="/login">Login</Link>
        ) : (
          <button className="btn pink" onClick={logout}>Logout</button>
        )}
      </nav>
      <style jsx>{`
        .wrap{display:flex;justify-content:space-between;align-items:center;padding:18px}
        .brand{font-weight:800}
        .nav{display:flex;gap:12px}
        .btn{padding:10px 16px;border-radius:14px;border:1.5px solid var(--pink-300)}
        .btn.ghost{background:#fff}
        .btn.pink{background:var(--pink-300); color:#222; border-color:transparent}
      `}</style>
    </header>
  );
}