'use client';
import { useState, useEffect } from 'react';
import styles from './Toast.module.css';

export const toast = {
  success: (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'success' } }));
  },
  error: (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'error' } }));
  },
  info: (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'info' } }));
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShow = (e) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...e.detail }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== id));
      }, 4000); // 4 saniye sonra kaybolur
    };

    window.addEventListener('show-toast', handleShow);
    return () => window.removeEventListener('show-toast', handleShow);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]} ${styles.slideIn}`}>
          <div className={styles.icon}>
            {t.type === 'success' && '✅'}
            {t.type === 'error' && '⚠️'}
            {t.type === 'info' && 'ℹ️'}
          </div>
          <div className={styles.message}>
            {/* Mesaj içinde \n varsa alt satıra geçmesi için split ediyoruz */}
            {t.message.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < t.message.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
