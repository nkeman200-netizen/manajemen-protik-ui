import { useState, useEffect } from 'react';
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
  FileBadge,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
  Search,
  RefreshCw,
  MoreVertical,
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
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // --- Workspace Mode: Fetch Documents ---
  let documentUrl = null;
  if (activeWorkspace) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (activeWorkspace.id) {
      params.append('event_id', String(activeWorkspace.id));
    }
    if (debouncedSearch) {
      params.append('search', debouncedSearch);
    }
    documentUrl = `/api/documents?${params.toString()}`;
  }

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

  // --- Sync Handler ---
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const payload = activeWorkspace?.id ? { event_id: activeWorkspace.id } : {};
      const res = await api.post('/api/documents/sync', payload);
      toast.success(res.data.message || 'Sinkronisasi berhasil.');
      mutateDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal melakukan sinkronisasi.');
    } finally {
      setIsSyncing(false);
    }
  };

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
            <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat direktori dokumen...</p>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Dokumen & Surat</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih ruang kerja dokumen umum BPH Pusat atau kepanitiaan event untuk mengelola arsip surat.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up-fade">
          {/* Card: Dokumen Umum BPH Pusat */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Dokumen Umum BPH Pusat', type: 'global' });
              setPage(1);
              setSearch('');
              setDebouncedSearch('');
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-500/10 dark:from-violet-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-violet-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600 dark:text-violet-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-600 border border-violet-500/20 dark:text-violet-400">
                    BPH Pusat
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors dark:text-white dark:group-hover:text-violet-300">
                  Dokumen Umum BPH Pusat
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  Pencatatan dan arsip surat keluar umum BPH Pusat organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-violet-600 dark:border-white/10 dark:text-violet-400">
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
                  setSearch('');
                  setDebouncedSearch('');
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-slate-50/80 hover:shadow-xl hover:shadow-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-primary-300">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">Sekretaris: {sekretaris}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors dark:border-white/10 dark:text-slate-400 dark:group-hover:text-primary-400">
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
  if (documentsLoading && !documentsData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data dokumen {activeWorkspace.name}...</p>
        </div>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data dokumen</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data surat.</p>
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
            setSearch('');
            setDebouncedSearch('');
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-violet-500/15 text-violet-600 border border-violet-500/20 dark:text-violet-400'
                    : 'bg-primary-500/15 text-primary-600 border border-primary-500/20 dark:text-primary-400'
                }`}
              >
                {activeWorkspace.id === null ? 'BPH Pusat' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? documents.length} surat terdaftar
            </p>
          </div>
        </div>

        {/* Action: Sync & Add Buttons (Only if authorized) */}
        {canEdit && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100/70 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Cloud'}</span>
            </button>
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
          </div>
        )}
      </div>

      {/* Search Bar with Label */}
      <div className="max-w-md">
        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          Cari Dokumen / Surat
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor surat atau judul..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl animate-slide-up-fade dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* FIX: Menambahkan pb-32 dan min-h-[300px] agar dropdown menu aksi di baris terakhir tidak terpotong (clipping) */}
        <div className="overflow-x-auto pb-32 min-h-[300px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Nomor & Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Judul & Kegiatan
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Pembuat
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {documents.length > 0 ? (
                documents.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    {/* Kolom 1: Nomor & Tanggal Buat */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-mono font-bold text-slate-700 w-max dark:bg-slate-800 dark:text-slate-300">
                          {item.letter_number}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Dibuat: {formatTanggal(item.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 2: Judul & Tanggal Kegiatan */}
                    <td className="max-w-[200px] px-6 py-4">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      {item.activity_date && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary-600 dark:text-primary-400">
                          <Calendar className="h-3 w-3" />
                          Kegiatan: {formatTanggal(item.activity_date)}
                        </div>
                      )}
                    </td>

                    {/* Kolom 3: Pembuat */}
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {item.creator?.name ?? 'Sistem'}
                      </div>
                    </td>

                    {/* Kolom 4: Kebab Menu Aksi */}
                    <td className="relative whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                        }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openDropdownId === item.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-10 top-4 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-white/10 dark:bg-slate-800"
                        >
                          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Tautan Dokumen
                          </div>

                          {item.letter_link && (
                            <a
                              href={item.letter_link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                            >
                              <FileText className="h-4 w-4 text-blue-500" /> Draft Surat (Word)
                            </a>
                          )}

                          {item.scan_link && (
                            <a
                              href={item.scan_link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                            >
                              <FileBadge className="h-4 w-4 text-red-500" /> Scan Valid (PDF)
                            </a>
                          )}

                          <div className="my-1 h-px bg-slate-100 dark:bg-white/10"></div>
                          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Aksi Data
                          </div>

                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              setSelectedDocument(item);
                              setIsReadOnlyModal(!canEdit);
                              setModalOpen(true);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                          >
                            {canEdit ? (
                              <>
                                <Pencil className="h-4 w-4 text-amber-500" /> Edit Metadata
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 text-indigo-500" /> Detail Surat
                              </>
                            )}
                          </button>

                          {canEdit && (
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                handleDelete(item.id);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" /> Hapus Surat
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data dokumen untuk ruang kerja ini.
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
                disabled={page >= meta.last_page || !documentsData?.links?.next}
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
