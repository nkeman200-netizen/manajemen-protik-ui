import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import WarningModal from '../components/WarningModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Warning() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const { data, error, isLoading, mutate } = useSWR(
    `/api/warnings?page=${page}`,
    paginatedFetcher
  );

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data peringatan...</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data peringatan.</p>
          </div>
        </div>
      </div>
    );
  }

  const warnings = data?.data?.data || (Array.isArray(data?.data) ? data.data : []) || [];
  const meta = data?.meta || (data?.data && !Array.isArray(data?.data) ? data.data : null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/25">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Surat Peringatan</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? warnings.length} peringatan terdaftar
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Peringatan
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nama Anggota
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Alasan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Dikeluarkan Oleh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {warnings.length > 0 ? (
                warnings.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatTanggal(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.user?.name ?? '-'}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {item.reason}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {item.admin?.name ?? '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data peringatan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !data?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <WarningModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
        currentUserId={user?.id}
      />
    </div>
  );
}
