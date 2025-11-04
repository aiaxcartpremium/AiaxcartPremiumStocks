'use client';
import { useEffect, useState } from 'react';
import { sbBrowser } from '@/lib/supabaseClient';

type Stock = { id:string; product_key:string; account_type:string; expires_at:string|null };
type RecordRow = {
  id:number;
  account_id:string;
  product_key:string;
  account_type:string|null;
  buyer_handle:string|null;
  source:string|null;
  sold_price:number|null;
  add_days:number|null;
  new_expires_at:string|null;
  sold_by:string|null;
  created_at:string;
};

export default function AdminRecordsPage(){
  const supabase = sbBrowser();

  const [stocks,setStocks]=useState<Stock[]>([]);
  const [records,setRecords]=useState<RecordRow[]>([]);
  const [loading,setLoading]=useState(true);

  const [stockId,setStockId]=useState<string>('');
  const [buyer,setBuyer]=useState('');
  const [source,setSource]=useState<'tg'|'fb'|'ig'|'tiktok'|'other'|''>('');
  const [price,setPrice]=useState('');
  const [addDays,setAddDays]=useState('0');

  useEffect(()=>{
    let cancel=false;
    (async()=>{
      const { data:session } = await supabase.auth.getSession();
      if(!session.session){ window.location.href = '/login?next=/admin/records'; return; }
      const { data: s } = await supabase.from('stocks').select('id,product_key,account_type,expires_at').order('product_key');
      const { data: r } = await supabase.from('account_records').select('*').order('created_at',{ascending:false}).limit(100);
      if(!cancel){
        setStocks(s ?? []);
        setRecords(r ?? []);
        setLoading(false);
      }
    })();
    return ()=>{ cancel=true; };
  },[]);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!stockId){ alert('Pick a stock'); return; }
    try{
      const { data, error } = await supabase.rpc('record_sale_update_expiry', {
        p_stock_id: stockId,
        p_buyer: buyer || null,
        p_source: source || null,
        p_sold_price: price? Number(price): null,
        p_add_days: addDays? Number(addDays): 0
      });
      if(error) throw error;
      alert('Recorded. New expiry: ' + (data?.new_expires_at ?? ''));
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
        <a className="btn" href="/admin">← Back to Admin</a>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </div>

      <div className="card grid">
        <h1 style={{marginTop:0}}>Buyer Records</h1>
        <form onSubmit={submit} className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label>Stock
            <select className="input" value={stockId} onChange={e=>setStockId(e.target.value)} required>
              <option value="">— choose —</option>
              {stocks.map(s=> (
                <option key={s.id} value={s.id}>
                  {s.product_key} · {s.account_type ?? '-'} · exp {s.expires_at?.slice(0,10) ?? '-'}
                </option>
              ))}
            </select>
          </label>
          <label>Buyer handle (optional)
            <input className="input" value={buyer} onChange={e=>setBuyer(e.target.value)} placeholder="@username or name"/>
          </label>
          <label>Source
            <select className="input" value={source} onChange={e=>setSource(e.target.value as any)}>
              <option value="">—</option>
              <option value="tg">Telegram</option>
              <option value="fb">Facebook</option>
              <option value="ig">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>Sold price (₱)
            <input className="input" value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 75"/>
          </label>
          <label>Additional days
            <input className="input" type="number" value={addDays} onChange={e=>setAddDays(e.target.value)} min={0}/>
          </label>
          <div />
          <button className="btn primary">Save record</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{marginTop:0}}>Recent</h2>
        {loading? 'Loading...' : (
          <table className="table">
            <thead><tr>
              <th>Date</th><th>Product</th><th>Type</th><th>Buyer</th><th>Source</th><th>Price</th><th>+Days</th><th>New Expiry</th><th>Sold by</th>
            </tr></thead>
            <tbody>
            {records.length===0 && <tr><td colSpan={9}>No records</td></tr>}
            {records.map(r=>(
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.product_key}</td>
                <td>{r.account_type ?? '-'}</td>
                <td>{r.buyer_handle ?? '-'}</td>
                <td>{r.source ?? '-'}</td>
                <td>{r.sold_price ?? '-'}</td>
                <td>{r.add_days ?? 0}</td>
                <td>{r.new_expires_at?.slice(0,10) ?? '-'}</td>
                <td>{r.sold_by ?? '-'}</td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
