import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, FileDown, Wand2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const STORAGE_KEY_FORM    = 'dapurSuratForm';
const STORAGE_KEY_RAWDATE = 'dapurSuratRawDate';

const initialForm = {
  template_type: 'peminjaman_perlengkapan',
  nomor_surat: '',
  lampiran: '',
  ejaan_lampiran: '',
  tujuan_surat: '',
  nama_kegiatan: '',
  detail_undangan: '',
  bantuan: '',
  hari_tanggal: '',
  waktu_pelaksanaan: '',
  tempat_pelaksanaan: '',
};

const TEMPLATE_OPTIONS = [
  { value: 'peminjaman_perlengkapan', label: 'Surat Peminjaman Perlengkapan' },
  { value: 'peminjaman_tempat',       label: 'Surat Peminjaman Tempat & Perlengkapan' },
  { value: 'undangan_eksternal',      label: 'Surat Undangan Eksternal (Luar Kampus)' },
  { value: 'undangan_internal_satu',  label: 'Surat Undangan Internal (Satu Tujuan)' },
  { value: 'undangan_internal_banyak',label: 'Surat Undangan Internal (Banyak Tujuan)' },
  { value: 'permohonan_kerjasama',    label: 'Surat Permohonan Kerjasama' },
];

const TARGET_LIST = [
  "Kepala Subbagian Akademik",
  "Kepala Subbagian Umum",
  "Ketua Jurusan Komputer dan Bisnis",
  "Ketua Unit Kegiatan Mahasiswa Multimedia Community (Medicom)",
  "Bapak Riyadi Purwanto, S.T., M.Eng.",
  "Bapak Isa Bahroni, S.Kom., M.Eng",
  "Bapak Lutfi Syafirullah, S.T., M.Kom.",
  "Ibu Dwi Novia Prasetyanti, S.Kom., M.Cs.",
  "Bapak Prih Diantono Abda'u, S.Kom., M.Kom.",
  "Bapak Nur Wachid Adi Prasetya, S.Kom., M.Kom.",
  "Ibu Cahya Vikasari, S.T., M.Eng",
  "Bapak Abdul Rohman Supriyono, S.T., M.Kom.",
  "Ibu Hety Dwi Hastuti, S.E., M.Si.",
  "Bapak Muhammad Nur Faiz, S.Kom., M.Kom.",
];

const LAMPIRAN_EJAAN_LIST = ["Satu", "Dua", "Tiga", "Empat", "Lima"];
const KEGIATAN_LIST = [
  "Rapat Rutin BPH",
  "Rapat Pleno",
  "Malam Keakraban PROTIC 2026",
  "Open Recruitment Pengurus",
  "Sharing Session Alumni",
];

// =============================================
// Custom Combobox / Autocomplete Component
// onMouseDown mencegah race condition blur vs click
// =============================================
function AutocompleteInput({ name, value, onChange, options, placeholder, required = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:focus:border-primary-500"
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute left-0 z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-slate-800">
          {filtered.map((opt, idx) => (
            <li
              key={idx}
              onMouseDown={() => handleSelect(opt)}
              className="cursor-pointer px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============================================
// Main Modal Component
// =============================================
export default function GenerateDocumentModal({ isOpen, onClose, activeEventId }) {

  // INISIALISASI DARI localStorage — lazy initializer agar tidak dibaca setiap render
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORM);
      return saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
    } catch {
      return initialForm;
    }
  });

  const [rawDate, setRawDate] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_RAWDATE) || '';
  });

  const [submitting, setSubmitting] = useState(false);
  const [generatingNum, setGeneratingNum] = useState(false);

  // AUTO-SAVE — simpan ke localStorage setiap kali form berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RAWDATE, rawDate);
  }, [rawDate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // SMART DATE PICKER — konversi YYYY-MM-DD ke narasi bahasa Indonesia
  const handleDateChange = (e) => {
    const d = e.target.value;
    setRawDate(d);
    if (d) {
      try {
        const formatted = format(new Date(d), 'EEEE, d MMMM yyyy', { locale: localeID });
        setForm((prev) => ({ ...prev, hari_tanggal: formatted }));
      } catch {
        setForm((prev) => ({ ...prev, hari_tanggal: '' }));
      }
    } else {
      setForm((prev) => ({ ...prev, hari_tanggal: '' }));
    }
  };

  // RESET — hapus form + localStorage tanpa menutup modal
  const handleResetForm = () => {
    if (window.confirm('Yakin ingin mengosongkan semua isian Dapur Surat?')) {
      setForm(initialForm);
      setRawDate('');
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_RAWDATE);
      toast.success('Form berhasil dikosongkan.');
    }
  };

  // MAGIC WAND — ambil nomor surat dari API berdasarkan urutan arsip terakhir
  const fetchAutoNumber = async () => {
    setGeneratingNum(true);
    try {
      const response = await api.get('/api/documents/generate-number', {
        params: { type: form.template_type, event_id: activeEventId || '' },
      });
      setForm((prev) => ({ ...prev, nomor_surat: response.data.nomor_surat }));
      toast.success('Nomor surat berhasil dirakit!');
    } catch {
      toast.error('Gagal mengambil nomor otomatis dari server.');
    } finally {
      setGeneratingNum(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/api/documents/generate', form, {
        responseType: 'blob',
        headers: { Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      });

      // Prioritas 1: Content-Disposition dari server
      let fileName = `Draft_${form.template_type}.docx`;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      } else if (form.nomor_surat) {
        // Prioritas 2: sanitasi nomor surat → nama file yang aman
        const safeName = form.nomor_surat
          .replace(/[/\\:*?"<>|]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        fileName = `${safeName}.docx`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Dokumen berhasil diunduh!');
      // Form TIDAK dikosongkan agar pengguna bisa generate ulang dengan data yang sama
    } catch {
      toast.error('Gagal memproses dokumen.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:focus:border-primary-500';

  const isInvitation = form.template_type.includes('undangan');
  const isKerjasama  = form.template_type === 'permohonan_kerjasama';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-white/10">

        {/* Header sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Dapur Surat</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pusat Autogenerasi Dokumen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">

          {/* Jenis Surat */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Jenis Surat
            </label>
            <select
              name="template_type"
              value={form.template_type}
              onChange={handleChange}
              required
              className={inputClass}
            >
              {TEMPLATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Nomor & Tujuan */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nomor Surat <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={fetchAutoNumber}
                  disabled={generatingNum}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary-600 transition hover:text-primary-700 disabled:opacity-50 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {generatingNum
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Wand2 className="h-3.5 w-3.5" />}
                  Auto
                </button>
              </div>
              <input
                type="text"
                name="nomor_surat"
                value={form.nomor_surat}
                onChange={handleChange}
                required
                placeholder="Cth: 001/SPm-i/PROTIC/VIII/2026"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tujuan Surat <span className="text-red-500">*</span>
              </label>
              <AutocompleteInput
                name="tujuan_surat"
                value={form.tujuan_surat}
                onChange={handleChange}
                options={TARGET_LIST}
                placeholder="Ketik atau pilih..."
                required={true}
              />
            </div>
          </div>

          {/* Lampiran */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Lampiran (Angka)
              </label>
              <input
                type="text"
                name="lampiran"
                value={form.lampiran}
                onChange={handleChange}
                placeholder="Contoh: 1"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ejaan Lampiran (Huruf)
              </label>
              <AutocompleteInput
                name="ejaan_lampiran"
                value={form.ejaan_lampiran}
                onChange={handleChange}
                options={LAMPIRAN_EJAAN_LIST}
                placeholder="Contoh: Satu"
                required={false}
              />
            </div>
          </div>

          {/* Nama Kegiatan */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nama Kegiatan <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              name="nama_kegiatan"
              value={form.nama_kegiatan}
              onChange={handleChange}
              options={KEGIATAN_LIST}
              placeholder="Nama acara..."
              required={true}
            />
          </div>

          {/* Detail Undangan (conditional) */}
          {isInvitation && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Narasi / Detail Undangan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="detail_undangan"
                value={form.detail_undangan}
                onChange={handleChange}
                required={isInvitation}
                rows={2}
                placeholder="1 orang delegasi sebagai tamu undangan..."
                className={inputClass}
              />
            </div>
          )}

          {/* Rincian Bantuan Kerjasama (conditional) */}
          {isKerjasama && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rincian Bantuan Kerjasama <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bantuan"
                value={form.bantuan}
                onChange={handleChange}
                required={isKerjasama}
                rows={2}
                placeholder="pendokumentasian acara berupa foto, video..."
                className={inputClass}
              />
            </div>
          )}

          {/* Tanggal, Waktu, Tempat */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tanggal Acara <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rawDate}
                onChange={handleDateChange}
                required
                className={inputClass}
              />
              {/* hidden field — dikirim ke backend sebagai string format Indonesia */}
              <input type="hidden" name="hari_tanggal" value={form.hari_tanggal} />
              <p className="mt-1.5 truncate text-[10px] text-slate-400 dark:text-slate-500">
                Terbaca: {form.hari_tanggal || '-'}
              </p>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="waktu_pelaksanaan"
                value={form.waktu_pelaksanaan}
                onChange={handleChange}
                required
                placeholder="08.00 - Selesai"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tempat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tempat_pelaksanaan"
                value={form.tempat_pelaksanaan}
                onChange={handleChange}
                required
                placeholder="Gedung XYZ PNC"
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" /> Kosongkan Form
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {submitting ? 'Memproses...' : 'Unduh Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
