import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import MeetingModal from '../components/MeetingModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CalendarClock,
  ExternalLink,
} from 'lucide-react';

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'EEEE, d MMMM yyyy — HH:mm', { locale: localeID });
}

export default function Meeting() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const { data, error, isLoading, mutate } = useSWR(
    `/api/meetings?page=${page}`,
    paginatedFetcher
  );

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
          <p className="text-sm text-slate-400">Memuat data rapat...</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-400/70">Terjadi kesalahan saat mengambil data rapat.</p>
          </div>
        </div>
      </div>
    );
  }

  const meetings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <CalendarClock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Rapat</h1>
            <p className="text-xs text-slate-400">
              {meta?.total ?? 0} rapat terdaftar
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Rapat
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Judul Rapat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Notulensi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {meetings.length > 0 ? (
                meetings.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="max-w-xs truncate px-6 py-4 text-sm font-medium text-white">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                      {formatTanggalWaktu(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.minutes_url ? (
                        <a
                          href={item.minutes_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-400 transition hover:bg-primary-500/25"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Lihat
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500">
                    Belum ada data rapat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-xs text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !data?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <MeetingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
