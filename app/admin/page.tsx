'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CATALOG } from '@/lib/catalog'
import type { Stock } from '@/lib/types'

function nameFor(key:string){ return CATALOG.find(c=>c.key===key)?.label ?? key }

export default function AdminPage(){
  const [authed,setAuthed]=useState(false)
  const [rows,setRows]=useState<Stock[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      setAuthed(!!data.session)
      if(!data.session) return
      const { data:stocks, error } = await supabase.from('stocks')
        .select('id,product_key,account_type,term_days,price,expires_at,quantity')
        .order('expires_at', { ascending:true })
      if(error){ alert(error.message);return }
      setRows(stocks as any); setLoading(false)
    })
  },[])

  async function getAccount(id:string){
    try{
      const { data, error } = await supabase.from('stocks').select('*').eq('id', id).single()
      if(error) throw error
      if(!data){ alert('Not found'); return }
      const creds = `Email: ${data.email||'-'}\nPassword: ${data.password||'-'}\nProfile: ${data.profile||'-'}\nPIN: ${data.pin||'-'}`
      alert(creds)
      const newQty = Math.max(0, (data.quantity||1)-1)
      if(newQty===0){
        await supabase.from('stocks').delete().eq('id', id)
      }else{
        await supabase.from('stocks').update({ quantity:newQty }).eq('id', id)
      }
      const { data:stocks2 } = await supabase.from('stocks')
        .select('id,product_key,account_type,term_days,price,expires_at,quantity').order('expires_at',{ascending:true})
      setRows(stocks2 as any)
    }catch(err:any){
      alert(err.message||'Grant failed')
    }
  }

  return (
    <main className="grid">
      <h1 className="h1">Admin Panel</h1>
      {!authed && <div className="alert">You are not logged in. Go to <a href="/login">Login</a>.</div>}
      {loading? <div>Loading...</div>:
        rows.length===0? <div>No stocks yet</div>:
        <table className="table">
          <thead><tr>
            <th>Product</th><th>Type</th><th>Term</th><th>Price</th><th>Expires</th><th>Qty</th><th></th>
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td>{nameFor(r.product_key)}</td>
                <td>{r.account_type.replace('_',' ')}</td>
                <td>{r.term_days}d</td>
                <td>{r.price ?? '-'}</td>
                <td>{new Date(r.expires_at).toISOString().slice(0,10)}</td>
                <td>{r.quantity}</td>
                <td><button className="btn primary" onClick={()=>getAccount(r.id)}>Get Account</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <a className="btn" href="/login">Logout / Switch</a>
      </div>
    </main>
  )
}
