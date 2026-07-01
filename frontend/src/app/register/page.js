'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '../../services/api';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    tcIdentityNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await AuthService.register(formData);
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
      <div className={styles.loginCard} style={{ maxWidth: '450px' }}>
        <div className={styles.logo}>HRS</div>
        <h1 className={styles.title}>Hasta Kayıt</h1>
        <p className={styles.subtitle}>Randevu almak için hasta hesabınızı oluşturun.</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', width: '100%' }}>
            Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...
          </div>
        )}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>TC Kimlik Numarası</label>
            <input
              type="text"
              name="tcIdentityNumber"
              className={styles.input}
              placeholder="11 haneli TC kimlik no"
              value={formData.tcIdentityNumber}
              onChange={handleChange}
              maxLength={11}
              required
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Ad</label>
              <input
                type="text"
                name="firstName"
                className={styles.input}
                placeholder="Adınız"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Soyad</label>
              <input
                type="text"
                name="lastName"
                className={styles.input}
                placeholder="Soyadınız"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>E-Posta</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              placeholder="Mail adresiniz"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Telefon Numarası</label>
            <input
              type="tel"
              name="phoneNumber"
              className={styles.input}
              placeholder="0555 555 5555"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Şifre</label>
            <input
              type="password"
              name="password"
              className={styles.input}
              placeholder="En az 6 karakter"
              value={formData.password}
              onChange={handleChange}
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
