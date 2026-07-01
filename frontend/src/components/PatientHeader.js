'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';
import { AuthService } from '../services/api';
import Link from 'next/link';

export default function PatientHeader() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [userProfile, setUserProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useSettings();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const fetchProfile = async () => {
      try {
        const data = await AuthService.getMe();
        setUserProfile(data);
      } catch (error) {
        console.error("Profil bilgisi alınamadı:", error);
      }
    };
    fetchProfile();

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

  const initial = userProfile?.firstName && userProfile?.lastName 
    ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase() 
    : userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <Link href="/" style={logoStyle}>
          <div style={iconStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <span style={titleStyle}>{t('logo_title')}</span>
            <span style={subtitleStyle}>{t('logo_desc')}</span>
          </div>
        </Link>
      </div>
      
      <div style={actionsStyle}>
        <Link href="/book-appointment" style={bookBtnStyle}>
          {t('create_appointment') || 'Yeni Randevu'}
        </Link>
        <button style={themeToggleStyle} onClick={toggleTheme} title="Tema Değiştir">
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
        
        <button 
          onClick={() => router.push('/settings')} 
          style={themeToggleStyle}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--background)'; e.currentTarget.style.color = 'var(--text-main)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          title={t('settings')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>

        <div style={profileContainerStyle} ref={dropdownRef}>
          <div style={profileStyle} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div style={avatarStyle}>{initial}</div>
            <div style={infoStyle}>
              <span style={nameStyle}>{userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '...'}</span>
              <span style={roleStyle}>{t('patient') || 'Hasta'}</span>
            </div>
          </div>

          {isDropdownOpen && userProfile && (
            <div style={dropdownMenuStyle}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>{userProfile.firstName} {userProfile.lastName}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{userProfile.email}</span>
              </div>
              <div style={{ padding: '0.5rem' }}>
                <div style={dropdownItemStyle}>
                  <span style={itemLabelStyle}>{t('tc_no') || 'TC No'}:</span>
                  <span style={itemValueStyle}>{userProfile.username}</span>
                </div>
              </div>
              <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <button onClick={handleLogout} style={logoutBtnStyle}>
                  {t('logout') || 'Çıkış Yap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Inline styles for PatientHeader (using CSS variables)
const headerStyle = {
  height: '70px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  backgroundColor: 'var(--surface)',
  borderBottom: '1px solid var(--border)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: 'var(--shadow-sm)'
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
  color: 'var(--text-main)'
};

const iconStyle = {
  backgroundColor: 'var(--primary)',
  color: '#ffffff',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const titleStyle = {
  fontWeight: '800',
  fontSize: '1.2rem',
  letterSpacing: '1px',
  display: 'block',
  lineHeight: '1.2'
};

const subtitleStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'block'
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const bookBtnStyle = {
  backgroundColor: 'var(--primary)',
  color: '#fff',
  padding: '0.5rem 1.25rem',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.9rem',
  transition: 'background-color 0.2s',
  textDecoration: 'none'
};

const themeToggleStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '50%',
  transition: 'color 0.2s, background-color 0.2s'
};

const profileContainerStyle = {
  position: 'relative'
};

const profileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '8px',
  transition: 'background-color 0.2s'
};

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '1rem'
};

const infoStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const nameStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: 'var(--text-main)',
  lineHeight: '1.2'
};

const roleStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  lineHeight: '1.2'
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: '0',
  width: '240px',
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 1000,
  overflow: 'hidden'
};

const dropdownItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
  fontSize: '0.85rem'
};

const itemLabelStyle = {
  color: 'var(--text-muted)'
};

const itemValueStyle = {
  fontWeight: '500',
  color: 'var(--text-main)'
};

const logoutBtnStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--danger)',
  fontWeight: '500',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  borderRadius: '6px'
};
