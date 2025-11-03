'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login(){
  const qp = useSearchParams()
  const as = (qp.get('as') ?? 'admin') as 'admin'|'owner'
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const router = useRouter()

  async function submit(e:React.FormEvent){
    e.preventDefault(); setErr(''); setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error){ setErr(error.message); return }
    const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    const role = p?.role as 'admin'|'owner'|undefined
    if(!role){ setErr('No role set for this user'); return }
    if(role !== as){ setErr(`This account is ${role}, not ${as}`); await supabase.auth.signOut(); return }
    router.push('/'+role)
  }

  return (
    <div className='card' style={{maxWidth:480,margin:'0 auto'}}>
      <h3>Login as {as}</h3>
      <form onSubmit={submit}>
        <div className='label'>Email</div>
        <input className='input' value={email} onChange={e=>setEmail(e.target.value)} required/>
        <div className='label' style={{marginTop:8}}>Password</div>
        <input className='input' type='password' value={password} onChange={e=>setPassword(e.target.value)} required/>
        {err && <p style={{color:'#e74c3c',fontSize:12,marginTop:8}}>{err}</p>}
        <button className='btn primary' style={{marginTop:12}} disabled={loading}>{loading?'Signing in…':'Login'}</button>
      </form>
    </div>
  )
}
