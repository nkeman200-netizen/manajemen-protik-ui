import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Daftar template yang tersedia — harus sinkron dengan TEMPLATE_OPTIONS di GenerateDocumentModal
const TEMPLATES = [
  { id: 'peminjaman_perlengkapan',  name: 'Peminjaman Perlengkapan' },
  { id: 'peminjaman_tempat',        name: 'Peminjaman Tempat & Alat' },
  { id: 'undangan_eksternal',       name: 'Undangan Eksternal' },
  { id: 'undangan_internal_satu',   name: 'Undangan Internal (Satu Tujuan)' },
  { id: 'undangan_internal_banyak', name: 'Undangan Internal (Banyak Tujuan)' },
  { id: 'permohonan_kerjasama',     name: 'Permohonan Kerjasama' },
];

export default function TemplateManager() {
  // State menyimpan id template yang sedang diupload (null = tidak ada)
  const [uploading, setUploading] = useState(null);

  const handleFileChange = async (e, templateId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      toast.error('File harus berekstensi .docx');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('template_type', templateId);

    setUploading(templateId);
    try {
      await api.post('/api/settings/templates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Template "${templateId}.docx" berhasil diperbarui!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah template.');
    } finally {
      setUploading(null);
      e.target.value = ''; // Reset file input agar file yang sama bisa dipilih ulang
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/50">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Manajemen Template Persuratan
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Unggah file MS Word (.docx) baru untuk menimpa format template yang digunakan oleh Dapur Surat.
        </p>
      </div>

      {/* Template List */}
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {TEMPLATES.map((tpl) => {
          const isCurrentlyUploading = uploading === tpl.id;
          return (
            <div
              key={tpl.id}
              className="flex flex-col items-start justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.03] sm:flex-row sm:items-center"
            >
              {/* Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {tpl.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {tpl.id}.docx
                  </p>
                </div>
              </div>

              {/* Upload Button — menggunakan label + hidden input agar styling bebas */}
              <div className="w-full sm:w-auto">
                <input
                  type="file"
                  id={`upload-${tpl.id}`}
                  className="hidden"
                  accept=".docx"
                  onChange={(e) => handleFileChange(e, tpl.id)}
                  disabled={isCurrentlyUploading}
                />
                <label
                  htmlFor={`upload-${tpl.id}`}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:w-auto ${
                    isCurrentlyUploading ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  {isCurrentlyUploading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <UploadCloud className="h-4 w-4" />}
                  {isCurrentlyUploading ? 'Mengunggah...' : 'Timpa Template'}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
