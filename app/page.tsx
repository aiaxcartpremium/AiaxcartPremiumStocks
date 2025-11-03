import Link from 'next/link'

export default function Home(){
  return (
    <div className="card">
      <h1 className="h1">Welcome</h1>
      <p>Choose a portal to continue:</p>
      <div className="row" style={{marginTop:12}}>
        <Link className="btn" href="/admin">Admin</Link>
        <Link className="btn ghost" href="/owner">Owner</Link>
      </div>
    </div>
  )
}
