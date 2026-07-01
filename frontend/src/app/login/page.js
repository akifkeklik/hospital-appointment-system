'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/api';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState(null); // 'DOCTOR' veya 'PATIENT'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await AuthService.login(username, password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        router.push('/');
      } else {
        setError('Giriş başarısız, token alınamadı.');
      }
    } catch (err) {
      setError(err.message || 'Giriş bilgileri hatalı.');
    } finally {
      setLoading(false);
    }
  };

  if (!loginType) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard} style={{ maxWidth: '600px' }}>
          <div className={styles.logo}>HRS</div>
          <h1 className={styles.title}>Giriş Yap</h1>
          <p className={styles.subtitle}>Lütfen giriş yapmak istediğiniz rolü seçin.</p>
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
            <button 
              onClick={() => setLoginType('PATIENT')}
              style={{
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <span style={{ fontSize: '40px' }}>🤒</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hasta Girişi</span>
            </button>

            <button 
              onClick={() => setLoginType('DOCTOR')}
              style={{
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <span style={{ fontSize: '40px' }}>🩺</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Doktor/Personel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>HRS</div>
        <h1 className={styles.title}>{loginType === 'PATIENT' ? 'Hasta Girişi' : 'Doktor Girişi'}</h1>
        <p className={styles.subtitle}>Sisteme erişmek için kimliğinizi doğrulayın.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{loginType === 'PATIENT' ? 'TC Kimlik Numarası' : 'Kullanıcı Adı / E-Posta'}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={loginType === 'PATIENT' ? "11 Haneli TC Kimlik" : "admin"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Şifre</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span 
              onClick={() => { setLoginType(null); setError(''); setUsername(''); setPassword(''); }} 
              style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Geri Dön
            </span>
            {loginType === 'PATIENT' && (
              <span style={{ color: 'var(--text-secondary)' }}>
                Hesabınız yok mu? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Kayıt Ol</a>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
