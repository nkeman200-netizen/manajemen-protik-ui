import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FUNDING_SOURCES = [
  { value: '', label: 'Pilih Sumber Dana (Opsional)' },
  { value: 'IOM', label: 'IOM' },
  { value: 'DIPA', label: 'DIPA' },
  { value: 'KAS', label: 'KAS' },
  { value: 'SPONSOR', label: 'SPONSOR' },
];

const initialForm = {
  type: 'income',
  amount: '',
  description: '',
  date: '',
  funding_source: '',
  event_id: '',
};

export default function FinanceModal({ isOpen, onClose, onSuccess, currentUserId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        user_id: currentUserId,
        type: form.type,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
        funding_source: form.funding_source || null,
        event_id: form.event_id ? Number(form.event_id) : null,
      };

      await api.post('/api/finances', payload);
      toast.success('Transaksi berhasil ditambahkan.');
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        // Show main message (e.g. "Pengeluaran melebihi anggaran")
        if (data.message) {
          toast.error(data.message);
        }
        // Set field-level errors
        if (data.errors) {
          setErrors(data.errors);
          // Also toast the first error for visibility
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError && !data.message) {
            toast.error(firstError);
          }
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/20'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Tambah Transaksi</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Tipe Transaksi
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass('type')}
            >
              <option value="income" className="bg-slate-900 text-white">Pemasukan</option>
              <option value="expense" className="bg-slate-900 text-white">Pengeluaran</option>
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type[0]}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Nominal (Rp)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={inputClass('amount')}
            />
            {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Deskripsi
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Keterangan transaksi"
              className={inputClass('description')}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description[0]}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
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

          {/* Funding Source */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Sumber Dana
            </label>
            <select
              name="funding_source"
              value={form.funding_source}
              onChange={handleChange}
              className={inputClass('funding_source')}
            >
              {FUNDING_SOURCES.map((src) => (
                <option key={src.value} value={src.value} className="bg-slate-900 text-white">
                  {src.label}
                </option>
              ))}
            </select>
            {errors.funding_source && <p className="mt-1 text-xs text-red-400">{errors.funding_source[0]}</p>}
          </div>

          {/* Event ID */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Event ID (Opsional)
            </label>
            <input
              type="text"
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              placeholder="Masukkan ID event terkait"
              className={inputClass('event_id')}
            />
            {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
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
