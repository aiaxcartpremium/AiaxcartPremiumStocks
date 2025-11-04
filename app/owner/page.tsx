'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabaseClient';

type Stock = {
  id: string;
  product_key: string;
  account_type: string;
  term: string;
  price: number;
  email?: string | null;
  password?: string | null;
  profile?: string | null;
  pin?: string | null;
  quantity: number;
  notes?: string | null;
  expires_at: string | null;
};

export default function OwnerPage() {
  const supabase = browserClient();
  const router = useRouter();

  const [rows, setRows] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login?next=/owner');
        return;
      }

      const { data: stocks, error } = await supabase
        .from('stocks')
        .select(
          'id, product_key, account_type, term, price, email, password, profile, pin, quantity, notes, expires_at'
        )
        .order('expires_at', { ascending: true });

      if (error) alert(error.message);
      if (!cancelled) setRows(stocks ?? []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const back = () => router.back();
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <section className="container">
      <div className="pills">
        <button className="btn" onClick={back}>Back</button>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </div>

      <h1 className="title">Owner Panel</h1>
      <p className="muted">Add or review on-hand accounts.</p>

      {/* --- your add stock form stays here (unchanged) --- */}

      <div className="card">
        <h2 className="subtitle">On-hand (preview)</h2>
        {loading ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p>No stocks yet.</p>
        ) : (
          <ul className="list">
            {rows.map((r) => (
              <li key={r.id}>
                <strong>{r.product_key}</strong> • {r.account_type} • {r.term} • Qty {r.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
