'use client';
import { useSettings } from '../../context/SettingsContext';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { language, changeLanguage, themeColor, applyThemeColor, t, THEMES, LANGUAGES } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('settings')}</h1>
      </div>

      <div className={styles.settingsGrid}>
        
        {/* Dil Ayarı */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🌐</div>
            <div>
              <h2 className={styles.sectionTitle}>{t('language_title')}</h2>
              <p className={styles.sectionDesc}>{t('language_desc')}</p>
            </div>
          </div>
          
          <div className={styles.langGrid}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                className={`${styles.langBtn} ${language === lang.id ? styles.activeLang : ''}`}
                onClick={() => changeLanguage(lang.id)}
              >
                <span className={styles.flag}>{lang.flag}</span>
                <span className={styles.langName}>{lang.name}</span>
                {language === lang.id && (
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Tema Ayarı */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🎨</div>
            <div>
              <h2 className={styles.sectionTitle}>{t('theme_title')}</h2>
              <p className={styles.sectionDesc}>{t('theme_desc')}</p>
            </div>
          </div>
          
          <div className={styles.themeGrid}>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`${styles.themeBtn} ${themeColor === theme.id ? styles.activeTheme : ''}`}
                onClick={() => applyThemeColor(theme.id)}
                title={t(`theme_${theme.id}`)}
              >
                <div 
                  className={styles.colorSwatch} 
                  style={{ background: `linear-gradient(135deg, ${theme.hex}, ${theme.hover})` }}
                />
                <span className={styles.themeName}>{t(`theme_${theme.id}`)}</span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
