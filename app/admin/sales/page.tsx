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
  const [extraDays, setExtraDays] = useState<string>('0'); // NEW

  useEffect(() => {
    supabase.from('stocks')
      .select('id,product_key,term_days,expires_on')
      .order('product_key', { ascending: true })
      .then(({ data }) => setStocks((data as any[]) ?? []));
  }, []);

  async function submit() {
    const s = stocks.find(x => x.id === stockId);
    if (!s) return alert('Pick a stock');

    // --- choose ONE path ---
    // (A) If you kept the original record_sale (no extra days):
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
    const saleId: string = data as string;

    // extend after insert if extraDays > 0
    const addDays = Number(extraDays || '0');
    if (addDays > 0) {
      const { data: newExp, error: e2 } = await supabase.rpc('extend_sale_expiry', {
        p_sale_id: saleId,
        p_extra_days: addDays
      });
      if (e2) return alert(e2.message);
      alert(`Sale recorded. New expiry: ${newExp}`);
    } else {
      alert('Sale recorded.');
    }

    // (B) If you replaced record_sale with the new version that has p_extra_days param:
    // await supabase.rpc('record_sale', { ..., p_extra_days: Number(extraDays || '0') });

    // reset
    setStockId(''); setPrice(''); setBuyerName(''); setBuyerContact(''); setExtraDays('0');
  }

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Record Sale</h1>

      {/* Stock select ... (same as before) */}

      <label className="block text-sm mb-1">Channel</label>
      {/* ... same channel select ... */}

      <label className="block text-sm mb-1">Sold price</label>
      {/* ... same price input ... */}

      {/* NEW: Additional days */}
      <label className="block text-sm mb-1">Additional days (optional)</label>
      <input
        className="border rounded px-2 py-1 text-sm w-full mb-3"
        type="number"
        min={0}
        value={extraDays}
        onChange={(e) => setExtraDays(e.target.value)}
        placeholder="e.g. 7"
      />

      {/* Buyer name/contact ... */}

      <button
        onClick={submit}
        className="rounded px-3 py-2 bg-pink-200 hover:bg-pink-300"
      >
        Save
      </button>
    </main>
  );
}