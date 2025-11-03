'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar({ role }:{role:'owner'|'admin'|null}){
  const router = useRouter()
  async function logout(){
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <div className="nav">
      <div className="brand">Aiax Stocks <span className="badge">{role ?? 'Guest'}</span></div>
      <div className='row'>
        <Link className='btn ghost' href='/'>Home</Link>
        <Link className='btn ghost' href='/admin'>Admin</Link>
        <Link className='btn ghost' href='/owner'>Owner</Link>
        {role ? <button className='btn' onClick={logout}>Logout</button> : <Link className='btn primary' href='/login'>Login</Link>}
      </div>
    </div>
  )
}
