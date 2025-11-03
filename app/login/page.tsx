'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login(){
  const r = useRouter()
  const [loading,setLoading]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  async function signIn(path:string, preset?:'admin'|'owner'){
    try{
      setLoading(true)
      let e=email, p=password
      if(preset==='admin'){
        e = process.env.NEXT_PUBLIC_LOGIN_ADMIN_EMAIL!
        p = process.env.NEXT_PUBLIC_LOGIN_ADMIN_PASSWORD!
      }
      if(preset==='owner'){
        e = process.env.NEXT_PUBLIC_LOGIN_OWNER_EMAIL!
        p = process.env.NEXT_PUBLIC_LOGIN_OWNER_PASSWORD!
      }
      const { error } = await supabase.auth.signInWithPassword({ email:e, password:p })
      if(error) throw error
      r.push(path)
    }catch(err:any){
      alert(err.message||'Login failed')
    }finally{ setLoading(false) }
  }
  async function logout(){
    await supabase.auth.signOut()
    alert('Logged out')
  }
  return (
    <main className="grid" style={{maxWidth:480}}>
      <h1 className="h1">Login</h1>
      <div className="grid">
        <label>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/>
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn primary" onClick={()=>signIn('/admin','admin')} disabled={loading}>Quick login (Admin)</button>
          <button className="btn" onClick={()=>signIn('/owner','owner')} disabled={loading}>Quick login (Owner)</button>
          <button className="btn" onClick={()=>signIn('/admin')} disabled={loading}>Sign in → Admin</button>
          <button className="btn" onClick={()=>signIn('/owner')} disabled={loading}>Sign in → Owner</button>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
        <div className="alert">Quick-login uses the preset credentials you provided.</div>
      </div>
    </main>
  )
}
