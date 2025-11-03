'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type StockLite = { id: string; product_key: string; term_days: number | null; expires_on: string | null };

export default function SalesPage() {
  const [stocks, setStocks] = useState<StockLite[]>([]);
  const [stockId, setStockId] = useState('');
  const [channel, setChannel] = useState('tg');
  const [price, setPrice] = useState<string>('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');

  useEffect(() => {
    supabase.from('stocks')
      .select('id,product_key,term_days,expires_on')
      .order('product_key', { ascending: true })
      .then(({ data }) => setStocks((data as any[]) ?? []));
  }, []);

  async function submit() {
    const s = stocks.find(x => x.id === stockId);
    if (!s) return alert('Pick a stock');

    const { data, error } = await supabase.rpc('record_sale', {
      p_stock_id: s.id,
      p_product_key: s.product_key,
      p_term_days: s.term_days ?? 0,
      p_expires_on: s.expires_on,
      p_channel: channel,
      p_sold_price: price === '' ? null : Number(price),
      p_buyer_name: buyerName || null,
      p_buyer_contact: buyerContact || null
    });

    if (error) return alert(error.message);
    alert('Sale recorded: ' + data);
    setStockId('');
    setPrice('');
    setBuyerName('');
    setBuyerContact('');
  }

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Record Sale</h1>

      <label className="block text-sm mb-1">Stock</label>
      <select
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        value={stockId}
        onChange={e => setStockId(e.target.value)}
      >
        <option value="">Select…</option>
        {stocks.map(s => (
          <option key={s.id} value={s.id}>
            {s.product_key} • term: {s.term_days ?? '-'}d • exp: {s.expires_on ?? '-'}
          </option>
        ))}
      </select>

      <label className="block text-sm mb-1">Channel</label>
      <select
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        value={channel}
        onChange={e => setChannel(e.target.value)}
      >
        <option value="tg">Telegram</option>
        <option value="fb">Facebook</option>
        <option value="ig">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="other">Other</option>
      </select>

      <label className="block text-sm mb-1">Sold price</label>
      <input
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        type="number"
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="e.g. 99"
      />

      <label className="block text-sm mb-1">Buyer name (optional)</label>
      <input className="border rounded px-2 py-1 text-sm w-full mb-3"
             value={buyerName} onChange={e=>setBuyerName(e.target.value)} />

      <label className="block text-sm mb-1">Buyer contact (optional)</label>
      <input className="border rounded px-2 py-1 text-sm w-full mb-3"
             value={buyerContact} onChange={e=>setBuyerContact(e.target.value)} />

      <button
        onClick={submit}
        className="rounded px-3 py-2 bg-pink-200 hover:bg-pink-300"
      >
        Save
      </button>
    </main>
  );
}