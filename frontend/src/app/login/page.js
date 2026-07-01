'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService, DepartmentService } from '../../services/api';
import styles from './page.module.css';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState(null); // 'PATIENT', 'DOCTOR', veya 'ADMIN'
  const [showDoctorRegister, setShowDoctorRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [departments, setDepartments] = useState([]);

  // Doctor Registration Form State
  const [regData, setRegData] = useState({
    tcIdentityNumber: '', firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', departmentId: '', password: ''
  });

  useEffect(() => {
    if (showDoctorRegister) {
      DepartmentService.getAll()
        .then(data => setDepartments(data))
        .catch(err => console.error("Bölümler yüklenemedi", err));
    }
  }, [showDoctorRegister]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      setSuccessMsg('');
      const response = await AuthService.login(username.trim(), password);
      if (response && response.token) {
        const decoded = parseJwt(response.token);
        const actualRole = decoded?.role;

        let valid = false;
        if (loginType === 'PATIENT' && actualRole === 'ROLE_PATIENT') valid = true;
        else if (loginType === 'DOCTOR' && actualRole === 'ROLE_DOCTOR') valid = true;
        else if (loginType === 'ADMIN' && actualRole === 'ROLE_ADMIN') valid = true;

        if (!valid) {
          setError('Hata: Seçtiğiniz giriş tipiyle hesabınızın yetkisi uyuşmuyor!');
          setLoading(false);
          return;
        }

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

  const handleDoctorRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/doctor-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...regData,
            departmentId: regData.departmentId ? Number(regData.departmentId) : null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Kayıt başarısız oldu');
      }
      setSuccessMsg(data.message || 'Kayıt talebiniz alındı. Yönetici onayından sonra giriş yapabilirsiniz.');
      setShowDoctorRegister(false);
      setRegData({tcIdentityNumber: '', firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', departmentId: '', password: ''});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInitialSelection = () => (
    <div className={styles.loginCard} style={{ maxWidth: '600px' }}>
      <div className={styles.logo}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <h1 className={styles.title}>Giriş Yap</h1>
      <p className={styles.subtitle}>Sisteme erişmek için rolünüzü seçin</p>
      
      <div className={styles.roleSelection}>
        <button onClick={() => setLoginType('PATIENT')} className={styles.roleButton}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className={styles.roleText}>Hasta Girişi</span>
        </button>

        <button onClick={() => setLoginType('DOCTOR')} className={styles.roleButton}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M10 10h4" />
          </svg>
          <span className={styles.roleText}>Doktor Girişi</span>
        </button>

        <button onClick={() => setLoginType('ADMIN')} className={styles.roleButton}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className={styles.roleText}>Yönetici Girişi</span>
        </button>
      </div>
    </div>
  );

  const renderLoginForm = () => {
    let title = '';
    let placeholder = '';
    
    switch(loginType) {
      case 'PATIENT':
        title = 'Hasta Girişi';
        placeholder = '11 Haneli TC Kimlik';
        break;
      case 'DOCTOR':
        title = 'Doktor Girişi';
        placeholder = 'TC Kimlik Numarası';
        break;
      case 'ADMIN':
        title = 'Yönetici Girişi';
        placeholder = 'Kullanıcı Adı';
        break;
    }

    return (
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>Kimlik bilgilerinizi doğrulayın</p>

        {error && (
          <div className={styles.error}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {loginType === 'PATIENT' || loginType === 'DOCTOR' ? 'TC Kimlik Numarası' : 'Kullanıcı Adı'}
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder={placeholder}
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
          
          <div className={styles.footerLinks}>
            <span 
              className={styles.backLink}
              onClick={() => { setLoginType(null); setError(''); setUsername(''); setPassword(''); }} 
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Geri Dön
            </span>
            
            <div className={styles.footerActions}>
              <Link href="/forgot-password" className={styles.link}>Şifremi Unuttum</Link>
              {loginType === 'PATIENT' && (
                <>
                  <span style={{color: 'rgba(255,255,255,0.3)'}}>|</span>
                  <Link href="/register" className={styles.link}>Kayıt Ol</Link>
                </>
              )}
            </div>
          </div>
        </form>

        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

        {loginType === 'DOCTOR' && !showDoctorRegister && (
          <div style={{textAlign: 'center', marginTop: '1rem'}}>
             <button type="button" onClick={() => { setShowDoctorRegister(true); setError(''); setSuccessMsg(''); }} className={styles.linkButton} style={{background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline'}}>
               Yeni Doktor Kaydı / Şifre Al
             </button>
          </div>
        )}

      </div>
    );
  };

  const renderDoctorRegisterForm = () => {
    return (
      <div className={styles.loginCard} style={{ maxWidth: '600px' }}>
        <h1 className={styles.title}>Doktor Kayıt Talebi</h1>
        <p className={styles.subtitle}>Sisteme dahil olmak için bilgilerinizi giriniz. Talebiniz yönetici onayına sunulacaktır.</p>

        <form onSubmit={handleDoctorRegister} className={styles.form}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className={styles.inputGroup}>
                <label>TC Kimlik No</label>
                <input type="text" maxLength="11" required value={regData.tcIdentityNumber} onChange={(e) => setRegData({...regData, tcIdentityNumber: e.target.value})} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label>Bölüm</label>
                <select 
                  value={regData.departmentId} 
                  onChange={(e) => setRegData({...regData, departmentId: e.target.value})} 
                  className={styles.input}
                  required
                >
                  <option value="">Bölüm Seçiniz</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
            </div>
            <div className={styles.inputGroup}>
                <label>Ad</label>
                <input type="text" required value={regData.firstName} onChange={(e) => setRegData({...regData, firstName: e.target.value})} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label>Soyad</label>
                <input type="text" required value={regData.lastName} onChange={(e) => setRegData({...regData, lastName: e.target.value})} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label>E-Posta</label>
                <input type="email" required value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label>Telefon</label>
                <input type="text" value={regData.phoneNumber} onChange={(e) => setRegData({...regData, phoneNumber: e.target.value})} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label>Unvan / Uzmanlık</label>
                <select 
                  value={regData.specialization} 
                  onChange={(e) => setRegData({...regData, specialization: e.target.value})} 
                  className={styles.input}
                  required
                >
                  <option value="">Unvan Seçiniz</option>
                  <option value="Pratisyen Hekim">Pratisyen Hekim</option>
                  <option value="Uzm. Dr.">Uzman Doktor (Uzm. Dr.)</option>
                  <option value="Op. Dr.">Operatör Doktor (Op. Dr.)</option>
                  <option value="Yrd. Doç. Dr.">Yardımcı Doçent (Yrd. Doç. Dr.)</option>
                  <option value="Doç. Dr.">Doçent Doktor (Doç. Dr.)</option>
                  <option value="Prof. Dr.">Profesör Doktor (Prof. Dr.)</option>
                  <option value="Asistan Dr.">Asistan Doktor</option>
                </select>
            </div>
            <div className={styles.inputGroup}>
                <label>Talep Edilen Şifre</label>
                <input type="password" required minLength="6" value={regData.password} onChange={(e) => setRegData({...regData, password: e.target.value})} className={styles.input} />
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
          </button>
        </form>

        <div className={styles.backLink} style={{marginTop: '1rem'}}>
            <button type="button" onClick={() => { setShowDoctorRegister(false); setError(''); }} className={styles.linkButton}>
              ← Giriş Ekranına Dön
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {loginType === null 
        ? renderInitialSelection() 
        : (showDoctorRegister ? renderDoctorRegisterForm() : renderLoginForm())}
    </div>
  );
}
