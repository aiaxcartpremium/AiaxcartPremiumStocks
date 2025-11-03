import './globals.css';
import Link from 'next/link';
import { getServerAuth } from '@/lib/requireSession';

export const metadata = { title: 'Aiaxcart Premium Shop' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { session } = await getServerAuth();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="brand">Aiaxcart Premium Shop</div>
          <div style={{flex:1}} />
          <Link className="pill ghost" href="/">Home</Link>
          {session
            ? <form action="/logout" method="post"><button className="pill">Logout</button></form>
            : <Link className="pill" href="/login">Login</Link>}
        </header>
        <main className="container">{children}</main>
        <form action="/login" method="post" />
      </body>
    </html>
  );
}