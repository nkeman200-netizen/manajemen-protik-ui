import { useState, useMemo, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { X, Loader2, Search, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { fetcher } from '../api/fetcher';
import toast from 'react-hot-toast';

const initialForm = {
  user_id: '',
  reason: '',
  date: '',
};

export default function WarningModal({ isOpen, onClose, onSuccess, currentUserId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // --- SMART COMBOBOX STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Eager fetching data users
  const { data: usersData, isLoading: usersLoading } = useSWR(isOpen ? '/api/users?all=true' : null, fetcher);
  const allUsers = useMemo(() => (Array.isArray(usersData) ? usersData : (usersData?.data || [])), [usersData]);

  // Handle klik di luar dropdown untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // --- COMBOBOX LOGIC ---
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    setForm((prev) => ({ ...prev, user_id: '' })); // Reset ID jika user mengetik ulang
    setErrors((prev) => ({ ...prev, user_id: undefined }));
  };

  const selectUser = (user) => {
    setSearchQuery(user.name);
    setForm((prev) => ({ ...prev, user_id: user.id }));
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, user_id: undefined }));
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter((u) => u.name?.toLowerCase().includes(q) || String(u.nim || '').includes(q));
  }, [allUsers, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi manual Combobox
    if (!form.user_id) {
      setErrors((prev) => ({ ...prev, user_id: ['Pilih anggota dari daftar pencarian.'] }));
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        admin_id: currentUserId,
        user_id: Number(form.user_id),
        reason: form.reason,
        date: form.date,
      };

      await api.post('/api/warnings', payload);
      toast.success('Surat peringatan berhasil ditambahkan.');

      // Reset State
      setForm(initialForm);
      setSearchQuery('');

      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) toast.error(data.message);
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) toast.error(firstError);
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tambah Surat Peringatan</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5 overflow-visible">
          {/* COMBOBOX: Cari Pengurus */}
          <div className="relative" ref={dropdownRef}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pilih Anggota
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder={usersLoading ? 'Memuat data anggota...' : 'Ketik nama atau NIM...'}
                disabled={usersLoading}
                className={`pl-10 ${inputClass('user_id')}`}
              />
              {usersLoading ? (
                <Loader2 className="absolute left-3 top-3 h-4 w-4 animate-spin text-primary-500" />
              ) : (
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              )}
            </div>
            {errors.user_id && <p className="mt-1 text-xs text-red-400">{errors.user_id[0]}</p>}

            {/* Dropdown List */}
            {showDropdown && !usersLoading && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-slate-800">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => selectUser(user)}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/5 ${
                        form.user_id === user.id ? 'bg-primary-50 dark:bg-primary-500/10' : ''
                      }`}
                    >
                      <div>
                        <p
                          className={`font-medium ${
                            form.user_id === user.id
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {user.name}
                        </p>
                        {user.nim && <p className="text-[10px] text-slate-500">{user.nim}</p>}
                      </div>
                      {form.user_id === user.id && <CheckCircle2 className="h-4 w-4 text-primary-500" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-sm text-slate-500">Anggota tidak ditemukan.</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alasan Peringatan
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Tuliskan alasan surat peringatan..."
              rows={4}
              className={inputClass('reason') + ' resize-none'}
            />
            {errors.reason && <p className="mt-1 text-xs text-red-400">{errors.reason[0]}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
          </div>

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
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
