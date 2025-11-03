'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Row = {
  id: string;
  product_key: string;
  account_type: string;
  term_months: number;
  price?: number|null;
  expires_at?: string|null;
  qty?: number|null;
};

export default function AdminPage(){
  const [rows,setRows]=useState<Row[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const { data: session } = await supabase.auth.getSession();
      if(!session?.session){ window.location.href='/login?next=/admin'; return; }
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id,product_key,account_type,term_months,price,expires_at,qty')
        .order('created_at', { ascending:false })
        .limit(50);
      if(error) alert(error.message);
      if(!cancelled){ setRows(stocks ?? []); setLoading(false); }
    })();
    return ()=>{cancelled=true};
  },[]);

  async function getAccount(id:string){
    // Here you’d call your RPC (e.g., admin_grant_and_decrement)
    alert('Get Account clicked for '+id+' (wire your RPC here)');
  }

  return (
    <div className="card">
      <h1>Admin Panel</h1>
      <div className="actions">
        <a className="btn ghost pill" href="/">Back</a>
        <a className="btn ghost pill" href="/login">Logout / Switch</a>
      </div>
      <hr/>
      {loading ? 'Loading…' :
        rows.length===0 ? 'No stocks yet' :
        <div className="grid">
          <div className="row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 120px', fontWeight:800}}>
            <div>Product</div><div>Type</div><div>Term</div><div>Price</div><div>Expires</div><div>Actions</div>
          </div>
          {rows.map(r=>(
            <div key={r.id} className="row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 120px'}}>
              <div>{r.product_key}</div>
              <div>{r.account_type}</div>
              <div>{r.term_months} mo</div>
              <div>{r.price ?? '—'}</div>
              <div>{r.expires_at ?? '—'}</div>
              <div><button className="btn pill" onClick={()=>getAccount(r.id)}>Get Account</button></div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}