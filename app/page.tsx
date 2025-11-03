import Link from 'next/link';

export default function Home() {
  return (
    <div className="card">
      <h1 className="h1">Welcome</h1>
      <p>Choose a portal to continue:</p>
      <div className="actions" style={{marginTop:10}}>
        <Link className="pill" href="/admin">Admin</Link>
        <Link className="pill" href="/owner">Owner</Link>
      </div>
    </div>
  );
}