import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
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
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'EEEE, d MMMM yyyy — HH:mm', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Meeting() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Meetings ---
  const meetingUrl = activeWorkspace
    ? activeWorkspace.id
      ? `/api/meetings?event_id=${activeWorkspace.id}&page=${page}`
      : `/api/meetings?page=${page}`
    : null;

  const {
    data: meetingsData,
    error: meetingsError,
    isLoading: meetingsLoading,
    mutate: mutateMeetings,
  } = useSWR(meetingUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus rapat ini?')) {
      try {
        await api.delete(`/api/meetings/${id}`);
        toast.success('Rapat berhasil dihapus.');
        mutateMeetings();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus rapat.');
      }
    }
  };

  // ==========================================
  // VIEW 1: DIRECTORY MODE (CARD DIRECTORY)
  // ==========================================
  if (!activeWorkspace) {
    if (eventsLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
            <p className="text-sm text-slate-400">Memuat direktori rapat...</p>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
            </div>
          </div>
        </div>
      );
    }

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Direktori Rapat & Notulensi</h1>
              <p className="text-xs text-slate-400">
                Pilih ruang kerja rapat umum BPH Pusat atau kepanitiaan event untuk mengelola agenda dan notulensi.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Rapat Umum BPH Pusat */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Rapat Umum BPH Pusat', type: 'global' });
              setPage(1);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-950/40 via-slate-900/70 to-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/60 hover:shadow-2xl hover:shadow-primary-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-400">
                    <CalendarClock className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400 border border-primary-500/20">
                    BPH Pusat
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                  Rapat Umum BPH Pusat
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Pencatatan dan arsip notulensi rapat umum BPH Pusat organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium text-primary-400">
                <span>Buka Ruang Kerja</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Cards: Event Workspaces */}
          {eventList.map((event) => {
            const sekretaris =
              event.committees?.find((c) => c.position === 'Sekretaris')?.user?.name ||
              'Belum Ditentukan';
            const dateDisplay = event.start_date || event.date;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveWorkspace(event);
                  setPage(1);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400 border border-primary-500/20">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span className="truncate">Sekretaris: {sekretaris}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium text-slate-400 group-hover:text-primary-400 transition-colors">
                    <span>Buka Ruang Kerja</span>
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE (MEETING TABLE)
  // ==========================================
  if (meetingsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
          <p className="text-sm text-slate-400">Memuat data rapat {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (meetingsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-300">Gagal memuat data rapat</p>
            <p className="mt-1 text-sm text-red-400/70">Terjadi kesalahan saat mengambil data rapat.</p>
          </div>
        </div>
      </div>
    );
  }

  const meetings = meetingsData?.data?.data || (Array.isArray(meetingsData?.data) ? meetingsData.data : []) || [];
  const meta = meetingsData?.meta || (meetingsData?.data && !Array.isArray(meetingsData?.data) ? meetingsData.data : null);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setActiveWorkspace(null);
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Direktori
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${
              activeWorkspace.id === null
                ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
                : 'bg-gradient-to-br from-blue-500 to-indigo-700 shadow-indigo-500/25'
            }`}
          >
            <CalendarClock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                    : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                {activeWorkspace.id === null ? 'BPH Pusat' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {meta?.total ?? meetings.length} rapat terdaftar
            </p>
          </div>
        </div>

        {/* Action: Add Button (Only if authorized) */}
        {canEdit && (
          <button
            onClick={() => {
              setSelectedMeeting(null);
              setIsReadOnlyModal(false);
              setModalOpen(true);
            }}
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
                  Link Notulensi
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {meetings.length > 0 ? (
                meetings.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-white/5">
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
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMeeting(item);
                              setIsReadOnlyModal(false);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedMeeting(item);
                              setIsReadOnlyModal(true);
                              setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    Belum ada data rapat untuk ruang kerja ini.
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
                disabled={page >= meta.last_page || !meetingsData?.links?.next}
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
        onClose={() => {
          setModalOpen(false);
          setSelectedMeeting(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateMeetings()}
        initialData={selectedMeeting}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />
    </div>
  );
}
