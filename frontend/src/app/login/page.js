'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/api';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
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
      setError('Kullanıcı adı veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>HRS</div>
        <h1 className={styles.title}>Yönetici Girişi</h1>
        <p className={styles.subtitle}>Sisteme erişmek için kimliğinizi doğrulayın.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Kullanıcı Adı</label>
            <input
              type="text"
              className={styles.input}
              placeholder="admin"
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

          <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Henüz hesabınız yok mu? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Kayıt Ol</a>
          </div>
        </form>
      </div>
    </div>
  );
}
