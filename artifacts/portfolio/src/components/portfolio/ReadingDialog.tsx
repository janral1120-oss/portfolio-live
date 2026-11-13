import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function ReadingDialog({ title, closeLabel, onClose, drawer, children }: {
  title: string; closeLabel: string; onClose: () => void; drawer?: boolean; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previous;
    };
  }, []);
  return <dialog ref={ref} aria-label={title} className={drawer ? 'reading-dialog drawer' : 'reading-dialog viewer'}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-page">
      <div className="dialog-bar"><button type="button" aria-label={closeLabel} onClick={onClose}><X size={20}/></button></div>
      {children}
    </div>
  </dialog>;
}
