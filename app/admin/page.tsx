'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  product: string;
  account_type: string;   // column exists in your new schema
  term: string;
  price: number | null;
  expires_at: string | null;
  qty: number;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminPage(){
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/login?next=/admin'; return; }

      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id, product, account_type, term, price, expires_at, qty')
        .order('expires_at', { ascending: true });

      if (error) alert(error.message);
      if (!cancelled) {
        setRows(stocks ?? []);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  async function getAccount(id: string) {
    const { data, error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: id });
    if (error) return alert(error.message);
    alert(`Credentials:\n${JSON.stringify(data, null, 2)}`);
    // refresh list
    const { data: stocks } = await supabase
      .from('stocks')
      .select('id, product, account_type, term, price, expires_at, qty')
      .order('expires_at', { ascending: true });
    setRows(stocks ?? []);
  }

  return (
    <div className="card">
      <h1 className="h1">Admin Panel</h1>
      {loading ? 'Loading…' : rows.length === 0 ? 'No stocks yet' : (
        <div className="row">
          {rows.map(r => (
            <div className="card" key={r.id}>
              <div className="h2">{r.product} · {r.account_type}</div>
              <div>Term: {r.term} • Qty: {r.qty} • Expires: {r.expires_at ?? '—'}</div>
              <div className="actions" style={{marginTop:10}}>
                <button className="btn" onClick={()=>getAccount(r.id)}>Get Account</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <a className="back" href="/">← Back</a>
    </div>
  );
}