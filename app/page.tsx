import Link from 'next/link';

export default function Home() {
  return (
    <section className="card grid">
      <h1 style={{margin:0}}>Welcome</h1>
      <p>Choose a portal to continue:</p>
      <div className="pills">
        <Link href="/admin" className="btn primary">Admin</Link>
        <Link href="/owner" className="btn">Owner</Link>
      </div>
    </section>
  );
}
