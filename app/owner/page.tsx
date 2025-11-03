'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Papa from 'papaparse'

const TYPES = ['shared_profile','solo_profile','solo_account'] as const
type PricePreset = {product:string, account_type:string, months:number, price:number}

export default function Owner(){
  const [product,setProduct] = useState('netflix')
  const [type,setType] = useState<typeof TYPES[number]>('shared_profile')
  const [months,setMonths] = useState(30)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [profile,setProfile] = useState('')
  const [pin,setPin] = useState('')
  const [price,setPrice] = useState<number|''>('')
  const [qty,setQty] = useState(1)
  const [notes,setNotes] = useState('')
  const [tags,setTags] = useState('')
  const [presets,setPresets] = useState<PricePreset[]>([])
  const [rows,setRows] = useState<any[]>([])
  const [q,setQ] = useState('')

  useEffect(()=>{ (async()=>{
    await load()
    const { data: pp } = await supabase.from('price_presets').select('*').order('product')
    setPresets(pp as any || [])
  })() }, [])

  useEffect(()=>{
    const p = presets.find(p=>p.product===product && p.account_type===type && p.months===months)
    if(p) setPrice(p.price)
  }, [product, type, months, presets])

  async function load(){
    const { data } = await supabase.from('stock_items')
      .select('id,product,account_type,months,price,quantity,expires_at,status,deleted_at')
      .order('created_at', {ascending:false}).limit(100)
    setRows(data||[])
  }

  async function addStock(e:React.FormEvent){
    e.preventDefault()
    const payload = {
      product, account_type:type, months,
      email: email||null, password: password||null, profile: profile||null, pin: pin||null,
      price: price===''? null : Number(price), quantity: qty,
      notes: notes||null, tags: tags? tags.split(',').map(t=>t.trim()) : null
    }
    const { error } = await supabase.rpc('owner_add_stock_many', { payload, n: qty })
    if(error){ alert(error.message); return }
    setEmail(''); setPassword(''); setProfile(''); setPin(''); setNotes(''); setTags(''); setQty(1)
    await load()
  }

  function exportCSV(){
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], {type:"text/csv"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='stocks.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function importCSV(e:any){
    const file = e.target.files?.[0]; if(!file) return
    Papa.parse(file, { header:true, complete: async (res:any)=>{
      const list = (res.data||[]).map((r:any)=> ({
        product: r.product, account_type:r.account_type, months:Number(r.months||30),
        email:r.email||null,password:r.password||null,profile:r.profile||null,pin:r.pin||null,
        price: r.price? Number(r.price): null, quantity: Number(r.quantity||1),
        notes:r.notes||null, tags: r.tags? String(r.tags).split(',').map((t:any)=>t.trim()): null
      }))
      const { error } = await supabase.from('stock_items').insert(list)
      if(error) alert(error.message); else load()
    }})
  }

  async function softDelete(id:string){
    if(!confirm('Move to bin?')) return
    const { error } = await supabase.from('stock_items').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    if(error) alert(error.message); else load()
  }
  async function restore(id:string){
    const { error } = await supabase.from('stock_items').update({ deleted_at: null }).eq('id', id)
    if(error) alert(error.message); else load()
  }

  const filtered = rows.filter(r=>{
    const text = (r.product + ' ' + r.account_type).toLowerCase()
    return !q || text.includes(q.toLowerCase())
  })

  return (
    <div className='card'>
      <h3>Owner Panel</h3>
      <div className='row'>
        <div style={{flex:'1 1 360px'}}>
          <form onSubmit={addStock}>
            <div className='label'>Product</div>
            <input className='input' value={product} onChange={e=>setProduct(e.target.value)} required/>
            <div className='label' style={{marginTop:8}}>Type</div>
            <select className='input' value={type} onChange={e=>setType(e.target.value as any)}>
              {TYPES.map(t=><option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
            <div className='label' style={{marginTop:8}}>Term</div>
            <select className='input' value={months} onChange={e=>setMonths(parseInt(e.target.value))}>
              {[7,14,30,60,90,180,365].map(d=><option key={d} value={d}>{d} days</option>)}
            </select>
            <div className='row' style={{marginTop:8}}>
              <div style={{flex:1}}><div className='label'>Email</div><input className='input' value={email} onChange={e=>setEmail(e.target.value)}/></div>
              <div style={{flex:1}}><div className='label'>Password</div><input className='input' value={password} onChange={e=>setPassword(e.target.value)}/></div>
            </div>
            <div className='row' style={{marginTop:8}}>
              <div style={{flex:1}}><div className='label'>Profile</div><input className='input' value={profile} onChange={e=>setProfile(e.target.value)}/></div>
              <div style={{flex:1}}><div className='label'>PIN</div><input className='input' value={pin} onChange={e=>setPin(e.target.value)}/></div>
            </div>
            <div className='row' style={{marginTop:8}}>
              <div style={{flex:1}}><div className='label'>Price</div><input className='input' type='number' value={price as any} onChange={e=>setPrice(e.target.value===''?'':Number(e.target.value))}/></div>
              <div style={{flex:1}}><div className='label'>Quantity</div><input className='input' type='number' value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)}/></div>
            </div>
            <div className='label' style={{marginTop:8}}>Notes</div>
            <textarea className='input' value={notes} onChange={e=>setNotes(e.target.value)}/>
            <div className='label' style={{marginTop:8}}>Tags (comma separated)</div>
            <input className='input' value={tags} onChange={e=>setTags(e.target.value)}/>
            <button className='btn primary' style={{marginTop:12}}>Add Stock</button>
          </form>
        </div>
        <div style={{flex:'2 1 520px'}}>
          <div className='row' style={{alignItems:'center'}}>
            <input className='input' placeholder='Search…' value={q} onChange={e=>setQ(e.target.value)} />
            <button className='btn' onClick={exportCSV}>Export CSV</button>
            <label className='btn ghost' style={{cursor:'pointer'}}>
              Import CSV
              <input type='file' accept='.csv' style={{display:'none'}} onChange={importCSV}/>
            </label>
          </div>
          <table className='table' style={{marginTop:8}}>
            <thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Price</th><th>Expires</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(r=>(
                <tr key={r.id}>
                  <td>{r.product}</td>
                  <td>{r.account_type}</td>
                  <td>{r.quantity}</td>
                  <td>{r.price??'-'}</td>
                  <td>{new Date(r.expires_at).toLocaleDateString()}</td>
                  <td>{r.deleted_at? 'deleted': r.status}</td>
                  <td>
                    {!r.deleted_at ? <button className='btn' onClick={()=>softDelete(r.id)}>Delete</button> : <button className='btn' onClick={()=>restore(r.id)}>Restore</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
