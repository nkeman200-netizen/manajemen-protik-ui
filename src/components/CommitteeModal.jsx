import { useState } from 'react';
import useSWR from 'swr';
import { X, Loader2, Plus, Trash2, Users, UserCheck } from 'lucide-react';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';

const POSITIONS = ['Ketua', 'Bendahara', 'Sekretaris'];

export default function CommitteeModal({ isOpen, onClose, event }) {
  const [userId, setUserId] = useState('');
  const [position, setPosition] = useState('Ketua');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch users for dropdown
  const { data: usersData, isLoading: usersLoading } = useSWR(
    isOpen ? '/api/users?page=1' : null,
    paginatedFetcher
  );

  // Fetch committees for this event
  const committeeUrl = isOpen && event?.id ? `/api/event-committees?event_id=${event.id}` : null;
  const {
    data: committeeData,
    isLoading: committeeLoading,
    mutate: mutateCommittee,
  } = useSWR(committeeUrl, paginatedFetcher);

  if (!isOpen || !event) return null;

  const usersList =
    usersData?.data?.data || (Array.isArray(usersData?.data) ? usersData.data : []) || [];
  const committeesList =
    committeeData?.data?.data ||
    (Array.isArray(committeeData?.data) ? committeeData.data : []) ||
    [];

  const handleAddCommittee = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Silakan pilih anggota terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        event_id: event.id,
        user_id: Number(userId),
        position,
      };

      await api.post('/api/event-committees', payload);
      toast.success('Panitia berhasil ditambahkan.');
      setUserId('');
      setPosition('Ketua');
      mutateCommittee();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan panitia.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCommittee = async (id) => {
    if (window.confirm('Yakin ingin menghapus panitia ini?')) {
      setDeletingId(id);
      try {
        await api.delete(`/api/event-committees/${id}`);
        toast.success('Panitia berhasil dihapus.');
        mutateCommittee();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus panitia.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Ketua':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      case 'Bendahara':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'Sekretaris':
        return 'bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-400';
      default:
        return 'bg-primary-500/15 text-primary-600 border-primary-500/20 dark:text-primary-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/25">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kelola Panitia Event
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{event.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-5">
          {/* Fitur 1: Form Injeksi Panitia */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary-500" />
              Injeksi Panitia Baru
            </h3>
            <form onSubmit={handleAddCommittee} className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
              {/* Select User */}
              <div className="sm:col-span-6">
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Pilih Anggota
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={usersLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                >
                  <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {usersLoading ? 'Memuat anggota...' : '-- Pilih Anggota --'}
                  </option>
                  {usersList.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                    >
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Position */}
              <div className="sm:col-span-4">
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Jabatan
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                >
                  {POSITIONS.map((pos) => (
                    <option
                      key={pos}
                      value={pos}
                      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                    >
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting || usersLoading}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Tambah</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Fitur 2: Daftar Panitia Terdaftar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Daftar Panitia Terdaftar ({committeesList.length})
            </h3>

            {committeeLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  Memuat data panitia...
                </span>
              </div>
            ) : committeesList.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Nama Anggota
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Jabatan
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {committeesList.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {item.user?.name || item.user_name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {item.user?.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${getPositionBadge(
                              item.position
                            )}`}
                          >
                            {item.position}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteCommittee(item.id)}
                            disabled={deletingId === item.id}
                            title="Hapus Panitia"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-40 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400 dark:border-white/10 dark:text-slate-500">
                Belum ada panitia yang ditugaskan pada event ini.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
