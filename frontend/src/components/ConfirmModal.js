import React from 'react';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ 
  isOpen, 
  title = "Onay Bekliyor", 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Evet", 
  cancelText = "İptal",
  type = "danger" // "danger" (red), "approve" (green)
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className={styles.modalIcon}>
          {type === 'approve' ? '✅' : '⚠️'}
        </div>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalBody}>{message}</p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={type === 'approve' ? styles.modalApproveBtn : styles.modalDangerBtn} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
