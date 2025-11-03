export default function HomePage(){
  return (
    <div className="card">
      <h1>Welcome</h1>
      <p>Choose a portal to continue:</p>
      <div className="actions">
        <a className="btn pill" href="/admin">Admin</a>
        <a className="btn ghost pill" href="/owner">Owner</a>
      </div>
      <p className="small">© 2025 Aiax</p>
    </div>
  );
}