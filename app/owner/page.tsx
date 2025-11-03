'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CATALOG } from '@/lib/catalog'
import { TERM_OPTIONS, termToDays, addDaysISO } from '@/lib/date'

export default function OwnerPage(){
  const [authed,setAuthed] = useState(false)
  const [prod,setProd]=useState('')
  const [acct,setAcct]=useState<'shared_profile'|'solo_profile'|'shared_acc'|'solo_acc'>('shared_profile')
  const [term,setTerm]=useState('1m')
  const [price,setPrice]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [profile,setProfile]=useState('')
  const [pin,setPin]=useState('')
  const [qty,setQty]=useState(1)
  const [notes,setNotes]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setAuthed(!!data.session)
    })
  },[])

  const expISO = useMemo(()=> addDaysISO(termToDays(term)), [term])
  const expPretty = new Date(expISO).toISOString().slice(0,10)

  async function submit(){
    try{
      if(!authed){ alert('Please login first.'); return }
      if(!prod){ alert('Please select product'); return }
      const term_days = termToDays(term)
      const { error } = await supabase.from('stocks').insert({
        product_key: prod,
        account_type: acct,
        term_days,
        price: price? Number(price): null,
        email: email || null,
        password: password || null,
        profile: profile || null,
        pin: pin || null,
        quantity: qty,
        notes: notes || null,
        expires_at: expISO
      })
      if(error) throw error
      alert('Stock added!')
      setEmail('');setPassword('');setProfile('');setPin('');setPrice('');setQty(1);setNotes('')
    }catch(err:any){
      alert(err.message||'Insert failed')
    }
  }

  return (
    <main className="grid" style={{maxWidth:720}}>
      <h1 className="h1">Owner Panel</h1>
      {!authed && <div className="alert">You are not logged in. Go to <a href="/login">Login</a>.</div>}
      <label>Product</label>
      <select value={prod} onChange={e=>setProd(e.target.value)} className="input">
        <option value="">Select product</option>
        {CATALOG.map(p=>(<option value={p.key} key={p.key}>{p.label}</option>))}
      </select>

      <label>Account type</label>
      <select value={acct} onChange={e=>setAcct(e.target.value as any)} className="input">
        <option value="shared_profile">Shared profile</option>
        <option value="solo_profile">Solo profile</option>
        <option value="shared_acc">Shared acc</option>
        <option value="solo_acc">Solo acc</option>
      </select>

      <label>Term</label>
      <select value={term} onChange={e=>setTerm(e.target.value)} className="input">
        {TERM_OPTIONS.map(t=>(<option key={t.key} value={t.key}>{t.label}</option>))}
      </select>

      <div style={{fontWeight:800, marginTop:8}}>Expires on: {expPretty}</div>

      <label>Price (optional)</label>
      <input className="input" value={price} onChange={e=>setPrice(e.target.value)} />
      <label>Email (optional)</label>
      <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
      <label>Password (optional)</label>
      <input className="input" value={password} onChange={e=>setPassword(e.target.value)} />
      <label>Profile (optional)</label>
      <input className="input" value={profile} onChange={e=>setProfile(e.target.value)} />
      <label>PIN (optional)</label>
      <input className="input" value={pin} onChange={e=>setPin(e.target.value)} />
      <label>Quantity (optional)</label>
      <input className="input" type="number" value={qty} onChange={e=>setQty(Number(e.target.value||1))} />
      <label>Notes (optional)</label>
      <input className="input" value={notes} onChange={e=>setNotes(e.target.value)} />

      <div style={{display:'flex', gap:8}}>
        <button className="btn primary" onClick={submit}>Add Stock</button>
        <a className="btn" href="/login">Logout / Switch</a>
      </div>
    </main>
  )
}
