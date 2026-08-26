import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Ya, Lanjutkan', 
  cancelText = 'Batal',
  isLoading = false,
  isDanger = true 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={!isLoading ? onClose : undefined} />
      
      {/* Modal Card */}
      <div className="relative z-10 mx-4 w-full max-w-sm scale-100 transform overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all animate-slide-up-fade dark:border-white/10 dark:bg-slate-900">
        
        {/* Close Button */}
        {!isLoading && (
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300">
            <X className="h-5 w-5"/>
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isDanger ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500' : 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500'}`}>
            <AlertTriangle className="h-8 w-8"/>
          </div>

          {/* Text */}
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              onClick={onConfirm} 
              disabled={isLoading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 ${isDanger ? 'bg-red-600 hover:bg-red-500 shadow-red-500/25' : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/25'}`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : null}
              {isLoading ? 'Memproses...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
