'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';
import { AuthService } from '../services/api';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useSettings();

  useEffect(() => {
    // Tema ayarını yükle
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Profil bilgisini çek
    const fetchProfile = async () => {
      try {
        const data = await AuthService.getMe();
        setUserProfile(data);
      } catch (error) {
        console.error("Profil bilgisi alınamadı:", error);
      }
    };
    fetchProfile();

    // Dışarı tıklayınca dropdown kapansın
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Logout error", e);
    }
    localStorage.removeItem('token');
    router.push('/login');
  };

  const roleText = userProfile?.role === 'ROLE_PATIENT' ? t('patient') : 
                   userProfile?.role === 'ROLE_DOCTOR' ? t('doctor') : t('admin_role');

  const initial = userProfile?.firstName && userProfile?.lastName 
    ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase() 
    : userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : '';

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        {/* İleride buraya arama çubuğu gelebilir */}
      </div>
      <div className={styles.actions}>
        <button className={styles.themeToggle} onClick={toggleTheme} title="Gündüz/Gece Modu">
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
        
        <div className={styles.profileContainer} ref={dropdownRef}>
          <div className={styles.profile} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className={styles.avatar}>{initial}</div>
            <div className={styles.info}>
              <span className={styles.name}>{userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '...'}</span>
              <span className={styles.role}>{userProfile ? roleText : '...'}</span>
            </div>
          </div>

          {isDropdownOpen && userProfile && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <strong>{userProfile.firstName} {userProfile.lastName}</strong>
                <span>{userProfile.email}</span>
              </div>
              <div className={styles.dropdownBody}>
                <div className={styles.dropdownItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className={styles.itemLabel}>{t('role')}</span>
                  </div>
                  <span className={styles.itemValue} style={{ color: 'var(--primary)', fontWeight: '700' }}>{roleText}</span>
                </div>
                <div className={styles.dropdownItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span className={styles.itemLabel}>{t('tc_no')}</span>
                  </div>
                  <span className={styles.itemValue}>{userProfile.username}</span>
                </div>
                <div className={styles.dropdownItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span className={styles.itemLabel}>{t('phone')}</span>
                  </div>
                  <span className={styles.itemValue}>{userProfile.phoneNumber || '-'}</span>
                </div>
                <div 
                  className={styles.dropdownItem} 
                  style={{ cursor: 'pointer', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: '500' }}
                  onClick={() => router.push('/settings')}
                >
                  <span className={styles.itemLabel}>⚙️</span>
                  <span className={styles.itemValue}>{t('settings') || 'Ayarlar'}</span>
                </div>
              </div>
              <div className={styles.dropdownFooter}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  {t('logout') || 'Sistemden Çıkış Yap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
