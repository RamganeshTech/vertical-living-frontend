import React, { useEffect, useMemo } from 'react';
import styles from './customAlert.module.css';

type ToastProps = {
  message: string;
  type: 'success' | 'warning';
  onClose: () => void;
};

const CustomAlert: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

   const iconClass = useMemo(()=> type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation', [type]);


  return (
    <div className={styles.toastWrapper}>
      <div className={`${styles.toast} ${styles[type]}`}>
        <i className={`${iconClass} ${styles.icon}`}></i>
        <span className={styles.message}>{message}</span>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
