'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TERMS, ACCOUNT_TYPES } from '@/lib/catalog';

type Option = { value:string; label:string };

export default function OwnerPage(){
  const [authed,setAuthed]=useState(false);
  const [products,setProducts]=useState<Option[]>([]);
  const [product,setProduct]=useState('');
  const [acct,setAcct]=useState(ACCOUNT_TYPES[0].value);
  const [term,setTerm]=useState('1m');
  const [price,setPrice]=useState<number|''>('');
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [profile,setProfile]=useState(''); const [pin,setPin]=useState('');
  const [qty,setQty]=useState(1); const [notes,setNotes]=useState('');

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ window.location.href='/login?next=/owner'; return; }
      setAuthed(true);
      const { data: items, error } = await supabase
        .from('products')
        .select('key,label')
        .order('label',{ascending:true});
      if(error){ alert(error.message); return; }
      setProducts((items||[]).map(r=>({ value:r.key, label:r.label })));
    });
  },[]);

  async function addStock(){
    if(!product){ alert('Pick a product'); return; }
    const { error } = await supabase.rpc('add_stock_one',{
      p_product_key: product,
      p_account_type: acct,
      p_term: term,
      p_price: price===''?null:Number(price),
      p_email: email || null, p_password: password||null,
      p_profile: profile||null, p_pin: pin||null,
      p_qty: qty, p_notes: notes||null
    });
    if(error){ alert(error.message); return; }
    alert('Stock added ✔');
  }

  if(!authed) return null;

  return (
    <section className="card">
      <h1>Owner Panel</h1>

      <label>Product</label>
      <select value={product} onChange={e=>setProduct(e.target.value)}>
        <option value="">Select product</option>
        {products.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      <label>Account type</label>
      <select value={acct} onChange={e=>setAcct(e.target.value)}>
        {ACCOUNT_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <label>Term</label>
      <select value={term} onChange={e=>setTerm(e.target.value)}>
        {TERMS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <div className="row" style={{marginTop:10}}>
        <div>
          <label>Price (optional)</label>
          <input value={price} onChange={e=>setPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 99" />
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))}/>
        </div>
      </div>

      <div className="row">
        <div>
          <label>Email (optional)</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password (optional)</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div>
          <label>Profile (optional)</label>
          <input value={profile} onChange={e=>setProfile(e.target.value)} />
        </div>
        <div>
          <label>PIN (optional)</label>
          <input value={pin} onChange={e=>setPin(e.target.value)} />
        </div>
      </div>

      <label>Notes (optional)</label>
      <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} />

      <div className="center" style={{marginTop:12}}>
        <button onClick={addStock}>Add Stock</button>
        <a className="pill ghost" href="/">← Back</a>
        <form action="/logout" method="post"><button className="pill">Logout / Switch</button></form>
      </div>
    </section>
  );
}