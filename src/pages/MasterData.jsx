import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import UsersIndex from './UsersIndex';
import DivisionModal from '../components/DivisionModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Database,
  Users,
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Shield,
  X,
} from 'lucide-react';

export default function MasterData() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [divPage, setDivPage] = useState(1);
  const [posPage, setPosPage] = useState(1);

  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positionForm, setPositionForm] = useState({ name: '', is_bph: false });
  const [positionErrors, setPositionErrors] = useState({});
  const [positionSubmitting, setPositionSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'division' or 'position'
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.roles?.some((r) => r.name === 'admin');

  // Fetch Divisions (paginated for Tab 2 - Admin only)
  const {
    data: divisionsData,
    error: divisionsError,
    isLoading: divisionsLoading,
    mutate: mutateDivisions,
  } = useSWR(isAdmin ? `/api/divisions?page=${divPage}` : null, paginatedFetcher);

  // Fetch Committee Positions (paginated for Tab 3 - Admin only)
  const {
    data: positionsData,
    error: positionsError,
    isLoading: positionsLoading,
    mutate: mutatePositions,
  } = useSWR(isAdmin ? `/api/committee-positions?page=${posPage}` : null, paginatedFetcher);

  const divisionsList =
    divisionsData?.data?.data || (Array.isArray(divisionsData?.data) ? divisionsData.data : []) || [];
  const divMeta =
    divisionsData?.meta ||
    (divisionsData?.data && !Array.isArray(divisionsData?.data) ? divisionsData.data : null);

  const positionsList =
    positionsData?.data?.data ||
    (Array.isArray(positionsData?.data) ? positionsData.data : (Array.isArray(positionsData) ? positionsData : [])) ||
    [];
  const posMeta =
    positionsData?.meta ||
    (positionsData?.data && !Array.isArray(positionsData?.data) ? positionsData.data : null);

  // Single Combined Delete Handler
  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteType === 'division') {
        await api.delete(`/api/divisions/${deleteTarget.id}`);
        mutateDivisions();
      } else {
        await api.delete(`/api/committee-positions/${deleteTarget.id}`);
        mutatePositions();
      }
      toast.success('Data berhasil dihapus.');
    } catch {
      toast.error('Gagal menghapus data.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const closePositionModal = () => {
    setPositionModalOpen(false);
    setSelectedPosition(null);
    setPositionForm({ name: '', is_bph: false });
    setPositionErrors({});
  };

  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    setPositionSubmitting(true);
    setPositionErrors({});

    try {
      if (selectedPosition) {
        await api.put(`/api/committee-positions/${selectedPosition.id}`, {
          name: positionForm.name,
          is_bph: Boolean(positionForm.is_bph),
        });
        toast.success('Jabatan kepanitiaan berhasil diperbarui.');
      } else {
        await api.post('/api/committee-positions', {
          name: positionForm.name,
          is_bph: Boolean(positionForm.is_bph),
        });
        toast.success('Jabatan kepanitiaan berhasil ditambahkan.');
      }
      mutatePositions();
      closePositionModal();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setPositionErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
      }
    } finally {
      setPositionSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/25">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Master Data Organisasi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kelola data seluruh anggota, struktur divisi, dan jabatan kepanitiaan.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-slate-200 pb-3 custom-scrollbar dark:border-white/10">
        {/* Tab 1: Selalu tampil */}
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'users'
              ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Daftar Anggota</span>
        </button>

        {/* Tab 2 & 3: Hanya untuk Admin */}
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('divisions')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'divisions'
                  ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>Struktur Divisi</span>
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
                {divMeta?.total ?? divisionsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('positions')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'positions'
                  ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Jabatan Panitia</span>
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
                {posMeta?.total ?? positionsList.length}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Body Content */}
      <div className="mt-6">
        {/* Tab 1: Selalu tampil */}
        {activeTab === 'users' && <UsersIndex />}

        {/* Tab 2: Khusus Admin */}
        {isAdmin && activeTab === 'divisions' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedDivision(null);
                  setDivisionModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30"
              >
                <Plus className="h-4 w-4" />
                Tambah Divisi
              </button>
            </div>

            {divisionsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : divisionsError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-red-50 p-6 dark:bg-red-500/10">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Gagal memuat data divisi.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Nama Divisi
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {divisionsList.length > 0 ? (
                        divisionsList.map((item) => (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                  <FolderTree className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedDivision(item);
                                    setDivisionModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(item);
                                    setDeleteType('division');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                          >
                            Belum ada divisi terdaftar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Division Pagination */}
                {divMeta && divMeta.last_page > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Halaman {divMeta.current_page} dari {divMeta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDivPage((p) => Math.max(1, p - 1))}
                        disabled={divPage === 1}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <button
                        onClick={() => setDivPage((p) => p + 1)}
                        disabled={divPage >= divMeta.last_page || !divisionsData?.links?.next}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Khusus Admin */}
        {isAdmin && activeTab === 'positions' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedPosition(null);
                  setPositionForm({ name: '', is_bph: false });
                  setPositionErrors({});
                  setPositionModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30"
              >
                <Plus className="h-4 w-4" />
                Tambah Jabatan
              </button>
            </div>

            {positionsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : positionsError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-red-50 p-6 dark:bg-red-500/10">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Gagal memuat data jabatan kepanitiaan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Nama Jabatan
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Hak Akses Event (BPH)
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {positionsList.length > 0 ? (
                        positionsList.map((item) => (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                                  <Shield className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.is_bph ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-primary-500/20 bg-primary-500/15 px-2.5 py-0.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
                                  <Shield className="h-3.5 w-3.5" />
                                  Akses BPH Event
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                                  Anggota Biasa
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedPosition(item);
                                    setPositionForm({
                                      name: item.name,
                                      is_bph: Boolean(item.is_bph),
                                    });
                                    setPositionErrors({});
                                    setPositionModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(item);
                                    setDeleteType('position');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                          >
                            Tidak ada data jabatan kepanitiaan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Position Pagination */}
                {posMeta && posMeta.last_page > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Halaman {posMeta.current_page} dari {posMeta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPosPage((p) => Math.max(1, p - 1))}
                        disabled={posPage === 1}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <button
                        onClick={() => setPosPage((p) => p + 1)}
                        disabled={posPage >= posMeta.last_page || !positionsData?.links?.next}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Division CRUD Modal (Admin Only) */}
      {isAdmin && (
        <DivisionModal
          isOpen={divisionModalOpen}
          onClose={() => {
            setDivisionModalOpen(false);
            setSelectedDivision(null);
          }}
          onSuccess={() => mutateDivisions()}
          initialData={selectedDivision}
        />
      )}

      {/* MODAL TAMBAH/EDIT JABATAN KEPANITIAAN (Admin Only) */}
      {isAdmin && positionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePositionModal} />
          
          <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedPosition ? 'Edit Jabatan' : 'Tambah Jabatan'}
              </h2>
              <button
                onClick={closePositionModal}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePositionSubmit} className="p-6 space-y-6">
              {/* Nama Jabatan */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nama Jabatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={positionForm.name}
                  onChange={(e) => setPositionForm({ ...positionForm, name: e.target.value })}
                  placeholder="Contoh: Ketua Pelaksana"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    positionErrors.name
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
                  }`}
                  required
                />
                {positionErrors.name && (
                  <p className="mt-1.5 text-xs text-rose-500">{positionErrors.name[0]}</p>
                )}
              </div>

              {/* Toggle Hak Akses BPH */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <Shield
                    className={`h-5 w-5 mt-0.5 shrink-0 ${
                      positionForm.is_bph ? 'text-primary-500' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Hak Akses Event (BPH)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Izinkan jabatan ini memanipulasi data Agenda, Keuangan, dan Dokumen di dalam Event.
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() =>
                    setPositionForm({ ...positionForm, is_bph: !positionForm.is_bph })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    positionForm.is_bph ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      positionForm.is_bph ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {positionErrors.is_bph && (
                <p className="mt-1 text-xs text-rose-500">{positionErrors.is_bph[0]}</p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePositionModal}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={positionSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-500 disabled:opacity-50 transition-all"
                >
                  {positionSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {positionSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal (Admin Only) */}
      {isAdmin && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={executeDelete}
          title="Hapus Data Master"
          message={`Yakin ingin menghapus "${deleteTarget?.name}"?`}
          confirmText="Hapus Permanen"
          isLoading={isDeleting}
          isDanger={true}
        />
      )}
    </div>
  );
}
