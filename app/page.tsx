import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage(){
  return (
    <section className="card">
      <h1>Welcome</h1>
      <p>Choose a portal to continue:</p>
      <div className="center" style={{marginTop:12}}>
        <Link className="pill" href="/admin">Admin</Link>
        <Link className="pill ghost" href="/owner">Owner</Link>
      </div>
    </section>
  );
}