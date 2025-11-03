import Link from 'next/link'
export default function Home(){
  return (<section className="card">
    <h1>Welcome</h1>
    <p className="muted">Choose a portal to continue:</p>
    <div className="actions">
      <Link className="pill primary" href="/admin">Admin</Link>
      <Link className="pill ghost" href="/owner">Owner</Link>
    </div>
  </section>)
}
