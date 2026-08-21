import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

const initialForm = {
  type: 'income',
  title: '',
  qty: 1,
  unit: '',
  unit_price: '',
  date: '',
  notes: '',
  funding_source: '',
  event_id: '',
};

export default function FinanceModal({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
  initialData = null,
  isReadOnly = false,
  activeEventId = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || 'income',
        title: initialData.title || initialData.description || '',
        qty: initialData.qty ?? 1,
        unit: initialData.unit || '',
        unit_price: initialData.unit_price ?? initialData.amount ?? '',
        date: initialData.date ? initialData.date.substring(0, 10) : '',
        notes: initialData.notes || '',
        funding_source: initialData.funding_source || '',
        event_id: initialData.event_id ?? (activeEventId ?? ''),
      });
    } else {
      setForm({
        ...initialForm,
        event_id: activeEventId ?? '',
      });
    }
    setErrors({});
  }, [initialData, activeEventId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const calculatedTotal = (Number(form.qty) || 0) * (Number(form.unit_price) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setSubmitting(true);
    setErrors({});

    try {
      const targetEventId = initialData
        ? (form.event_id ? Number(form.event_id) : null)
        : (activeEventId ? Number(activeEventId) : (form.event_id ? Number(form.event_id) : null));

      const payload = {
        user_id: currentUserId,
        type: form.type,
        title: form.title,
        qty: Number(form.qty) || 1,
        unit: form.unit || null,
        unit_price: Number(form.unit_price) || 0,
        date: form.date,
        notes: form.notes || null,
        funding_source: form.funding_source || null,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/finances/${initialData.id}`, payload);
        toast.success('Transaksi berhasil diperbarui.');
      } else {
        await api.post('/api/finances', payload);
        toast.success('Transaksi berhasil ditambahkan.');
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
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isReadOnly
    ? 'Detail Transaksi'
    : initialData?.id
    ? 'Edit Transaksi'
    : 'Tambah Transaksi';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
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
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Datalist Options */}
        <datalist id="funding-list">
          <option value="Pribadi" />
          <option value="IKM" />
          <option value="KAS" />
          <option value="SPONSOR" />
          <option value="LAINNYA" />
        </datalist>

        <datalist id="unit-list">
          <option value="Pcs" />
          <option value="Pack" />
          <option value="Box" />
          <option value="Ls" />
          <option value="Rim" />
          <option value="Kg" />
          <option value="Liter" />
          <option value="Orang" />
          <option value="Hari" />
          <option value="Bulan" />
          <option value="Kegiatan" />
        </datalist>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Row 1: Tipe Transaksi & Sumber Dana */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tipe Transaksi
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isReadOnly}
                className={inputClass('type')}
              >
                <option value="income" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Pemasukan (Income)</option>
                <option value="expense" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Pengeluaran (Expense)</option>
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sumber Dana
              </label>
              <input
                type="text"
                name="funding_source"
                list="funding-list"
                value={form.funding_source}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Pribadi / IKM / KAS..."
                className={inputClass('funding_source')}
              />
              {errors.funding_source && <p className="mt-1 text-xs text-red-400">{errors.funding_source[0]}</p>}
            </div>
          </div>

          {/* Row 2: Tanggal & Event ID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                disabled={isReadOnly}
                className={inputClass('date')}
              />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
            </div>

            {!activeEventId ? (
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Event ID (Opsional)
                </label>
                <input
                  type="text"
                  name="event_id"
                  value={form.event_id}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  placeholder="ID Event (kosongkan jika Kas Umum)"
                  className={inputClass('event_id')}
                />
                {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
              </div>
            ) : (
              <div className="flex items-end">
                <div className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
                  Ruang Kerja: <span className="font-semibold text-primary-600 dark:text-primary-400">Event ID #{activeEventId}</span>
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Rincian (Title) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rincian Item / Pengeluaran
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Contoh: Konsumsi Panitia, Pembelian Kertas..."
              className={inputClass('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title[0]}</p>}
          </div>

          {/* Row 4: Volume (Qty) & Satuan (Unit) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Volume / Kuantitas (Qty)
              </label>
              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="1"
                min="0.01"
                step="any"
                className={inputClass('qty')}
              />
              {errors.qty && <p className="mt-1 text-xs text-red-400">{errors.qty[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Satuan (Unit)
              </label>
              <input
                type="text"
                name="unit"
                list="unit-list"
                value={form.unit}
                onChange={handleChange}
                disabled={isReadOnly}
                placeholder="Pcs / Pack / Box / Ls..."
                className={inputClass('unit')}
              />
              {errors.unit && <p className="mt-1 text-xs text-red-400">{errors.unit[0]}</p>}
            </div>
          </div>

          {/* Row 5: Harga Satuan */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Harga Satuan (Rp)
            </label>
            <input
              type="number"
              name="unit_price"
              value={form.unit_price}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="0"
              min="0"
              className={inputClass('unit_price')}
            />
            {errors.unit_price && <p className="mt-1 text-xs text-red-400">{errors.unit_price[0]}</p>}
          </div>

          {/* Row 6: Keterangan (Notes) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Keterangan Tambahan / Catatan
            </label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Catatan tambahan (opsional)..."
              className={inputClass('notes')}
            />
            {errors.notes && <p className="mt-1 text-xs text-red-400">{errors.notes[0]}</p>}
          </div>

          {/* Kalkulasi Otomatis (Read-Only Total Box) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Kalkulasi (Vol × Harga)
              </span>
              <span className={`text-base font-bold ${
                form.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
              }`}>
                {formatRupiah(calculatedTotal)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isReadOnly ? 'Tutup' : 'Batal'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
