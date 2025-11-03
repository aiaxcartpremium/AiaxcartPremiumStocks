'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Nav(){
  const [authed,setAuthed]=useState(false)
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=> setAuthed(!!s))
    return ()=>{ sub.subscription.unsubscribe() }
  },[])
  async function logout(){
    await supabase.auth.signOut()
    window.location.href='/'
  }
  return (
    <header className="header">
      <nav className="nav container">
        <div className="left">Aiaxcart Premium Shop</div>
        <div className="row">
          <Link className="pill" href="/">Home</Link>
          {!authed ? (
            <Link className="pill" href="/login">Login</Link>
          ): (
            <button className="pill" onClick={logout}>Logout</button>
          )}
        </div>
      </nav>
    </header>
  )
}
