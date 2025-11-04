'use client';
import { useEffect, useState } from 'react';
import { sbBrowser } from '@/lib/supabaseClient';

type Row = {
  id:string;
  product_key:string;
  account_type:string;
  email:string|null;
  password:string|null;
  profile:string|null;
  pin:string|null;
  expires_at:string|null;
};

export default function AdminPage(){
  const supabase = sbBrowser();
  const [rows,setRows]=useState<Row[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const { data:session } = await supabase.auth.getSession();
      if(!session.session){ window.location.href = '/login?next=/admin'; return; }
      const { data, error } = await supabase.from('stocks')
        .select('id,product_key,account_type,email,password,profile,pin,expires_at')
        .gt('qty',0)
        .order('expires_at', { ascending: true });
      if(error){ alert(error.message); }
      if(!cancelled){
        setRows(data ?? []);
        setLoading(false);
      }
    })();
    return ()=>{ cancelled=true; };
  },[]);

  async function getAccount(id:string){
    try{
      const { data, error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: id });
      if(error) throw error;
      alert(`Granted:\nEmail: ${data?.email}\nPass: ${data?.password}\nProfile: ${data?.profile ?? ''}\nPIN: ${data?.pin ?? ''}`);
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
        <a className="btn" href="/">← Back</a>
        <a className="btn" href="/admin/records">Buyer Records</a>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </div>
      <div className="card">
        <h1 style={{marginTop:0}}>Admin Panel</h1>
        {loading? 'Loading...' : (
          <table className="table">
            <thead><tr><th>Product</th><th>Type</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {rows.length===0 && <tr><td colSpan={4}>No available stocks</td></tr>}
              {rows.map(r=> <tr key={r.id}>
                <td>{r.product_key}</td>
                <td>{r.account_type}</td>
                <td>{r.expires_at?.slice(0,10)}</td>
                <td><button className="btn primary" onClick={()=>getAccount(r.id)}>Get Account</button></td>
              </tr>)}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
