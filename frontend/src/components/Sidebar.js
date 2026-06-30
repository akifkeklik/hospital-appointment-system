'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Bölümler', path: '/departments', icon: '🏢' },
    { name: 'Hastalar', path: '/patients', icon: '🧑' },
    { name: 'Doktorlar', path: '/doctors', icon: '👨‍⚕️' },
    { name: 'Randevular', path: '/appointments', icon: '📅' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>🏥 HRS</h2>
        <p>Hastane Sistemi</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className={styles.footer}>
        <p>© 2026 HRS v1.0</p>
      </div>
    </aside>
  );
}
