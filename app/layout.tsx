import './globals.css';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export const metadata = { title: 'Aiaxcart Premium Shop' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: simple client-only app; header buttons are Links
  return (
    <html lang="en">
      <body>
        <div className="header container">
          <div className="brand">Aiaxcart Premium Shop</div>
          <div style={{flex:1}} />
          <Link className="btn ghost pill" href="/">Home</Link>
          <Link className="btn pill" href="/login">Login</Link>
        </div>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}