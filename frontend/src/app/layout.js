import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ToastContainer from '../components/Toast';
import { SettingsProvider } from '../context/SettingsContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Hastane Randevu Sistemi',
  description: 'DDD Mimari ile geliştirilmiş Hastane Randevu Sistemi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={inter.className}>
        <SettingsProvider>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Header />
              <main className="page-content">
                {children}
              </main>
            </div>
          </div>
          <ToastContainer />
        </SettingsProvider>
      </body>
    </html>
  );
}
