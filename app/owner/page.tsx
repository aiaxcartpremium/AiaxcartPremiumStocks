'use client';
import { useEffect, useMemo, useState } from 'react';
import { sbBrowser } from '@/lib/supabaseClient';
import { CATALOG, TERMS } from '@/lib/catalog';

type Row = {
  id:string;
  product_key:string;
  account_type:string;
  term:string;
  price:number|null;
  expires_at:string;
  qty:number;
};

export default function OwnerPage(){
  const supabase = sbBrowser();
  const [rows,setRows]=useState<Row[]>([]);
  const [loading,setLoading]=useState(true);
  const [product_key,setProductKey]=useState(CATALOG[0].key);
  const [account_type,setAccountType]=useState<'shared'|'solo'>('shared');
  const [term,setTerm]=useState(TERMS[0].key);
  const [price,setPrice]=useState<string>('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [profile,setProfile]=useState('');
  const [pin,setPin]=useState('');
  const [qty,setQty]=useState(1);
  const [notes,setNotes]=useState('');

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const { data:sessionData } = await supabase.auth.getSession();
      if(!sessionData.session){ window.location.href = '/login?next=/owner'; return; }
      const { data: stocks, error } = await supabase.from('stocks')
        .select('id,product_key,account_type,term,price,expires_at,qty')
        .order('expires_at', { ascending: true });
      if(error){ alert(error.message); }
      if(!cancelled){
        setRows(stocks ?? []);
        setLoading(false);
      }
    })();
    return ()=>{ cancelled=true; };
  },[]);

  const expiresText = useMemo(()=>{
    const months = TERMS.find(t=>t.key===term)?.months ?? 1;
    const d = new Date(); d.setMonth(d.getMonth()+months);
    return d.toISOString().slice(0,10);
  },[term]);

  async function addStock(){
    try{
      const payload = {
        product_key, account_type, term,
        price: price? Number(price): null,
        email, password, profile, pin, qty, notes
      };
      const { error } = await supabase.rpc('add_stock_one', payload);
      if(error) throw error;
      alert('Stock added');
      window.location.reload();
    }catch(e:any){ alert(e.message); }
  }

  async function logout(){
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <section className="grid">
      <div className="pills">
        <button className="btn" onClick={()=>history.back()}>Back</button>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </div>

      <div className="card grid">
        <h1 style={{margin:0}}>Owner Panel</h1>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label>Product<select className="input" value={product_key} onChange={e=>setProductKey(e.target.value)}>
            {CATALOG.map(p=> <option key={p.key} value={p.key}>{p.name}</option>)}
          </select></label>
          <label>Account type<select className="input" value={account_type} onChange={e=>setAccountType(e.target.value as any)}>
            <option value="shared">Shared profile</option>
            <option value="solo">Solo</option>
          </select></label>
          <label>Term<select className="input" value={term} onChange={e=>setTerm(e.target.value)}>
            {TERMS.map(t=> <option key={t.key} value={t.key}>{t.label}</option>)}
          </select></label>
          <div>Expires on: <span className="badge">{expiresText}</span></div>
          <label>Price (optional)<input className="input" value={price} onChange={e=>setPrice(e.target.value)} /></label>
          <label>Email (optional)<input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password (optional)<input className="input" type="text" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          <label>Profile (optional)<input className="input" value={profile} onChange={e=>setProfile(e.target.value)} /></label>
          <label>PIN (optional)<input className="input" value={pin} onChange={e=>setPin(e.target.value)} /></label>
          <label>Quantity (optional)<input className="input" type="number" value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))} /></label>
          <label style={{gridColumn:'1 / span 2'}}>Notes (optional)<input className="input" value={notes} onChange={e=>setNotes(e.target.value)} /></label>
        </div>
        <button className="btn primary" onClick={addStock}>Add Stock</button>
      </div>

      <div className="card">
        <h2 style={{marginTop:0}}>On-hand</h2>
        {loading? 'Loading...' : (
          <table className="table">
            <thead><tr><th>Product</th><th>Type</th><th>Term</th><th>Price</th><th>Expires</th><th>Qty</th></tr></thead>
            <tbody>
              {rows.length===0 and <tr><td colSpan={6}>No stocks yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
