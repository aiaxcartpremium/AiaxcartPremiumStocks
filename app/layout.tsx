import './globals.css'
import Link from 'next/link'
export const metadata = { title: 'Aiaxcart Premium Shop' }
export default function RootLayout({ children }:{children:React.ReactNode}){
  return (<html lang="en"><body>
    <header>
      <div className="brand">Aiaxcart Premium Shop</div>
      <Link className="pill ghost" href="/">Home</Link>
      <Link className="pill primary" href="/login">Login</Link>
    </header>
    <main className="container">{children}</main>
    <footer>© 2025 Aiax</footer>
  </body></html>)
}
