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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const roleText = userProfile?.role === 'ROLE_PATIENT' ? t('patient') : 
                   userProfile?.role === 'ROLE_DOCTOR' ? t('doctor') : t('admin_role');

  const initial = userProfile?.firstName && userProfile?.lastName 
    ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase() 
    : userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : 'U';

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
              <span className={styles.name}>{userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Yükleniyor...'}</span>
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
                  <span className={styles.itemLabel}>{t('role') || 'Rol'}:</span>
                  <span className={styles.itemValue}>{roleText}</span>
                </div>
                <div className={styles.dropdownItem}>
                  <span className={styles.itemLabel}>{t('tc_no') || 'TC No'}:</span>
                  <span className={styles.itemValue}>{userProfile.username}</span>
                </div>
                <div className={styles.dropdownItem}>
                  <span className={styles.itemLabel}>{t('phone') || 'Telefon'}:</span>
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
