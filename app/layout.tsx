import './globals.css'
import Link from 'next/link'

export const metadata = { title:'Aiaxcart Premium Shop', description:'Stocks manager' }

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">Aiaxcart Premium Shop</div>
            <nav className="nav">
              <Link className="btn" href="/">Home</Link>
              <Link className="btn primary" href="/login">Login</Link>
            </nav>
          </header>
          {children}
          <footer>© 2025 Aiax</footer>
        </div>
      </body>
    </html>
  )
}
