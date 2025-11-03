import './globals.css'
import Nav from './(components)/Nav'

export const metadata = { title: 'Aiaxcart Premium Shop', description:'Stocks & records' }

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <Nav/>
        <main className="container">{children}</main>
        <footer className="footer container">© 2025 Aiax</footer>
      </body>
    </html>
  )
}
