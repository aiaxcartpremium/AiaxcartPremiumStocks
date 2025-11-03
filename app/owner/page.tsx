'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CATALOG } from '../../lib/catalog';

type StockRow = {
  id: string;
  product_key: string;
  account_type: 'shared_profile'|'solo_profile'|'shared_account'|'solo_account';
  term_months: number;
  price?: number|null;
  email?: string|null;
  password?: string|null;
  profile?: string|null;
  pin?: string|null;
  qty?: number|null;
  notes?: string|null;
  expires_at?: string|null;
};

export default function OwnerPage(){
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading,setLoading] = useState(false);

  // form state
  const [product,setProduct] = useState(CATALOG[0].key);
  const [acctType,setAcctType] = useState<StockRow['account_type']>('shared_profile');
  const [term,setTerm] = useState(1);
  const [price,setPrice] = useState<number|''>('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [profile,setProfile] = useState('');
  const [pin,setPin] = useState('');
  const [qty,setQty] = useState<number|''>(1);
  const [notes,setNotes] = useState('');

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if(!session?.session){ window.location.href='/login?next=/owner'; return; }
      // (optional) load latest stocks to show below
      const { data: stocks, error } = await supabase.from('stocks').select('*').order('created_at', { ascending:false }).limit(10);
      if(error) alert(error.message);
      if(!cancelled){
        setRows(stocks ?? []);
        setLoading(false);
      }
    })();
    return ()=>{cancelled=true};
  },[]);

  async function addStock(){
    const { data: session } = await supabase.auth.getSession();
    if(!session?.session){ window.location.href='/login?next=/owner'; return; }

    const { error } = await supabase.from('stocks').insert({
      product_key: product,
      account_type: acctType,
      term_months: term,
      price: price === '' ? null : Number(price),
      email: email || null,
      password: password || null,
      profile: profile || null,
      pin: pin || null,
      qty: qty === '' ? null : Number(qty),
      notes: notes || null
    });
    if(error) return alert(error.message);
    alert('Stock added');
    window.location.reload();
  }

  return (
    <div className="card grid">
      <h1>Owner Panel</h1>
      <div className="row"><label>Product</label>
        <select value={product} onChange={e=>setProduct(e.target.value)}>
          {CATALOG.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
      </div>
      <div className="row"><label>Account type</label>
        <select value={acctType} onChange={e=>setAcctType(e.target.value as any)}>
          <option value="shared_profile">Shared profile</option>
          <option value="solo_profile">Solo profile</option>
          <option value="shared_account">Shared account</option>
          <option value="solo_account">Solo account</option>
        </select>
      </div>
      <div className="row"><label>Term</label>
        <select value={term} onChange={e=>setTerm(Number(e.target.value))}>
          <option value={1}>1 month</option>
          <option value={3}>3 months</option>
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
        </select>
      </div>
      <div className="row"><label>Price (optional)</label>
        <input value={price} onChange={e=>setPrice(e.target.value===''? '' : Number(e.target.value))} placeholder="e.g. 199"/>
      </div>
      <div className="row"><label>Email (optional)</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div className="row"><label>Password (optional)</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div className="row"><label>Profile (optional)</label>
        <input value={profile} onChange={e=>setProfile(e.target.value)} />
      </div>
      <div className="row"><label>PIN (optional)</label>
        <input value={pin} onChange={e=>setPin(e.target.value)} />
      </div>
      <div className="row"><label>Quantity (optional)</label>
        <input value={qty} onChange={e=>setQty(e.target.value===''? '' : Number(e.target.value))} />
      </div>
      <div className="row"><label>Notes (optional)</label>
        <input value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>
      <div className="actions">
        <button className="btn pill" onClick={addStock}>Add Stock</button>
        <a className="btn ghost pill" href="/">Back</a>
        <a className="btn ghost pill" href="/login">Logout / Switch</a>
      </div>
      <hr/>
      <h2>Recent</h2>
      {loading ? <div>Loading…</div> : rows.length===0 ? <div>No stocks yet</div> :
        rows.map(r=>(
          <div key={r.id} className="row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <div>{r.product_key}</div>
            <div>{r.account_type}</div>
            <div>{r.term_months} mo</div>
            <div>{r.expires_at??'—'}</div>
          </div>
        ))
      }
    </div>
  );
}