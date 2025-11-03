'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Row={id:string,product_key:string,account_type:string,term_days:number,price:number|null,expires_at:string|null,quantity:number}

export default function AdminPage(){
  const [rows,setRows]=useState<Row[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ location.href='/login?next=/admin'; return }
      const { data: stocks, error } = await supabase.from('stocks').select('id,product_key,account_type,term_days,price,expires_at,quantity').order('expires_at',{ascending:true})
      if(error){ alert(error.message) }
      setRows(stocks||[]); setLoading(false)
    })
  },[])

  async function getAccount(id:string){
    try{
      const { data, error } = await supabase.rpc('admin_grant_and_decrement', { stock_id:id })
      if(error) throw error
      alert(`Credentials:\nEmail: ${data?.email||'-'}\nPassword: ${data?.password||'-'}\nProfile: ${data?.profile||'-'}\nPIN: ${data?.pin||'-'}`)
      const { data: stocks } = await supabase.from('stocks').select('id,product_key,account_type,term_days,price,expires_at,quantity').order('expires_at',{ascending:true})
      setRows(stocks||[])
    }catch(e:any){ alert(e.message) }
  }

  return (<section className="card">
    <h1>Admin Panel</h1>
    {loading ? <p>Loading...</p> : rows.length===0 ? <p>No stocks yet</p> : (
      <table><thead><tr><th>Product</th><th>Type</th><th>Term</th><th>Price</th><th>Expires</th><th>Qty</th><th></th></tr></thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.id}>
            <td>{r.product_key}</td><td>{r.account_type.replace('_',' ')}</td><td>{r.term_days}d</td>
            <td>{r.price ?? '-'}</td><td>{r.expires_at ?? '-'}</td><td>{r.quantity}</td>
            <td><button className="btn" onClick={()=>getAccount(r.id)} disabled={r.quantity<=0}>Get Account</button></td>
          </tr>
        ))}
      </tbody></table>
    )}
    <div className="actions" style={{marginTop:12}}><a className="btn ghost" href="/">Back</a></div>
  </section>)
}
