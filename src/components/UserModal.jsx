import { useState, useEffect } from 'react';
import { X, Loader2, UserCog } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'admin', label: 'Admin (BPH Pusat)' },
  { value: 'member', label: 'Member (Anggota Biasa)' },
  { value: 'advisor', label: 'Advisor (Pembina / Demisioner)' },
];

const STATUSES = [
  { value: 'active', label: 'Aktif (Active)' },
  { value: 'suspended', label: 'Suspended (Nonaktif)' },
];

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  divisions = [],
}) {
  const [divisionId, setDivisionId] = useState('');
  const [role, setRole] = useState('member');
  const [status, setStatus] = useState('active');
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDivisionId(initialData.division_id ?? '');
      setRole(initialData.roles?.[0]?.name || 'member');
      setStatus(initialData.status || 'active');
      setIsCoordinator(initialData.is_coordinator || false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        division_id: divisionId ? Number(divisionId) : null,
        role,
        status,
        is_coordinator: isCoordinator,
      };

      await api.put(`/api/users/${initialData.id}`, payload);
      toast.success(`Data pengguna ${initialData.name} berhasil diperbarui.`);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) toast.error(data.message);
        if (data.errors) setErrors(data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Gagal memperbarui pengguna.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 dark:bg-white/5 dark:text-white ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
              <UserCog className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Data Anggota
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ubah divisi, hak akses (role), atau status akun anggota.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Preview */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {initialData.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {initialData.email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Division */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Divisi Organisasi
            </label>
            <select
              value={divisionId}
              onChange={(e) => setDivisionId(e.target.value)}
              className={inputClass('division_id')}
            >
              <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                -- Tanpa Divisi (BPH Inti / Umum) --
              </option>
              {divisions.map((div) => (
                <option
                  key={div.id}
                  value={div.id}
                  className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                >
                  {div.name}
                </option>
              ))}
            </select>
            {errors.division_id && (
              <p className="mt-1 text-xs text-red-400">{errors.division_id[0]}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hak Akses (Role)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass('role')}
            >
              {ROLES.map((r) => (
                <option
                  key={r.value}
                  value={r.value}
                  className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                >
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-400">{errors.role[0]}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status Akun
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass('status')}
            >
              {STATUSES.map((s) => (
                <option
                  key={s.value}
                  value={s.value}
                  className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                >
                  {s.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-400">{errors.status[0]}</p>
            )}
          </div>

          {/* Status Koordinator */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Koordinator Divisi
              </label>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Tandai jika anggota ini adalah ketua/koordinator dari divisi yang dipilih.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isCoordinator}
                onChange={(e) => setIsCoordinator(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 dark:bg-slate-700 dark:border-slate-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
