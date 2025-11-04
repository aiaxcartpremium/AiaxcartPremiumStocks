'use client';
import { useState } from 'react';
import { sbBrowser } from '@/lib/supabaseClient';

type Role = 'admin'|'owner';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState<Role>('admin');
  const [loading,setLoading]=useState(false);
  const supabase = sbBrowser();

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    try{
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if(error) throw error;
      window.location.href = role==='admin'? '/admin' : '/owner';
    }catch(err:any){
      alert(err.message || 'Login failed');
    }finally{ setLoading(false); }
  }

  function quick(role:Role){
    setRole(role);
    if(role==='admin'){
      setEmail(process.env.NEXT_PUBLIC_LOGIN_ADMIN_EMAIL || process.env.LOGIN_ADMIN_EMAIL || '');
      setPassword(process.env.NEXT_PUBLIC_LOGIN_ADMIN_PASSWORD || process.env.LOGIN_ADMIN_PASSWORD || '');
    }else{
      setEmail(process.env.NEXT_PUBLIC_LOGIN_OWNER_EMAIL || process.env.LOGIN_OWNER_EMAIL || '');
      setPassword(process.env.NEXT_PUBLIC_LOGIN_OWNER_PASSWORD || process.env.LOGIN_OWNER_PASSWORD || '');
    }
  }

  return (
    <section className="card grid">
      <h1 style={{margin:0}}>Login</h1>
      <div className="pills">
        <button className="btn" onClick={()=>quick('admin')}>Use admin creds</button>
        <button className="btn" onClick={()=>quick('owner')}>Use owner creds</button>
      </div>
      <form onSubmit={onSubmit} className="grid">
        <label>Email<input className="input" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Password<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <label>Login as
          <select className="input" value={role} onChange={e=>setRole(e.target.value as Role)}>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </label>
        <button className="btn primary" disabled={loading}>{loading? 'Signing in...' : 'Login'}</button>
      </form>
    </section>
  );
}
