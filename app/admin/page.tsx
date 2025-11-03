'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  id: string;
  product_key: string;
  account_type: string;
  term: string;
  price: number|null;
  expires_at: string|null;
  qty: number;
};

export default function AdminPage(){
  const [rows,setRows] = useState<Row[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ window.location.href = '/login?next=/admin'; return; }
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id,product_key,account_type,term,price,expires_at,qty')
        .order('expires_at', { ascending: true });
      if(error){ alert(error.message); return; }
      setRows(stocks || []);
      setLoading(false);
    });
  },[]);

  async function getAccount(id:string){
    const { data, error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: id });
    if(error){ alert(error.message); return; }
    alert(`Email: ${data.email}\nPass: ${data.password}\nProfile: ${data.profile ?? ''}\nPIN: ${data.pin ?? ''}`);
  }

  return (
    <section className="card">
      <h1>Admin Panel</h1>
      {loading ? 'Loading…' : (
        rows.length === 0 ? 'No stocks yet' : (
          <div className="row" style={{gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr'}}>
            <div><b>Product</b></div>
            <div><b>Type</b></div>
            <div><b>Term</b></div>
            <div><b>Expires</b></div>
            <div><b>Action</b></div>
            {rows.map(r=>(
              <>
                <div>{r.product_key}</div>
                <div>{r.account_type}</div>
                <div>{r.term}</div>
                <div>{r.expires_at ?? '-'}</div>
                <div><button onClick={()=>getAccount(r.id)}>Get Account</button></div>
              </>
            ))}
          </div>
        )
      )}
      <div style={{marginTop:16}} className="center">
        <a className="pill ghost" href="/">← Back</a>
        <form action="/logout" method="post"><button className="pill">Logout / Switch</button></form>
      </div>
    </section>
  );
}