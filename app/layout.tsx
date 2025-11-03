import './globals.css';
import Header from '@/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <Header/>
      <main style={{maxWidth:880, margin:'0 auto', padding:'8px 16px 40px'}}>{children}</main>
    </body></html>
  );
}