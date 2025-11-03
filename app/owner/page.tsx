// app/owner/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type ProductOption = { value: string; label: string; category: string; };

const ACCOUNT_TYPES = [
  { value: 'shared_profile', label: 'Shared profile' },
  { value: 'solo_profile',   label: 'Solo profile' },
  { value: 'shared_account', label: 'Shared account' },
  { value: 'solo_account',   label: 'Solo account' },
];

const TERM_CODES = [
  '7d','14d','1m','2m','3m','4m','5m','6m','7m','8m','9m','10m','11m','12m'
];

const TERM_TO_DAYS: Record<string, number> = {
  '7d':7, '14d':14,
  '1m':30, '2m':60, '3m':90, '4m':120, '5m':150, '6m':180,
  '7m':210, '8m':240, '9m':270, '10m':300, '11m':330, '12m':360
};

export default function OwnerPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productKey, setProductKey] = useState('');
  const [accountType, setAccountType] = useState('shared_profile');
  const [termCode, setTermCode] = useState('1m');
  const [price, setPrice] = useState<string>('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [profile, setProfile] = useState('');
  const [pin, setPin] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Load product options from Supabase view
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('v_product_catalog')
        .select('key,label,category,category_label')
        .order('category_label', { ascending: true })
        .order('label', { ascending: true });

      if (error) { alert(error.message); return; }
      setProducts((data ?? []).map(r => ({ value: r.key, label: r.label, category: r.category })));
    })();
  }, []);

  const expiresText = useMemo(() => {
    const days = TERM_TO_DAYS[termCode] ?? 30;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0,10);
  }, [termCode]);

  async function addStock() {
    if (!productKey) return alert('Select a product');
    const payload = {
      p_product_key: productKey,
      p_account_type: accountType,
      p_term_code: termCode,
      p_qty: qty,
      p_price: price ? Number(price) : null,
      p_email: email || null,
      p_pass: pass || null,
      p_profile: profile || null,
      p_pin: pin || null,
      p_notes: notes || null,
    };

    const { error } = await supabase.rpc('add_stock_many', payload as any);
    if (error) return alert(error.message);
    alert('Stock added ✅');
    // reset minimal
    setQty(1); setNotes('');
  }

  return (
    <main className="container">
      <h1 className="title">Owner Panel</h1>

      <label>Product</label>
      <select value={productKey} onChange={e=>setProductKey(e.target.value)}>
        <option value="">Select product</option>
        {products.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <label>Account type</label>
      <select value={accountType} onChange={e=>setAccountType(e.target.value)}>
        {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <label>Term</label>
      <select value={termCode} onChange={e=>setTermCode(e.target.value)}>
        {TERM_CODES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <p><strong>Expires on:</strong> {expiresText}</p>

      <label>Price (optional)</label>
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 99" />

      <label>Email (optional)</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} />

      <label>Password (optional)</label>
      <input value={pass} onChange={e=>setPass(e.target.value)} />

      <label>Profile (optional)</label>
      <input value={profile} onChange={e=>setProfile(e.target.value)} />

      <label>PIN (optional)</label>
      <input value={pin} onChange={e=>setPin(e.target.value)} />

      <label>Quantity (optional)</label>
      <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value || 1))} />

      <label>Notes (optional)</label>
      <input value={notes} onChange={e=>setNotes(e.target.value)} />

      <button onClick={addStock}>Add Stock</button>
    </main>
  );
}