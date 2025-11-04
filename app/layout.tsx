import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header container">
          <div className="brand">Aiaxcart Premium Shop</div>
          <nav className="pills">
            <Link href="/" className="btn ghost">Home</Link>
            <Link href="/login" className="btn primary">Login</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container footer">© 2025 Aiax</footer>
      </body>
    </html>
  );
}
