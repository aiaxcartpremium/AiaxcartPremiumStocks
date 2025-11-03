// app/owner/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchProductOptions, TERM_OPTIONS, ACCOUNT_TYPES, ProductOption } from '@/lib/productOptions';

export default function OwnerPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productKey, setProductKey] = useState('');
  const [accountType, setAccountType] = useState('shared_profile');
  const [termDays, setTermDays] = useState('30');

  // your other controlled states:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<number | ''>('');
  const [pin, setPin] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetchProductOptions().then(setProducts).catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    // group by category for nicer optgroup rendering
    const buckets: Record<string, { label: string; items: ProductOption[] }> = {};
    products.forEach(p => {
      const key = p.category_key;
      if (!buckets[key]) buckets[key] = { label: p.category_label, items: [] };
      buckets[key].items.push(p);
    });
    return buckets;
  }, [products]);

  async function addStock() {
    // calls your RPC that also computes expiry
    const payload = {
      product_key: productKey,
      account_type: accountType,
      term_days: Number(termDays),
      email: email || null,
      password: password || null,
      profile: profile === '' ? null : Number(profile),
      pin: pin === '' ? null : Number(pin),
      price: price === '' ? null : Number(price),
      qty: Number(quantity),
      notes: notes || null,
      tags: tags || null
    };

    const { data, error } = await supabase.rpc('owner_add_stock_many', { payload });
    if (error) {
      alert(error.message);
    } else {
      alert('Added!');
    }
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Owner Panel</h1>

      {/* Product select */}
      <label className="block text-sm mb-1">Product</label>
      <select
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        value={productKey}
        onChange={e => setProductKey(e.target.value)}
      >
        <option value="">Select product…</option>
        {Object.entries(grouped).map(([catKey, g]) => (
          <optgroup key={catKey} label={g.label}>
            {g.items.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Account type */}
      <label className="block text-sm mb-1">Type</label>
      <select
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        value={accountType}
        onChange={e => setAccountType(e.target.value)}
      >
        {ACCOUNT_TYPES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {/* Term */}
      <label className="block text-sm mb-1">Term</label>
      <select
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        value={termDays}
        onChange={e => setTermDays(e.target.value)}
      >
        {TERM_OPTIONS.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {/* keep your other inputs as-is (email/password/profile/pin/qty/price/notes/tags) ... */}

      <button
        onClick={addStock}
        className="mt-3 rounded px-3 py-2 text-sm bg-pink-200 hover:bg-pink-300 text-black"
      >
        Add Stock
      </button>
    </main>
  );
}