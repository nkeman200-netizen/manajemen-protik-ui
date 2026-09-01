import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { fetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import ActionMenu from '../components/ActionMenu';
import { ArchiveCardSkeleton } from '../components/SkeletonLoader';
import {
  FolderArchive, Plus, ExternalLink,
  Pencil, Trash2, Loader2, AlertCircle, X, Search, Folder
} from 'lucide-react';

const initialForm = { period_year: '', name: '', drive_url: '' };

export default function Archives() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const { data: responseData, error, isLoading, mutate } = useSWR('/api/archives', fetcher);
  
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArchive, setActiveArchive] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const archives = useMemo(() => Array.isArray(responseData) ? responseData : (responseData?.data || []), [responseData]);

  // Filter & Grouping Logic
  const groupedArchives = useMemo(() => {
    let filtered = archives;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || a.period_year.toLowerCase().includes(q));
    }

    return filtered.reduce((groups, archive) => {
      const period = archive.period_year || 'Periode Lainnya';
      if (!groups[period]) groups[period] = [];
      groups[period].push(archive);
      return groups;
    }, {});
  }, [archives, search]);

  const openModal = (archive = null) => {
    setActiveArchive(archive);
    setForm(archive ? { period_year: archive.period_year, name: archive.name, drive_url: archive.drive_url } : initialForm);
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveArchive(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      if (activeArchive) {
        await api.put(`/api/archives/${activeArchive.id}`, form);
        toast.success('Arsip berhasil diperbarui.');
      } else {
        await api.post('/api/archives', form);
        toast.success('Arsip berhasil ditambahkan.');
      }
      mutate();
      closeModal();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        toast.error(err.response.data.message || 'Validasi gagal.');
      } else {
        toast.error('Terjadi kesalahan pada server.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/archives/${deleteTarget.id}`);
      toast.success('Arsip berhasil dihapus.');
      mutate();
    } catch (err) {
      toast.error('Gagal menghapus arsip.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (error) return <div className="flex justify-center py-16"><AlertCircle className="h-10 w-10 text-red-500"/></div>;

  return (
    <div className="space-y-8 animate-slide-up-fade">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25">
            <FolderArchive className="h-5 w-5 text-white"/>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Arsip Organisasi</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pusat tautan penyimpanan Google Drive per periode.</p>
          </div>
        </div>

        {isAdmin && (
          <button onClick={() => openModal()} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30">
            <Plus className="h-4 w-4"/> Tambah Arsip
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-md">
        <div className="relative">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama folder atau periode..." className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
        </div>
      </div>

      {/* ARCHIVE GROUPS OR SKELETON */}
      {isLoading ? (
        <ArchiveCardSkeleton count={8} />
      ) : Object.keys(groupedArchives).length > 0 ? (
        Object.entries(groupedArchives).map(([period, items]) => (
          <div key={period} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{period}</h3>
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map(item => (
                <div key={item.id} className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  {/* Folder Clickable Area */}
                  <a href={item.drive_url} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center gap-3 overflow-hidden" title="Buka di Google Drive">
                    <Folder className="h-8 w-8 shrink-0 fill-blue-500/20 text-blue-500 transition-transform group-hover:scale-110"/>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.name}</p>
                      <p className="text-[10px] text-slate-400">G-Drive Link <ExternalLink className="inline h-2.5 w-2.5"/></p>
                    </div>
                  </a>

                  {/* Kebab Menu (Admin Only) */}
                  {isAdmin && (
                    <div className="shrink-0 ml-2">
                      <ActionMenu
                        items={[
                          {
                            label: 'Edit Info',
                            icon: Pencil,
                            iconColor: 'text-amber-500',
                            onClick: () => openModal(item),
                          },
                          {
                            label: 'Hapus Arsip',
                            icon: Trash2,
                            iconColor: 'text-rose-500',
                            isDanger: true,
                            onClick: () => setDeleteTarget(item),
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 dark:border-white/10">
          <FolderArchive className="h-12 w-12 text-slate-300 dark:text-slate-600"/>
          <p className="mt-2 text-sm font-medium text-slate-500">Tidak ada arsip ditemukan.</p>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT */}
      {modalOpen && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeArchive ? 'Edit Arsip' : 'Tambah Arsip'}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-lg dark:hover:bg-white/10"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Periode Kepengurusan *</label>
                <input type="text" value={form.period_year} onChange={e => setForm({...form, period_year: e.target.value})} placeholder="Contoh: 2026/2027" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 dark:bg-slate-800 dark:border-white/10 dark:text-white" />
                {errors.period_year && <p className="text-xs text-red-500 mt-1">{errors.period_year[0]}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Nama Arsip / Folder *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Contoh: Sertifikat Gemastik" required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 dark:bg-slate-800 dark:border-white/10 dark:text-white" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">URL Google Drive *</label>
                <input type="url" value={form.drive_url} onChange={e => setForm({...form, drive_url: e.target.value})} placeholder="https://drive.google.com/..." required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 dark:bg-slate-800 dark:border-white/10 dark:text-white" />
                {errors.drive_url && <p className="text-xs text-red-500 mt-1">{errors.drive_url[0]}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Batal</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin"/>} Simpan</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Hapus Arsip"
        message={`Yakin ingin menghapus arsip "${deleteTarget?.name}"? Tautan ke Drive akan hilang secara permanen dari sistem.`}
        confirmText="Hapus Permanen"
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
