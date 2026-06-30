'use client';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        {/* İleride buraya arama çubuğu gelebilir */}
      </div>
      <div className={styles.profile}>
        <div className={styles.avatar}>A</div>
        <div className={styles.info}>
          <span className={styles.name}>Admin Kullanıcı</span>
          <span className={styles.role}>Yönetici</span>
        </div>
      </div>
    </header>
  );
}
