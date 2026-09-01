import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, ArrowUpRight, ArrowDownLeft, Receipt, ExternalLink, Calendar, User, Tag, CreditCard, Wallet, FileText } from 'lucide-react';
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
  description: '',
  qty: 1,
  unit: '',
  unit_price: '',
  date: '',
  category: '',
  pic: '',
  payment_method: '',
  receipt_url: '',
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
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'income',
        description: initialData.description || initialData.title || '',
        qty: initialData.qty ?? 1,
        unit: initialData.unit || '',
        unit_price: initialData.unit_price ?? initialData.amount ?? '',
        date: initialData.date ? String(initialData.date).substring(0, 10) : '',
        category: initialData.category || '',
        pic: initialData.pic || '',
        payment_method: initialData.payment_method || '',
        receipt_url: initialData.receipt_url || '',
        notes: initialData.notes || '',
        funding_source: initialData.funding_source || '',
        event_id: initialData.event_id ?? (activeEventId ?? ''),
      });
    } else {
      setFormData({
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    setSubmitting(true);
    setErrors({});

    try {
      const targetEventId = initialData
        ? (formData.event_id ? Number(formData.event_id) : null)
        : (activeEventId ? Number(activeEventId) : (formData.event_id ? Number(formData.event_id) : null));

      const payload = {
        user_id: currentUserId,
        type: formData.type,
        title: formData.description,
        description: formData.description,
        qty: Number(formData.qty) || 1,
        unit: formData.unit || null,
        unit_price: Number(formData.unit_price) || 0,
        date: formData.date,
        category: formData.category || null,
        pic: formData.pic || null,
        payment_method: formData.payment_method || null,
        receipt_url: formData.receipt_url || null,
        notes: formData.notes || null,
        funding_source: formData.funding_source || null,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/finances/${initialData.id}`, payload);
        toast.success('Transaksi berhasil diperbarui.');
      } else {
        await api.post('/api/finances', payload);
        toast.success('Transaksi berhasil ditambahkan.');
      }

      setFormData(initialForm);
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

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
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

        {/* Form */}
        {isReadOnly ? (
          /* READ-ONLY DETAIL INFORMATION SHEET */
          <div className="space-y-4 p-6 text-slate-700 dark:text-slate-200">
            {/* Header Summary Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    formData.type === 'income'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 border border-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  {formData.type === 'income' ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                  {formData.type === 'income' ? 'Pemasukan (Income)' : 'Pengeluaran (Expense)'}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {formData.date ? new Date(formData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="mt-3">
                <p className={`text-2xl font-black ${formData.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatRupiah((parseFloat(formData.qty) || 1) * (parseFloat(formData.unit_price) || 0))}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {formData.description || '-'}
                </p>
              </div>
            </div>

            {/* Grid Detail: Kategori, PIC, Volume & Harga, Sumber Dana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Kategori
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {formData.category || '-'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  PIC / Penanggungjawab
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {formData.pic || '-'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Volume & Harga Satuan
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {formData.qty} {formData.unit || 'Unit'} × {formatRupiah(formData.unit_price)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Sumber Dana & Metode
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {formData.funding_source || '-'} • {formData.payment_method || '-'}
                </p>
              </div>
            </div>

            {/* Catatan / Keterangan (jika ada) */}
            {formData.notes && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Catatan / Keterangan
                </span>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {formData.notes}
                </p>
              </div>
            )}

            {/* Nota / Bukti Transaksi */}
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Bukti Transaksi
              </span>
              <div className="mt-1.5">
                {formData.receipt_url ? (
                  <a
                    href={formData.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-blue-500" />
                      <span>Buka Nota / Bukti Transaksi</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-400 dark:border-white/10">
                    <Receipt className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>Nota / bukti transaksi tidak dilampirkan</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-100 px-6 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Tipe & Sumber Dana */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tipe Transaksi
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  >
                    <option value="income">Pemasukan (Income)</option>
                    <option value="expense">Pengeluaran (Expense)</option>
                  </select>
                  {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type[0]}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sumber Dana
                  </label>
                  <input
                    type="text"
                    name="funding_source"
                    value={formData.funding_source}
                    onChange={handleChange}
                    placeholder="Pribadi / IKM / KAS..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.funding_source && <p className="mt-1 text-xs text-red-400">{errors.funding_source[0]}</p>}
                </div>
              </div>

              {/* Tanggal & Event ID */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date[0]}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Event ID (Opsional)
                  </label>
                  <input
                    type="number"
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleChange}
                    placeholder="ID Event (kosongkan jika Kas Umum)"
                    disabled={activeEventId !== null}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                  {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
                </div>
              </div>

              {/* Kategori & PIC */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Kategori
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Konsumsi / ATK / Cetak..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category[0]}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    PIC / Penanggungjawab
                  </label>
                  <input
                    type="text"
                    name="pic"
                    value={formData.pic}
                    onChange={handleChange}
                    placeholder="Nama PIC..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.pic && <p className="mt-1 text-xs text-red-400">{errors.pic[0]}</p>}
                </div>
              </div>

              {/* Rincian */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rincian Item / Pengeluaran
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Contoh: Konsumsi Panitia..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description[0]}</p>}
                {errors.title && !errors.description && <p className="mt-1 text-xs text-red-400">{errors.title[0]}</p>}
              </div>

              {/* Volume & Satuan */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Volume (Qty)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="qty"
                    required
                    value={formData.qty}
                    onChange={handleChange}
                    min="0.01"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.qty && <p className="mt-1 text-xs text-red-400">{errors.qty[0]}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Satuan (Unit)
                  </label>
                  <input
                    type="text"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Pcs / Box / Lbr..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.unit && <p className="mt-1 text-xs text-red-400">{errors.unit[0]}</p>}
                </div>
              </div>

              {/* Harga Satuan */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Harga Satuan (Rp)
                </label>
                <input
                  type="number"
                  name="unit_price"
                  required
                  value={formData.unit_price}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {errors.unit_price && <p className="mt-1 text-xs text-red-400">{errors.unit_price[0]}</p>}
              </div>

              {/* Metode & Nota */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Metode Bayar
                  </label>
                  <input
                    type="text"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    placeholder="Tunai / Transfer..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.payment_method && <p className="mt-1 text-xs text-red-400">{errors.payment_method[0]}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Link Nota
                  </label>
                  <input
                    type="url"
                    name="receipt_url"
                    value={formData.receipt_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  {errors.receipt_url && <p className="mt-1 text-xs text-red-400">{errors.receipt_url[0]}</p>}
                </div>
              </div>

              {/* Keterangan */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Keterangan / Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Catatan tambahan..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {errors.notes && <p className="mt-1 text-xs text-red-400">{errors.notes[0]}</p>}
              </div>

              {/* Kalkulasi Total (Otomatis) */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Kalkulasi (Vol × Harga)
                </span>
                <span className={`text-lg font-black ${formData.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatRupiah((parseFloat(formData.qty) || 0) * (parseFloat(formData.unit_price) || 0))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
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
        )}
      </div>
    </div>
  , document.body);
}
