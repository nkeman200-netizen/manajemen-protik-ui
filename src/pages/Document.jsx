import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import DocumentModal from '../components/DocumentModal';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
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

export default function Document() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Documents ---
  const documentUrl = activeWorkspace
    ? activeWorkspace.id
      ? `/api/documents?event_id=${activeWorkspace.id}&page=${page}`
      : `/api/documents?page=${page}`
    : null;

  const {
    data: documentsData,
    error: documentsError,
    isLoading: documentsLoading,
    mutate: mutateDocuments,
  } = useSWR(documentUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus dokumen ini?')) {
      try {
        await api.delete(`/api/documents/${id}`);
        toast.success('Surat berhasil dihapus.');
        mutateDocuments();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus surat.');
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
            <p className="text-sm text-slate-400">Memuat direktori dokumen...</p>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Direktori Dokumen & Surat</h1>
              <p className="text-xs text-slate-400">
                Pilih ruang kerja dokumen umum BPH Pusat atau kepanitiaan event untuk mengelola arsip surat.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card: Dokumen Umum BPH Pusat */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Dokumen Umum BPH Pusat', type: 'global' });
              setPage(1);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900/70 to-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-2xl hover:shadow-violet-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-violet-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400 border border-violet-500/20">
                    BPH Pusat
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  Dokumen Umum BPH Pusat
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Pencatatan dan arsip surat keluar umum BPH Pusat organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium text-violet-400">
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
  // VIEW 2: WORKSPACE MODE (DOCUMENT TABLE)
  // ==========================================
  if (documentsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
          <p className="text-sm text-slate-400">Memuat data dokumen {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-300">Gagal memuat data dokumen</p>
            <p className="mt-1 text-sm text-red-400/70">Terjadi kesalahan saat mengambil data surat.</p>
          </div>
        </div>
      </div>
    );
  }

  const documents = documentsData?.data?.data || (Array.isArray(documentsData?.data) ? documentsData.data : []) || [];
  const meta = documentsData?.meta || (documentsData?.data && !Array.isArray(documentsData?.data) ? documentsData.data : null);

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
                ? 'bg-gradient-to-br from-violet-500 to-violet-700 shadow-violet-500/25'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
            }`}
          >
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
                    : 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                }`}
              >
                {activeWorkspace.id === null ? 'BPH Pusat' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {meta?.total ?? documents.length} surat terdaftar
            </p>
          </div>
        </div>

        {/* Action: Add Button (Only if authorized) */}
        {canEdit && (
          <button
            onClick={() => {
              setSelectedDocument(null);
              setIsReadOnlyModal(false);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Plus className="h-4 w-4" />
            Tambah Surat
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
                  Nomor Surat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Judul
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pembuat
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Link Drive
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.length > 0 ? (
                documents.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-lg bg-slate-700/50 px-2.5 py-1 text-xs font-mono font-semibold text-slate-200">
                        {item.letter_number}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm font-medium text-white">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                      {item.creator?.name ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.drive_url ? (
                        <a
                          href={item.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/15 px-2.5 py-1 text-xs font-semibold text-primary-400 transition hover:bg-primary-500/25"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Buka
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
                              setSelectedDocument(item);
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
                              setSelectedDocument(item);
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
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                    Belum ada data dokumen untuk ruang kerja ini.
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
                disabled={page >= meta.last_page || !documentsData?.links?.next}
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
      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDocument(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateDocuments()}
        currentUserId={user?.id}
        initialData={selectedDocument}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />
    </div>
  );
}
