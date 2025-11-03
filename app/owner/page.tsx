'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ACCOUNT_TYPES = ['shared profile','solo profile','shared account','solo account'] as const;
const TERMS = ['7d','14d','1 month','2 months','3 months','4 months','5 months','6 months','7 months','8 months','9 months','10 months','11 months','12 months'] as const;

export default function OwnerPage(){
  const [authed, setAuthed] = useState(false);
  const [product, setProduct] = useState('');
  const [accountType, setAccountType] = useState<typeof ACCOUNT_TYPES[number]>('shared profile');
  const [term, setTerm] = useState<typeof TERMS[number]>('1 month');
  const [price, setPrice] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');
  const [pin, setPin] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [notes, setNotes] = useState('');

  useEffect(()=>{
    supabase.auth.getSession().then(({ data })=>{
      if(!data.session){ window.location.href='/login?next=/owner'; return; }
      setAuthed(true);
    });
  },[]);

  const canSubmit = useMemo(()=> authed && product && qty>0, [authed, product, qty]);

  async function addStock(){
    const payload = {
      product, account_type: accountType, term,
      price: price === '' ? null : Number(price),
      email, password, profile, pin, qty, notes
    };

    // If you created an RPC add_stock_one, call it here:
    // const { error } = await supabase.rpc('add_stock_one', { p: payload });
    const { error } = await supabase.from('stocks').insert(payload);
    if(error) return alert(error.message);
    alert('Stock added!');
  }

  return (
    <div className="card">
      <h1 className="h1">Owner Panel</h1>

      <div className="row">
        <select value={product} onChange={e=>setProduct(e.target.value)} className="input">
          <option value="">Select product</option>
          <option>Netflix</option><option>Disney+</option><option>Spotify</option>
          {/* (Populate via table/view later) */}
        </select>

        <select value={accountType} onChange={e=>setAccountType(e.target.value as any)} className="input">
          {ACCOUNT_TYPES.map(t=><option key={t}>{t}</option>)}
        </select>

        <select value={term} onChange={e=>setTerm(e.target.value as any)} className="input">
          {TERMS.map(t=><option key={t}>{t}</option>)}
        </select>

        <div className="row">
          <input className="input" placeholder="Price (optional)" value={price} onChange={e=>setPrice(e.target.value === '' ? '' : Number(e.target.value))}/>
          <input className="input" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input className="input" placeholder="Password (optional)" value={password} onChange={e=>setPassword(e.target.value)}/>
          <input className="input" placeholder="Profile (optional)" value={profile} onChange={e=>setProfile(e.target.value)}/>
          <input className="input" placeholder="PIN (optional)" value={pin} onChange={e=>setPin(e.target.value)}/>
          <input className="input" placeholder="Quantity" value={qty} onChange={e=>setQty(Number(e.target.value)||1)}/>
          <input className="input" placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>

        <div className="actions">
          <button className="btn" onClick={addStock} disabled={!canSubmit}>Add Stock</button>
          <a className="back" href="/">← Back</a>
        </div>
      </div>
    </div>
  );
}