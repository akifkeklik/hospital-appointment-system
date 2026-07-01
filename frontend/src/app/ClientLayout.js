'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { SettingsProvider } from '../context/SettingsContext';
import ToastContainer from '../components/Toast';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (!token && !isLoginPage) {
      router.push('/login');
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  // Next.js hydration uyumsuzluklarını önlemek için mount olana kadar boş dönebiliriz.
  if (!mounted) return null;

  // Eğer sayfa login ise Sidebar ve Header'ı KESİNLİKLE GİZLE!
  if (isLoginPage) {
    return (
      <SettingsProvider>
        {children}
        <ToastContainer />
      </SettingsProvider>
    );
  }

  // Token yoksa (henüz redirect olmadıysa) arayüzü çizme ki ekran saniyelik gözükmesin
  if (!isAuthenticated && !isLoginPage) return null;

  return (
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
  );
}
