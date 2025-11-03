'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CATALOG } from '../../lib/catalog'
const ACCOUNT_TYPES = ['shared_profile','solo_profile','shared_account','solo_account'] as const
const TERM_OPTIONS = [
  {label:'7 days', days:7},{label:'14 days', days:14},
  {label:'1 month', days:30},{label:'2 months', days:60},{label:'3 months', days:90},
  {label:'4 months', days:120},{label:'5 months', days:150},{label:'6 months', days:180},
  {label:'7 months', days:210},{label:'8 months', days:240},{label:'9 months', days:270},
  {label:'10 months', days:300},{label:'11 months', days:330},{label:'12 months', days:360},
]
// app/admin/page.tsx  (and same idea for /owner)
export const dynamic = 'force-dynamic'
export const revalidate = 0
export default function OwnerPage(){
  const [product,setProduct]=useState('')
  const [accountType,setAccountType]=useState<typeof ACCOUNT_TYPES[number]>('shared_profile')
  const [term,setTerm]=useState(30)
  const [price,setPrice]=useState<number|''>('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [profile,setProfile]=useState('')
  const [pin,setPin]=useState('')
  const [quantity,setQuantity]=useState(1)
  const [notes,setNotes]=useState('')

  const expiresOn = useMemo(()=>{ const d=new Date(); d.setDate(d.getDate()+Number(term||0)); return d.toISOString().slice(0,10) },[term])

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ if(!data.session){ location.href='/login?next=/owner' } })
  },[])

  async function addStock(){
    try{
      const payload:any={ product_key:product, account_type:accountType, term_days:term,
        price: price===''? null:Number(price), email,password,profile,pin, notes, quantity }
      const { error } = await supabase.rpc('add_stock_one', payload)
      if(error) throw error
      alert('Added!')
      setEmail(''); setPassword(''); setProfile(''); setPin(''); setNotes('')
    }catch(e:any){ alert(e.message) }
  }

  return (<section className="card">
    <h1>Owner Panel</h1>
    <div className="grid">
      <div><label>Product</label>
        <select value={product} onChange={e=>setProduct(e.target.value)}>
          <option value="">Select product</option>
          {CATALOG.map(c=>(<option key={c.key} value={c.key}>{c.label}</option>))}
        </select></div>
      <div><label>Account type</label>
        <select value={accountType} onChange={e=>setAccountType(e.target.value as any)}>
          {ACCOUNT_TYPES.map(a=>(<option key={a} value={a}>{a.replace('_',' ')}</option>))}
        </select></div>
      <div><label>Term</label>
        <select value={String(term)} onChange={e=>setTerm(Number(e.target.value))}>
          {TERM_OPTIONS.map(t=>(<option key={t.days} value={t.days}>{t.label}</option>))}
        </select></div>
      <div><strong>Expires on:</strong> {expiresOn}</div>
      <div><label>Price (optional)</label><input inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value===''?'':Number(e.target.value))}/></div>
      <div><label>Email (optional)</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div><label>Password (optional)</label><input value={password} onChange={e=>setPassword(e.target.value)}/></div>
      <div><label>Profile (optional)</label><input value={profile} onChange={e=>setProfile(e.target.value)}/></div>
      <div><label>PIN (optional)</label><input value={pin} onChange={e=>setPin(e.target.value)}/></div>
      <div><label>Quantity (optional)</label><input inputMode="numeric" value={String(quantity)} onChange={e=>setQuantity(Number(e.target.value)||1)}/></div>
      <div><label>Notes (optional)</label><input value={notes} onChange={e=>setNotes(e.target.value)}/></div>
    </div>
    <div className="actions" style={{marginTop:12}}>
      <button className="btn" onClick={addStock}>Add Stock</button>
      <a className="btn ghost" href="/">Back</a>
    </div>
  </section>)
}
