'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type InsertStock = {
  product_key: string;
  account_type: 'shared_profile'|'solo_profile'|'shared_account'|'solo_account';
  term_days: number;
  expires_on: string; // yyyy-mm-dd
  email?: string|null;
  password?: string|null;
  profile?: string|null;
  pin?: string|null;
  price?: number|null;
  quantity?: number|null;
  notes?: string|null;
  tags?: string[]|null;
};

const PRODUCT_CATALOG: { group: string; items: { key: string; label: string }[] }[] = [
  {
    group: 'entertainment',
    items: [
      { key: 'netflix', label: 'Netflix' },
      { key: 'viu', label: 'Viu' },
      { key: 'vivamax', label: 'Vivamax' },
      { key: 'vivaone', label: 'Viva One' },
      { key: 'vivabundle', label: 'Viva Bundle' },
      { key: 'disney_plus', label: 'Disney+' },
      { key: 'bilibili', label: 'Bilibili' },
      { key: 'iqiyi', label: 'iQIYI' },
      { key: 'wetv', label: 'WeTV' },
      { key: 'loklok', label: 'Loklok' },
      { key: 'iwanttfc', label: 'iWantTFC' },
      { key: 'amazon_prime', label: 'Amazon Prime' },
      { key: 'crunchyroll', label: 'Crunchyroll' },
      { key: 'hbo_max', label: 'HBO Max' },
      { key: 'youku', label: 'Youku' },
      { key: 'nba_league_pass', label: 'NBA League Pass' },
    ],
  },
  {
    group: 'streaming',
    items: [
      { key: 'spotify', label: 'Spotify' },
      { key: 'youtube', label: 'YouTube' },
      { key: 'apple_music', label: 'Apple Music' },
    ],
  },
  {
    group: 'educational',
    items: [
      { key: 'studocu', label: 'Studocu' },
      { key: 'scribd', label: 'Scribd' },
      { key: 'grammarly', label: 'Grammarly' },
      { key: 'quillbot', label: 'QuillBot' },
      { key: 'ms365', label: 'Microsoft 365' },
      { key: 'quizlet_plus', label: 'Quizlet+' },
      { key: 'camscanner', label: 'CamScanner' },
      { key: 'smallpdf', label: 'Smallpdf' },
      { key: 'turnitin_student', label: 'Turnitin Student' },
      { key: 'turnitin_instructor', label: 'Turnitin Instructor' },
      { key: 'duolingo_super', label: 'Duolingo Super' },
    ],
  },
  {
    group: 'editing',
    items: [
      { key: 'canva', label: 'Canva' },
      { key: 'picsart', label: 'Picsart' },
      { key: 'capcut', label: 'CapCut' },
      { key: 'remini_web', label: 'Remini Web' },
      { key: 'alight_motion', label: 'Alight Motion' },
    ],
  },
  {
    group: 'ai',
    items: [
      { key: 'chatgpt', label: 'ChatGPT' },
      { key: 'gemini_ai', label: 'Gemini AI' },
      { key: 'blackbox_ai', label: 'Blackbox AI' },
      { key: 'perplexity', label: 'Perplexity' },
    ],
  },
];

const ACCOUNT_TYPES = [
  { value: 'shared_profile', label: 'Shared profile' },
  { value: 'solo_profile', label: 'Solo profile' },
  { value: 'shared_account', label: 'Shared account' },
  { value: 'solo_account', label: 'Solo account' },
] as const;

const TERM_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '1 month' },
  { value: 60, label: '2 months' },
  { value: 90, label: '3 months' },
  { value: 120, label: '4 months' },
  { value: 150, label: '5 months' },
  { value: 180, label: '6 months' },
  { value: 210, label: '7 months' },
  { value: 240, label: '8 months' },
  { value: 270, label: '9 months' },
  { value: 300, label: '10 months' },
  { value: 330, label: '11 months' },
  { value: 360, label: '12 months' },
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function toYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function OwnerPage() {
  // form state
  const [product, setProduct] = useState('');
  const [type, setType] = useState<typeof ACCOUNT_TYPES[number]['value']>('shared_profile');
  const [termDays, setTermDays] = useState<number>(30);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');
  const [pin, setPin] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('1');
  const [notes, setNotes] = useState('');

  const expiresOn = useMemo(
    () => toYMD(addDays(new Date(), termDays)),
    [termDays]
  );

  async function addStock() {
    if (!product) return alert('Pick a product');

    const payload: InsertStock = {
      product_key: product,
      account_type: type,
      term_days: termDays,
      expires_on: expiresOn,
      email: email || null,
      password: password || null,
      profile: profile || null,
      pin: pin || null,
      price: price === '' ? null : Number(price),
      quantity: qty === '' ? null : Number(qty),
      notes: notes || null,
      tags: null,
    };

    const { error } = await supabase.from('stocks').insert(payload);
    if (error) return alert(error.message);
    alert('Stock added');

    // reset minimal
    setEmail(''); setPassword(''); setProfile(''); setPin('');
    setPrice(''); setQty('1'); setNotes('');
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Owner Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/60 rounded-lg p-4 border">
        {/* Product */}
        <div>
          <label className="block text-sm mb-1">Product</label>
          <select className="border rounded px-2 py-1 w-full"
                  value={product}
                  onChange={(e)=>setProduct(e.target.value)}>
            <option value="">Select product</option>
            {PRODUCT_CATALOG.map(group => (
              <optgroup key={group.group} label={group.group}>
                {group.items.map(it => (
                  <option key={it.key} value={it.key}>{it.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Account type */}
        <div>
          <label className="block text-sm mb-1">Account type</label>
          <select className="border rounded px-2 py-1 w-full"
                  value={type}
                  onChange={(e)=>setType(e.target.value as any)}>
            {ACCOUNT_TYPES.map(a=>(
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm mb-1">Term</label>
          <select className="border rounded px-2 py-1 w-full"
                  value={termDays}
                  onChange={(e)=>setTermDays(Number(e.target.value))}>
            {TERM_OPTIONS.map(t=>(
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <p className="text-xs mt-1">Expires on: <b>{expiresOn}</b></p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-1">Price (optional)</label>
          <input className="border rounded px-2 py-1 w-full" type="number"
                 value={price} onChange={(e)=>setPrice(e.target.value)} />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email (optional)</label>
          <input className="border rounded px-2 py-1 w-full" value={email}
                 onChange={(e)=>setEmail(e.target.value)} />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password (optional)</label>
          <input className="border rounded px-2 py-1 w-full" value={password}
                 onChange={(e)=>setPassword(e.target.value)} />
        </div>

        {/* Profile */}
        <div>
          <label className="block text-sm mb-1">Profile (optional)</label>
          <input className="border rounded px-2 py-1 w-full" value={profile}
                 onChange={(e)=>setProfile(e.target.value)} />
        </div>

        {/* PIN */}
        <div>
          <label className="block text-sm mb-1">PIN (optional)</label>
          <input className="border rounded px-2 py-1 w-full" value={pin}
                 onChange={(e)=>setPin(e.target.value)} />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm mb-1">Quantity (optional)</label>
          <input className="border rounded px-2 py-1 w-full" type="number" min={1}
                 value={qty} onChange={(e)=>setQty(e.target.value)} />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Notes (optional)</label>
          <input className="border rounded px-2 py-1 w-full"
                 value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={addStock}
            className="rounded px-3 py-2 bg-pink-200 hover:bg-pink-300">
            Add Stock
          </button>
        </div>
      </div>
    </main>
  );
}