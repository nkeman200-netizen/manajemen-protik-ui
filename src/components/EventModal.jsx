import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  abbreviation: '',
  description: '',
  budget_approved: '',
  drive_folder_url: '',
  start_date: '',
  end_date: '',
  agenda_sync_url: '',
  document_sync_url: '',
  finance_sync_url: '',
};

export default function EventModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        abbreviation: initialData.abbreviation || '',
        description: initialData.description || '',
        budget_approved: initialData.budget_approved ?? '',
        drive_folder_url: initialData.drive_folder_url || '',
        start_date: initialData.start_date ? initialData.start_date.substring(0, 10) : '',
        end_date: initialData.end_date ? initialData.end_date.substring(0, 10) : '',
        agenda_sync_url: initialData.agenda_sync_url || '',
        document_sync_url: initialData.document_sync_url || '',
        finance_sync_url: initialData.finance_sync_url || '',
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name: form.name,
        abbreviation: form.abbreviation || null,
        description: form.description || null,
        budget_approved: form.budget_approved !== '' ? Number(form.budget_approved) : 0,
        drive_folder_url: form.drive_folder_url || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        agenda_sync_url: form.agenda_sync_url || null,
        document_sync_url: form.document_sync_url || null,
        finance_sync_url: form.finance_sync_url || null,
      };

      if (initialData?.id) {
        await api.put(`/api/events/${initialData.id}`, payload);
        toast.success('Event berhasil diperbarui.');
      } else {
        await api.post('/api/events', payload);
        toast.success('Event berhasil ditambahkan.');
      }

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.message) {
          toast.error(data.message);
        }
        if (data.errors) {
          setErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = initialData?.id ? 'Edit Event' : 'Tambah Event';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
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
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Workshop Web Development 2026"
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>}
          </div>

          {/* Abbreviation */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Singkatan Event
              <span className="ml-1.5 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Dapur Surat</span>
            </label>
            <input
              type="text"
              name="abbreviation"
              value={form.abbreviation}
              onChange={handleChange}
              placeholder="Cth: MAKRAB, OSPEK, WORKSHOP"
              className={inputClass('abbreviation')}
            />
            {errors.abbreviation && <p className="mt-1 text-xs text-red-400">{errors.abbreviation[0]}</p>}
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Digunakan otomatis saat merakit nomor surat di fitur Dapur Surat.</p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deskripsi Event
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Jelaskan gambaran umum atau tujuan event..."
              rows={3}
              className={inputClass('description') + ' resize-none'}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description[0]}</p>}
          </div>

          {/* Budget Approved */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Anggaran Disetujui (Rp)
            </label>
            <input
              type="number"
              name="budget_approved"
              value={form.budget_approved}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={inputClass('budget_approved')}
            />
            {errors.budget_approved && <p className="mt-1 text-xs text-red-400">{errors.budget_approved[0]}</p>}
          </div>

          {/* Dates (Start & End) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className={inputClass('start_date')}
              />
              {errors.start_date && <p className="mt-1 text-xs text-red-400">{errors.start_date[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass('end_date')}
              />
              {errors.end_date && <p className="mt-1 text-xs text-red-400">{errors.end_date[0]}</p>}
            </div>
          </div>

          {/* Drive Folder URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tautan Folder Drive (Opsional)
            </label>
            <input
              type="url"
              name="drive_folder_url"
              value={form.drive_folder_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/drive/folders/..."
              className={inputClass('drive_folder_url')}
            />
            {errors.drive_folder_url && <p className="mt-1 text-xs text-red-400">{errors.drive_folder_url[0]}</p>}
          </div>

          {/* Sync URLs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                URL Sync Agenda
              </label>
              <input
                type="url"
                name="agenda_sync_url"
                value={form.agenda_sync_url || ''}
                onChange={handleChange}
                placeholder="https://docs.google.com/..."
                className={inputClass('agenda_sync_url')}
              />
              {errors.agenda_sync_url && <p className="mt-1 text-xs text-red-400">{errors.agenda_sync_url[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                URL Sync Dokumen
              </label>
              <input
                type="url"
                name="document_sync_url"
                value={form.document_sync_url || ''}
                onChange={handleChange}
                placeholder="https://docs.google.com/..."
                className={inputClass('document_sync_url')}
              />
              {errors.document_sync_url && <p className="mt-1 text-xs text-red-400">{errors.document_sync_url[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                URL Sync Keuangan
              </label>
              <input
                type="url"
                name="finance_sync_url"
                value={form.finance_sync_url || ''}
                onChange={handleChange}
                placeholder="https://docs.google.com/..."
                className={inputClass('finance_sync_url')}
              />
              {errors.finance_sync_url && <p className="mt-1 text-xs text-red-400">{errors.finance_sync_url[0]}</p>}
            </div>
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
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
