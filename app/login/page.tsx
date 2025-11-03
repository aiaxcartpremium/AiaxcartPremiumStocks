'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [next,setNext]=useState('/');

  async function doLogin(){
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) return alert(error.message);
    window.location.href = next || '/';
  }

  async function doLogout(){
    await supabase.auth.signOut();
    alert('Logged out');
  }

  return (
    <div className="card grid">
      <h1>Login</h1>
      <div className="row"><label>Redirect after</label>
        <select value={next} onChange={e=>setNext(e.target.value)}>
          <option value="/">Home</option>
          <option value="/admin">Admin</option>
          <option value="/owner">Owner</option>
        </select>
      </div>
      <div className="row"><label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
      </div>
      <div className="row"><label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password"/>
      </div>
      <div className="actions">
        <button className="btn pill" onClick={doLogin}>Login</button>
        <button className="btn ghost pill" onClick={doLogout}>Logout</button>
        <a className="btn ghost pill" href="/">Back</a>
      </div>
      <hr/>
      <div className="small">Quick fill (from your message):<br/>
        Admin: admin1@aiaxcart.shop / aiaxcartadmin123<br/>
        Owner: shanaiamau99@gmail.com / Smfmariano09
      </div>
    </div>
  );
}