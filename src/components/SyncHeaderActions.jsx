import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { RefreshCw } from 'lucide-react';

/**
 * Format timestamp menjadi format jam dan tanggal yang mudah dibaca.
 */
function formatSyncTime(timestamp) {
  if (!timestamp) return null;
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return null;
    return format(d, 'dd MMM, HH:mm', { locale: localeID });
  } catch {
    return null;
  }
}

/**
 * Komponen Header Aksi Sinkronisasi Konsisten untuk semua modul integrasi Google Sheets.
 *
 * @param {Object} props
 * @param {Function} [props.onSync] - Handler saat tombol Sinkronisasi diklik
 * @param {boolean} [props.isSyncing] - Status loading sinkronisasi
 * @param {string|Date} [props.lastSyncedAt] - Waktu sinkronisasi terakhir (dari DB/API)
 * @param {boolean} [props.canSync=true] - Hak akses untuk melakukan sinkronisasi
 * @param {React.ReactNode} [props.children] - Tombol aksi tambahan (cth: Ekspor LPJ, Dapur Surat)
 */
export default function SyncHeaderActions({
  onSync,
  isSyncing = false,
  lastSyncedAt = null,
  canSync = true,
  children,
}) {
  const formattedTime = formatSyncTime(lastSyncedAt);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* 1. SINKRONISASI CLOUD */}
      {canSync && onSync && (
        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-600 dark:text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Cloud'}</span>
        </button>
      )}

      {/* 2. TOMBOL TAMBAHAN (SEPERTI EKSPOR LPJ / DAPUR SURAT) */}
      {children}

      {/* 3. LIVE SYNC BADGE / STATUS KONEKSI SERVER */}
      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {formattedTime ? (
          <span className="text-[11px]">
            <span className="text-slate-400 dark:text-slate-500">Sync: </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{formattedTime}</span>
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Terhubung Cloud
          </span>
        )}
      </div>
    </div>
  );
}
