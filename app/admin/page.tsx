'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  product_key: string;
  account_type: string;
  term_months: number;
  expires_at?: string | null;
  price?: number | null;
  quantity?: number | null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        redirect('/login?next=/admin');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
      if (profile?.role !== 'admin') {
        redirect('/');
        return;
      }

      const { data: stocks, error } = await supabase
        .from('stocks')
        .select(
          'id, product_key, account_type, term_months, expires_at, price, quantity'
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

  return (
    <section className="grid gap-6 p-6">
      <div className="pills">
        <button className="btn" onClick={() => history.back()}>Back</button>
      </div>
      <h1 className="h1">Admin Panel</h1>
      {loading ? <p>Loading…</p> : (
        <pre className="card">{JSON.stringify(rows, null, 2)}</pre>
      )}
    </section>
  );
}