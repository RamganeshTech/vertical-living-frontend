import React, { useEffect } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string; // Allows overriding width like 'w-[400px]' or 'max-w-2xl'
  actions?: React.ReactNode; // Optional actions rendered next to the close button
  closeOnEsc?: boolean; // Defaults to true, can be disabled per usage

}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, children ,

  width = "w-full sm:w-[450px] md:w-[500px]",
  actions,
  closeOnEsc = true,
}) => {
  // Close on Escape key
  // useEffect(() => {
  //   const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  //   window.addEventListener('keydown', handleEsc);
  //   return () => window.removeEventListener('keydown', handleEsc);
  // }, [onClose]);

   // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close on Escape key (ported from SidePanel)
  useEffect(() => {
    if (!closeOnEsc) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, closeOnEsc]);


  // return (
  //   <>
  //     <div 
  //       className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
  //         isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  //       }`}
  //       onClick={onClose}
  //     />
      
  //     <div 
  //       className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
  //         isOpen ? 'translate-x-0' : 'translate-x-full'
  //       }`}
  //     >
  //       <div className="flex flex-col h-full">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-100">
  //           <h2 className="text-xl font-bold text-blue-900">{title}</h2>
  //           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
  //             <i className="fa-solid fa-xmark text-gray-500"></i>
  //           </button>
  //         </div>
  //         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
  //           {children}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );



  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-foreground/80 backdrop-blur-lg z-[9990] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      />

      {/* Modal Panel (Sliding from Right) */}
      <div
        className={`fixed top-0 right-0 h-full bg-brand-surface shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${width} border-l-2 border-ash-medium ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ash-medium bg-surface">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>

          <div className="flex items-center gap-3">
            {actions && <div className="flex items-center">{actions}</div>}

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-content-muted hover:bg-background hover:text-content transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-mainBg">
          {children}
        </div>
      </div>
    </>
  );
};