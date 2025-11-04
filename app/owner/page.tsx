'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type StockRow = {
  id: string;
  product_key: string;
  account_type: string;
  term_months: number;
  price?: number | null;
  expires_at?: string | null;
  quantity?: number | null;
  notes?: string | null;
};

export default function OwnerPage() {
  // ✅ make sure these exist so setRows/setLoading are defined
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      // not logged in → go to login and come back to /owner after login
      if (!data.session) {
        redirect('/login?next=/owner');
        return;
      }

      // (Optional) gate by role “owner”
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
      if (profile?.role !== 'owner') {
        redirect('/');
        return;
      }

      // Load initial owner stocks (safe select)
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select(
          'id, product_key, account_type, term_months, price, expires_at, quantity, notes'
        )
        .order('expires_at', { ascending: true });

      if (error) alert(error.message);
      if (!cancelled) {
        setRows(stocks ?? []);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  async function addOneStock(formData: FormData) {
    setLoading(true);
    const payload = {
      product_key: String(formData.get('product_key') || ''),
      account_type: String(formData.get('account_type') || 'shared'),
      term_months: Number(formData.get('term_months') || 1),
      price: Number(formData.get('price') || 0) || null,
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      profile: String(formData.get('profile') || ''),
      pin: String(formData.get('pin') || ''),
      quantity: Number(formData.get('quantity') || 1),
      notes: String(formData.get('notes') || ''),
    };

    const { error } = await supabase.rpc('add_stock_one', payload as any);
    if (error) alert(error.message);

    // refresh list
    const { data: stocks } = await supabase
      .from('stocks')
      .select(
        'id, product_key, account_type, term_months, price, expires_at, quantity, notes'
      )
      .order('expires_at', { ascending: true });

    setRows(stocks ?? []);
    setLoading(false);
  }

  // ✅ no stray brace here — keep return inside component
  return (
    <section className="grid gap-6 p-6">
      <div className="pills">
        <button className="btn" onClick={() => history.back()}>Back</button>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </div>

      <h1 className="h1">Owner Panel</h1>

      {/* Add Stock form */}
      <form
        className="card grid gap-3"
        action={(fd: FormData) => addOneStock(fd)}
      >
        <div className="grid2">
          <label className="field">
            <span>Product key</span>
            <input name="product_key" placeholder="e.g. netflix" required />
          </label>

          <label className="field">
            <span>Account type</span>
            <select name="account_type" defaultValue="shared">
              <option value="shared">Shared profile</option>
              <option value="solo">Solo</option>
            </select>
          </label>

          <label className="field">
            <span>Term</span>
            <select name="term_months" defaultValue="1">
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </label>

          <label className="field">
            <span>Price (optional)</span>
            <input name="price" type="number" min="0" step="0.01" />
          </label>

          <label className="field">
            <span>Email (optional)</span>
            <input name="email" />
          </label>

          <label className="field">
            <span>Password (optional)</span>
            <input name="password" />
          </label>

          <label className="field">
            <span>Profile (optional)</span>
            <input name="profile" />
          </label>

          <label className="field">
            <span>PIN (optional)</span>
            <input name="pin" />
          </label>

          <label className="field">
            <span>Quantity</span>
            <input name="quantity" type="number" min="1" defaultValue="1" />
          </label>

          <label className="field col-span-2">
            <span>Notes (optional)</span>
            <input name="notes" />
          </label>
        </div>

        <button className="btn primary">Add Stock</button>
      </form>

      {/* Current list */}
      <div className="card">
        <h2 className="h2">Your stocks</h2>
        {loading ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p>No stocks yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Term</th>
                <th>Price</th>
                <th>Expires</th>
                <th>Qty</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.product_key}</td>
                  <td>{r.account_type}</td>
                  <td>{r.term_months}m</td>
                  <td>{r.price ?? '-'}</td>
                  <td>{r.expires_at ?? '-'}</td>
                  <td>{r.quantity ?? 0}</td>
                  <td>{r.notes ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link className="link" href="/">← Back to Home</Link>
    </section>
  );
}