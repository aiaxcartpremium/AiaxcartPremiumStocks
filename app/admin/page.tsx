// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: number;
  product_key: string;
  account_type: string;
  term_days: number | null;
  price: number | null;
  expires_at: string | null;
  qty: number | null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setUserId(auth.user?.id ?? null);

      const { data, error } = await supabase
        .from('stocks')
        .select('id, product_key, account_type, term_days, price, expires_at, qty')
        .order('expires_at', { ascending: true });

      if (error) { alert(error.message); return; }
      setRows(data ?? []);
    })();
  }, []);

  async function getAccount(r: Row) {
    if (!userId) return alert('No admin user');
    setBusy(true);
    const { data, error } = await supabase.rpc('grant_and_get_credentials', {
      p_stock_id: r.id,
      p_admin: userId,
    });
    setBusy(false);
    if (error) return alert(error.message);

    const cred = data?.[0];
    if (!cred) { alert('No credentials returned'); return; }

    const text = `Product: ${cred.product_key}
Type: ${cred.account_type}
Expires: ${new Date(cred.expires_at).toISOString().slice(0,10)}
Email: ${cred.email ?? '-'}
Pass: ${cred.pass ?? '-'}
Profile: ${cred.profile ?? '-'}
PIN: ${cred.pin ?? '-'}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    alert('Credentials copied to clipboard.');

    // refresh list (qty may have changed or row deleted)
    const { data: refreshed } = await supabase
      .from('stocks')
      .select('id, product_key, account_type, term_days, price, expires_at, qty')
      .order('expires_at', { ascending: true });
    setRows(refreshed ?? []);
  }

  if (!rows) return <main className="container"><p>Loading…</p></main>;

  return (
    <main className="container">
      <h1 className="title">Admin Panel</h1>
      {rows.length === 0 ? <p>No stocks yet</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th><th>Type</th><th>Term</th><th>Price</th><th>Expires</th><th>Qty</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.product_key}</td>
                <td>{r.account_type}</td>
                <td>{r.term_days ?? '-'}</td>
                <td>{r.price ?? '-'}</td>
                <td>{r.expires_at ? new Date(r.expires_at).toISOString().slice(0,10) : '-'}</td>
                <td>{r.qty ?? 0}</td>
                <td><button disabled={busy} onClick={()=>getAccount(r)}>Get Account</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}