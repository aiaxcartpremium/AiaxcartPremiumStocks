'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  product_key: string;
  account_type: string;
  term_days: number|null;
  price: number|null;
  expires_on: string|null;
  quantity: number|null;
};

type Cred = {
  email?: string|null;
  password?: string|null;
  profile?: string|null;
  pin?: string|null;
  product_key: string;
  account_type: string;
  expires_on: string|null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('stocks')
      .select('id,product_key,account_type,term_days,price,expires_on,quantity')
      .order('product_key', { ascending: true });
    setLoading(false);
    if (error) return alert(error.message);
    setRows((data as any[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function getAccount(stockId: string) {
    // This RPC must exist (see earlier messages). It should
    //  - log to admin_grants
    //  - return one credential
    //  - decrement quantity or delete when 0
    const { data, error } = await supabase.rpc('grant_account', { p_stock_id: stockId });
    if (error) return alert(error.message);

    const cred = data as Cred;
    // Show once, not stored in list
    alert(
      [
        `Product: ${cred.product_key}`,
        `Type: ${cred.account_type}`,
        `Expires: ${cred.expires_on ?? '-'}`,
        `Email: ${cred.email ?? '-'}`,
        `Password: ${cred.password ?? '-'}`,
        `Profile: ${cred.profile ?? '-'}`,
        `PIN: ${cred.pin ?? '-'}`,
      ].join('\n')
    );

    // refresh list so qty reduces
    await load();
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin Panel</h1>

      {loading && <p>Loading…</p>}

      <div className="overflow-x-auto bg-white/60 border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Product</th>
              <th className="p-2">Type</th>
              <th className="p-2">Term</th>
              <th className="p-2">Price</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Qty</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.product_key}</td>
                <td className="p-2">{r.account_type}</td>
                <td className="p-2">{r.term_days ?? '-'}</td>
                <td className="p-2">{r.price ?? '-'}</td>
                <td className="p-2">{r.expires_on ?? '-'}</td>
                <td className="p-2">{r.quantity ?? 0}</td>
                <td className="p-2">
                  <button
                    onClick={()=>getAccount(r.id)}
                    className="rounded px-3 py-1 bg-pink-200 hover:bg-pink-300">
                    Get Account
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td className="p-3 text-center text-slate-500" colSpan={7}>No stocks yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}