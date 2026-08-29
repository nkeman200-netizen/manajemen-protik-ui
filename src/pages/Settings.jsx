import { useState, useEffect, useRef } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { fetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon, Save, Loader2, AlertCircle, ShieldAlert,
  Image as ImageIcon, Type, Link as LinkIcon, Upload, Database, Cloud
} from 'lucide-react';
import TemplateManager from '../components/TemplateManager';

export default function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.[0]?.name === 'admin';

  const { data: settingsData, error, isLoading } = useSWR(isAdmin ? '/api/settings' : null, fetcher);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    org_name: '',
    org_logo: '',
    bph_agenda_sync_url: '',
    bph_document_sync_url: '',
    bph_finance_sync_url: '',
    bph_kas_sync_url: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Hydrate form state when data arrives
  useEffect(() => {
    if (settingsData) {
      setForm({
        org_name: settingsData.org_name || '',
        org_logo: settingsData.org_logo || '',
        bph_agenda_sync_url: settingsData.bph_agenda_sync_url || '',
        bph_document_sync_url: settingsData.bph_document_sync_url || '',
        bph_finance_sync_url: settingsData.bph_finance_sync_url || '',
        bph_kas_sync_url: settingsData.bph_kas_sync_url || '',
      });
    }
  }, [settingsData]);

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-8 text-center dark:bg-red-500/10">
          <ShieldAlert className="h-10 w-10 text-red-500"/>
          <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Akses Ditolak</h2>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500"/></div>;
  if (error) return <div className="flex justify-center py-16"><AlertCircle className="h-10 w-10 text-red-500"/></div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Upload File Logic (multipart/form-data)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal adalah 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setUploadingLogo(true);
    try {
      const res = await api.post('/api/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Update local state and global cache
      setForm(prev => ({ ...prev, org_logo: res.data.url }));
      toast.success('Logo organisasi berhasil diunggah.');
      mutate('/api/settings'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah logo.');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Batch Update JSON Logic (Text & URLs)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      settings: [
        { key: 'org_name', value: form.org_name },
        { key: 'bph_agenda_sync_url', value: form.bph_agenda_sync_url },
        { key: 'bph_document_sync_url', value: form.bph_document_sync_url },
        { key: 'bph_finance_sync_url', value: form.bph_finance_sync_url },
        { key: 'bph_kas_sync_url', value: form.bph_kas_sync_url },
      ]
    };

    try {
      await api.post('/api/settings/batch', payload);
      toast.success('Pengaturan sistem berhasil diperbarui.');
      mutate('/api/settings'); 
    } catch (err) {
      toast.error('Gagal memperbarui pengaturan.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 dark:border-white/10 dark:bg-slate-800 dark:text-white";

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up-fade">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
          <SettingsIcon className="h-5 w-5 text-white"/>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Sistem</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola identitas organisasi dan parameter integrasi cloud.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form & Configurations */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Card 1: Identitas Organisasi */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 pb-4 dark:border-white/10">
                <Database className="h-4 w-4 text-primary-500"/> Identitas Organisasi
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Type className="h-3.5 w-3.5"/> Nama Organisasi
                  </label>
                  <input
                    type="text"
                    name="org_name"
                    value={form.org_name}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Himpunan Mahasiswa..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <ImageIcon className="h-3.5 w-3.5"/> Unggah Logo Organisasi
                  </label>
                  <div className="flex items-center gap-3">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/jpeg, image/png, image/svg+xml"
                      className="hidden"
                      id="logo-upload"
                    />
                    <label 
                      htmlFor="logo-upload" 
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${uploadingLogo ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                      Pilih Gambar
                    </label>
                    <span className="text-xs text-slate-500 max-w-[200px] truncate">
                      {form.org_logo ? 'Logo aktif terpasang.' : 'Belum ada logo.'}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Format didukung: JPG, PNG, SVG (Maks. 2MB). Akan langsung memengaruhi sidebar global.</p>
                </div>
              </div>
            </div>

            {/* Card 2: Cloud Sync URLs (BPH Pusat) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 pb-4 dark:border-white/10">
                <Cloud className="h-4 w-4 text-emerald-500"/> Integrasi Spreadsheet BPH Pusat
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <LinkIcon className="h-3.5 w-3.5"/> URL Sync Agenda (BPH Pusat)
                  </label>
                  <input
                    type="url"
                    name="bph_agenda_sync_url"
                    value={form.bph_agenda_sync_url}
                    onChange={handleChange}
                    placeholder="https://docs.google.com/spreadsheets/..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <LinkIcon className="h-3.5 w-3.5"/> URL Sync Dokumen (BPH Pusat)
                  </label>
                  <input
                    type="url"
                    name="bph_document_sync_url"
                    value={form.bph_document_sync_url}
                    onChange={handleChange}
                    placeholder="https://docs.google.com/spreadsheets/..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <LinkIcon className="h-3.5 w-3.5"/> URL Sync Keuangan (BPH Pusat)
                  </label>
                  <input
                    type="url"
                    name="bph_finance_sync_url"
                    value={form.bph_finance_sync_url}
                    onChange={handleChange}
                    placeholder="https://docs.google.com/spreadsheets/..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <LinkIcon className="h-3.5 w-3.5"/> URL Sync Kas Pengurus
                  </label>
                  <input
                    type="url"
                    name="bph_kas_sync_url"
                    value={form.bph_kas_sync_url}
                    onChange={handleChange}
                    placeholder="https://docs.google.com/spreadsheets/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Submit Master Button */}
              <div className="mt-8 flex justify-end pt-4 border-t border-slate-200 dark:border-white/10">
                <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-500">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </form>

          {/* Manajemen Template Dapur Surat */}
          <TemplateManager />
        </div>

        {/* Kolom Kanan: Live Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 dark:border-white/10">Preview Tampilan Sidebar</h3>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-white/5">
              {form.org_logo ? (
                <img src={form.org_logo} alt="Logo" className="h-10 w-10 rounded-xl object-contain shadow-sm bg-white" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
                  <ImageIcon className="h-5 w-5 text-white"/>
                </div>
              )}
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white line-clamp-2">
                {form.org_name || 'Nama Organisasi'}
              </span>
            </div>
            
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Catatan:</strong> Gambar logo diunggah langsung ke penyimpanan server. URL konfigurasi Spreadsheet dikunci dan hanya dapat diedit oleh BPH Inti.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
