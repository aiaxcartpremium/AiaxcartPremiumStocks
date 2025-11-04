'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabaseClient';

type Row = { id: string; product_key: string; account_type: string; term: string; quantity: number; expires_at: string | null };

export default function AdminPage() {
  const supabase = browserClient();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login?next=/admin');
        return;
      }
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id, product_key, account_type, term, quantity, expires_at')
        .order('expires_at', { ascending: true });

      if (error) alert(error.message);
      if (!cancelled) setRows(stocks ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  // …rest of your admin buttons (Get Account, Buyer Records link, Logout) …
  return (
    <section className="container">
      <div className="pills">
        <button className="btn" onClick={() => router.back()}>Back</button>
        <button
          className="btn primary"
          onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
        >
          Logout / Switch
        </button>
      </div>

      <h1 className="title">Admin Panel</h1>
      {loading ? <p>Loading…</p> : (
        <ul className="list">
          {rows.map(r => (
            <li key={r.id}>
              <strong>{r.product_key}</strong> • {r.account_type} • {r.term} • Qty {r.quantity}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
