'use client';

import { useEffect, useState } from 'react';
import { sbBrowser } from '@/lib/supabaseClient';

type StockRow = {
  id: string;
  product_key: string;
  account_type: string | null;
  term_months: number | null;
  price: number | null;
  expires_at: string | null;
  qty: number | null;
  notes: string | null;
};

export default function OwnerPage() {
  const supabase = sbBrowser();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<StockRow[]>([]); // <== ito ang kulang dati

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        window.location.href = '/login?next=/owner';
        return;
      }
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id,product_key,account_type,term_months,price,expires_at,qty,notes')
        .order('expires_at', { ascending: true });
      if (error) alert(error.message);
      if (!cancelled) {
        setRows(stocks ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [supabase]);

  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ padding: 24 }}>
      <a href="/">← Back</a>
      <h1>Owner Panel</h1>
      <ul>
        {rows.map(r => (
          <li key={r.id}>
            {r.product_key} – {r.account_type} – {r.term_months} mo
          </li>
        ))}
      </ul>
    </div>
  );
}