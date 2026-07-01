'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../../services/api';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await AuthService.register(username, email, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>HRS</div>
        <h1 className={styles.title}>Hesap Oluştur</h1>
        <p className={styles.subtitle}>Sisteme erişmek için yeni bir yönetici hesabı oluşturun.</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', width: '100%' }}>
            Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...
          </div>
        )}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Kullanıcı Adı</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Kullanıcı adınızı belirleyin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>E-Posta</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Mail adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading || success}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Zaten hesabınız var mı? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Giriş Yap</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
