import Link from 'next/link'

export default function Home(){
  return (
    <main className="grid">
      <div className="card">
        <h1 className="h1">Welcome</h1>
        <p>Choose a portal to continue:</p>
        <div style={{display:'flex', gap:12, marginTop:12}}>
          <Link className="btn primary" href="/admin">Admin</Link>
          <Link className="btn" href="/owner">Owner</Link>
        </div>
      </div>
    </main>
  )
}
