import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'modal' }) => {
  // Listen for Escape key to close the modal/drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDrawer = type === 'drawer';
  const overlayClass = isDrawer ? 'drawer-overlay' : 'modal-overlay';
  const contentClass = isDrawer ? 'drawer-content' : 'modal-content';
  const headerClass = isDrawer ? 'drawer-header' : 'modal-header';
  const bodyClass = isDrawer ? 'drawer-body' : 'modal-body';
  const footerClass = isDrawer ? 'drawer-footer' : 'modal-footer';

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className={contentClass} onClick={(e) => e.stopPropagation()}>
        <div className={headerClass}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-family-heading)' }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              padding: '4px'
            }}
          >
            &times;
          </button>
        </div>
        <div className={bodyClass}>
          {children}
        </div>
        {footer && (
          <div className={footerClass}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

