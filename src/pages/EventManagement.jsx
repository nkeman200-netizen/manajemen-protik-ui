import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import EventModal from '../components/EventModal';
import CommitteeModal from '../components/CommitteeModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  CalendarRange,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Users,
  Pencil,
  Trash2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function EventManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [committeeModalOpen, setCommitteeModalOpen] = useState(false);
  const [committeeTargetEvent, setCommitteeTargetEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
    mutate: mutateEvents,
  } = useSWR(isAdmin ? `/api/events?page=${page}` : null, paginatedFetcher);

  // RBAC Access Control Guard
  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-8 text-center dark:bg-red-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Akses Ditolak</h2>
            <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
              Halaman ini hanya dapat diakses oleh Administrator BPH Pusat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (eventsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat manajemen event...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (eventsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-6 dark:bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat event</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">
              Terjadi kesalahan saat mengambil daftar event dari server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const eventsList =
    eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];
  const meta =
    eventsData?.meta ||
    (eventsData?.data && !Array.isArray(eventsData?.data) ? eventsData.data : null);

  const executeDeleteEvent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/events/${deleteTarget.id}`);
      toast.success('Event berhasil dihapus.');
      mutateEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus event.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <CalendarRange className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Manajemen Event</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? eventsList.length} event terdaftar dalam sistem
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedEvent(null);
            setEventModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
        >
          <Plus className="h-4 w-4" />
          Tambah Event
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nama Event
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal Pelaksanaan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Anggaran Disetujui
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {eventsList.length > 0 ? (
                eventsList.map((item) => {
                  const startDate = item.start_date || item.date;
                  const endDate = item.end_date;

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      {/* Name & Description */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          )}
                          {item.drive_folder_url && (
                            <a
                              href={item.drive_folder_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-400"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Folder Drive
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Date Range */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span>
                            {formatTanggal(startDate)}
                            {endDate && ` — ${formatTanggal(endDate)}`}
                          </span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(item.budget_approved)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Panitia Button */}
                          <button
                            onClick={() => {
                              setCommitteeTargetEvent(item);
                              setCommitteeModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Panitia
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedEvent(item);
                              setEventModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    Belum ada data event terdaftar.
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
                disabled={page >= meta.last_page || !eventsData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Event CRUD Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={() => mutateEvents()}
        initialData={selectedEvent}
      />

      {/* Committee Injection Modal */}
      <CommitteeModal
        isOpen={committeeModalOpen}
        onClose={() => {
          setCommitteeModalOpen(false);
          setCommitteeTargetEvent(null);
        }}
        event={committeeTargetEvent}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDeleteEvent}
        title="Hapus Event"
        message={`Yakin ingin menghapus event "${deleteTarget?.name}" beserta data terkaitnya?`}
        confirmText="Hapus Permanen"
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
