'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Records(){
  const [rows,setRows]=useState<any[]>([])
  const [msg,setMsg]=useState('')

  useEffect(()=>{ load() },[])
  async function load(){
    const { data } = await supabase.from('sales').select('*').order('sold_at',{ascending:false}).limit(200)
    setRows(data||[])
  }
  async function save(r:any){
    const { error } = await supabase.from('sales')
      .update({ buyer_name:r.buyer_name, channel:r.channel, amount:r.amount, discount:r.discount||0, net_amount:(r.amount||0)-(r.discount||0), additional_days:r.additional_days||0 })
      .eq('id', r.id)
    setMsg(error? error.message:'Saved')
    if(!error) load()
  }
  return (
    <div className='card'>
      <h3>My Sales</h3>
      <table className='table'>
        <thead><tr><th>#</th><th>Stock</th><th>Buyer</th><th>Channel</th><th>Amount</th><th>Discount</th><th>Net</th><th>+Days</th><th></th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.id.slice(0,8)}</td>
              <td>{r.stock_id?.slice?.(0,8) || r.stock_id}</td>
              <td><input className='input' value={r.buyer_name||''} onChange={e=>{r.buyer_name=e.target.value; setRows([...rows])}}/></td>
              <td>
                <select className='input' value={r.channel||'tg'} onChange={e=>{r.channel=e.target.value; setRows([...rows])}}>
                  <option value="tg">tg</option><option value="fb">fb</option><option value="ig">ig</option><option value="tiktok">tiktok</option><option value="other">other</option>
                </select>
              </td>
              <td><input type='number' className='input' value={r.amount||''} onChange={e=>{r.amount=e.target.value===''?null:Number(e.target.value); setRows([...rows])}}/></td>
              <td><input type='number' className='input' value={r.discount||0} onChange={e=>{r.discount=Number(e.target.value||0); setRows([...rows])}}/></td>
              <td>{(r.amount||0)-(r.discount||0)}</td>
              <td><input type='number' className='input' value={r.additional_days||0} onChange={e=>{r.additional_days=Number(e.target.value||0); setRows([...rows])}}/></td>
              <td><button className='btn primary' onClick={()=>save(r)}>Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {msg && <p style={{marginTop:8}}>{msg}</p>}
    </div>
  )
}
