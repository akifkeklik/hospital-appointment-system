import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const metadata = {
  title: 'Hastane Randevu Sistemi',
  description: 'DDD Mimari ile geliştirilmiş Hastane Randevu Sistemi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main className="page-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
