import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, ArrowUpRight, ArrowDownLeft, FileText, ExternalLink, Calendar, Building2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initialForm = {
  letter_number: '',
  title: '',
  type: 'outgoing',
  origin: '',
  destination: '',
  letter_link: '',
  scan_link: '',
  activity_date: '',
  event_id: '',
};

export default function DocumentModal({
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
        letter_number: initialData.letter_number || '',
        title: initialData.title || '',
        type: initialData.type || 'outgoing',
        origin: initialData.origin || '',
        destination: initialData.destination || '',
        letter_link: initialData.letter_link || '',
        scan_link: initialData.scan_link || '',
        activity_date: initialData.activity_date ? String(initialData.activity_date).substring(0, 10) : '',
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

  const handleTypeToggle = (selectedType) => {
    if (isReadOnly) return;
    setForm((prev) => ({
      ...prev,
      type: selectedType,
      origin: selectedType === 'outgoing' ? '' : prev.origin,
      destination: selectedType === 'incoming' ? '' : prev.destination,
    }));
    setErrors({});
  };

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
        created_by: currentUserId,
        letter_number: form.letter_number,
        title: form.title,
        type: form.type,
        origin: form.type === 'incoming' ? form.origin : null,
        destination: form.type === 'outgoing' ? form.destination : null,
        letter_link: form.letter_link || null,
        scan_link: form.scan_link || null,
        activity_date: form.activity_date || null,
        event_id: targetEventId,
      };

      if (initialData?.id) {
        await api.put(`/api/documents/${initialData.id}`, payload);
        toast.success('Surat berhasil diperbarui.');
      } else {
        await api.post('/api/documents', payload);
        toast.success('Surat berhasil ditambahkan.');
      }

      setForm(initialForm);
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

  const modalTitle = isReadOnly ? 'Detail Dokumen' : initialData?.id ? 'Edit Surat' : 'Tambah Surat Baru';

  const inputClass = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none backdrop-blur-sm transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5 dark:disabled:text-slate-500 ${
      errors[field]
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-violet-500 focus:ring-violet-500/20 dark:border-white/10'
    }`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{modalTitle}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isReadOnly ? (
          /* READ-ONLY DETAIL INFORMATION SHEET */
          <div className="space-y-4 p-6 text-slate-700 dark:text-slate-200">
            {/* Header Card: Tipe & Nomor Surat */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Nomor Surat
                </span>
                <p className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {form.letter_number || '-'}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  form.type === 'outgoing'
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400'
                }`}
              >
                {form.type === 'outgoing' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownLeft className="h-3.5 w-3.5" />}
                {form.type === 'outgoing' ? 'Surat Keluar' : 'Surat Masuk'}
              </span>
            </div>

            {/* Perihal / Judul Surat */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Perihal / Judul Surat
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {form.title || '-'}
              </p>
            </div>

            {/* Grid Detail: Asal / Tujuan & Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {form.type === 'outgoing' ? 'Tujuan / Penerima' : 'Asal / Pengirim'}
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {(form.type === 'outgoing' ? form.destination : form.origin) || '-'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tanggal Kegiatan / Surat
                </span>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                  {form.activity_date ? new Date(form.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>
            </div>

            {/* Berkas & Tautan Digital */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Berkas Digital
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {form.letter_link ? (
                  <a
                    href={form.letter_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Draft Surat (Word)</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-400 dark:border-white/10">
                    <FileText className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>Draft Word tidak tersedia</span>
                  </div>
                )}

                {form.scan_link ? (
                  <a
                    href={form.scan_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <span>Scan Surat (PDF)</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-400 dark:border-white/10">
                    <FileText className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>Scan PDF tidak tersedia</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Button */}
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
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            {/* TIPE SURAT TOGGLE */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tipe Surat</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeToggle('outgoing')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${
                    form.type === 'outgoing'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500/50 dark:bg-primary-500/20 dark:text-primary-300'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" /> Surat Keluar
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeToggle('incoming')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${
                    form.type === 'incoming'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-500/20 dark:text-indigo-300'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <ArrowDownLeft className="h-4 w-4" /> Surat Masuk
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Nomor Surat <span className="text-red-500">*</span></label>
                <input type="text" name="letter_number" required value={form.letter_number} onChange={handleChange} placeholder="001/PROTIK/2026" className={inputClass('letter_number')} />
                {errors.letter_number && <p className="mt-1 text-xs text-red-400">{errors.letter_number[0]}</p>}
              </div>

              {form.type === 'outgoing' ? (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tujuan / Penerima</label>
                  <input type="text" name="destination" value={form.destination} onChange={handleChange} placeholder="Yth. Direktur PNC..." className={inputClass('destination')} />
                  {errors.destination && <p className="mt-1 text-xs text-red-400">{errors.destination[0]}</p>}
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Asal / Pengirim <span className="text-red-500">*</span></label>
                  <input type="text" name="origin" required value={form.origin} onChange={handleChange} placeholder="Dari BEM PNC..." className={inputClass('origin')} />
                  {errors.origin && <p className="mt-1 text-xs text-red-400">{errors.origin[0]}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Perihal / Judul Surat <span className="text-red-500">*</span></label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="Peminjaman Alat..." className={inputClass('title')} />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Tanggal Kegiatan (Opsional)</label>
              <input type="date" name="activity_date" value={form.activity_date} onChange={handleChange} className={inputClass('activity_date')} />
              {errors.activity_date && <p className="mt-1 text-xs text-red-400">{errors.activity_date[0]}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Link Draft (Word)</label>
                <input type="url" name="letter_link" value={form.letter_link} onChange={handleChange} placeholder="https://docs..." className={inputClass('letter_link')} />
                {errors.letter_link && <p className="mt-1 text-xs text-red-400">{errors.letter_link[0]}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Link Scan (PDF)</label>
                <input type="url" name="scan_link" value={form.scan_link} onChange={handleChange} placeholder="https://drive..." className={inputClass('scan_link')} />
                {errors.scan_link && <p className="mt-1 text-xs text-red-400">{errors.scan_link[0]}</p>}
              </div>
            </div>

            {!activeEventId && (
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Event ID (Opsional)</label>
                <input type="number" name="event_id" value={form.event_id} onChange={handleChange} placeholder="Biarkan kosong jika BPH Pusat" className={inputClass('event_id')} />
                {errors.event_id && <p className="mt-1 text-xs text-red-400">{errors.event_id[0]}</p>}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 ${
                  form.type === 'incoming'
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                    : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/25'
                }`}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Menyimpan...' : 'Simpan Dokumen'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
