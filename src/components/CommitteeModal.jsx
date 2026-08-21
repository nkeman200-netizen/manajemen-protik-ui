import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import * as XLSX from 'xlsx';
import {
  X,
  Loader2,
  Download,
  Upload,
  Trash2,
  Search,
  Users,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CommitteeModal({ isOpen, onClose, event }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [position, setPosition] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch Users
  const { data: usersData, isLoading: usersLoading } = useSWR(
    isOpen ? '/api/users' : null,
    paginatedFetcher
  );

  // Fetch Committees for active event
  const committeeUrl =
    isOpen && event?.id ? `/api/event-committees?event_id=${event.id}` : null;
  const {
    data: committeesData,
    isLoading: committeeLoading,
    mutate: mutateCommittees,
  } = useSWR(committeeUrl, paginatedFetcher);

  // Close combobox when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset state when modal closes or active event changes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedUserId(null);
      setPosition('');
      setIsDropdownOpen(false);
      setIsUploading(false);
      setSubmitting(false);
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const usersList =
    usersData?.data?.data ||
    (Array.isArray(usersData?.data) ? usersData.data : []) ||
    [];
  const committeesList =
    committeesData?.data?.data ||
    (Array.isArray(committeesData?.data) ? committeesData.data : []) ||
    [];

  const filteredUsers = usersList.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  // TUGAS 3: Fitur Excel Multi-Sheet (Download Template)
  const handleDownloadTemplate = () => {
    try {
      // Sheet 1: Form_Import
      const formImportData = [
        {
          'ID Anggota': '',
          'Jabatan': '',
        },
      ];
      const wsForm = XLSX.utils.json_to_sheet(formImportData);

      // Sheet 2: Referensi_Anggota
      const referenceData = usersList.map((u) => ({
        'ID Anggota': u.id,
        'Nama Anggota': u.name,
        'Email': u.email,
      }));
      const wsRef = XLSX.utils.json_to_sheet(referenceData);

      // Sheet 3: Panduan_Sistem
      const guideData = [
        {
          'ATURAN PENGISIAN PANITIA':
            '1. Gunakan ID Anggota yang valid dari Sheet Referensi_Anggota.',
        },
        {
          'ATURAN PENGISIAN PANITIA':
            '2. Untuk akses Edit (Keuangan/Dokumen/Rapat), ketik Jabatan PERSIS: Ketua, Sekretaris, atau Bendahara.',
        },
        {
          'ATURAN PENGISIAN PANITIA':
            '3. Untuk divisi lain, ketik bebas (misal: Koordinator Acara).',
        },
      ];
      const wsGuide = XLSX.utils.json_to_sheet(guideData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsForm, 'Form_Import');
      XLSX.utils.book_append_sheet(wb, wsRef, 'Referensi_Anggota');
      XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan_Sistem');

      XLSX.writeFile(wb, 'Template_Panitia.xlsx');
      toast.success('Template Panitia berhasil diunduh.');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh template.');
    }
  };

  // TUGAS 4: Fitur Excel (Bulk Import)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);

        if (!rows || rows.length === 0) {
          toast.error('File Excel kosong atau format tidak sesuai.');
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const row of rows) {
          const rawUserId = row['ID Anggota'];
          const rawPosition = row['Jabatan'];

          if (!rawUserId || !rawPosition) {
            failCount++;
            continue;
          }

          try {
            await api.post('/api/event-committees', {
              event_id: event.id,
              user_id: Number(rawUserId),
              position: String(rawPosition).trim(),
            });
            successCount++;
          } catch (itemErr) {
            console.error('Error importing row:', row, itemErr);
            toast.error(
              itemErr.response?.data?.message ||
                `Gagal mengimpor anggota ID ${rawUserId}`
            );
            failCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Berhasil mengimpor ${successCount} panitia.`);
        }
        mutateCommittees();
      } catch (err) {
        console.error(err);
        toast.error('Terjadi kesalahan saat memproses file Excel.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Gagal membaca file Excel.');
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsBinaryString(file);
  };

  // Submit Injeksi Manual
  const handleAddCommittee = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Silakan cari dan pilih anggota terlebih dahulu.');
      return;
    }
    if (!position.trim()) {
      toast.error('Silakan isi atau pilih jabatan.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/event-committees', {
        event_id: event.id,
        user_id: selectedUserId,
        position: position.trim(),
      });

      toast.success('Panitia berhasil ditambahkan.');
      setSelectedUserId(null);
      setSearchTerm('');
      setPosition('');
      mutateCommittees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan panitia.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Committee
  const handleDeleteCommittee = async (id) => {
    if (window.confirm('Yakin ingin menghapus panitia ini?')) {
      setDeletingId(id);
      try {
        await api.delete(`/api/event-committees/${id}`);
        toast.success('Panitia berhasil dihapus.');
        mutateCommittees();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus panitia.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Ketua':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      case 'Bendahara':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'Sekretaris':
        return 'bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-400';
      default:
        return 'bg-primary-500/15 text-primary-600 border-primary-500/20 dark:text-primary-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/25">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kelola Panitia Event
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {event.name}
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

        {/* Content Area */}
        <div className="space-y-6 px-6 py-5">
          {/* Action Bar (Unduh Template & Impor Excel) */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Impor Massal Excel
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Tombol Unduh Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Unduh Template</span>
              </button>

              {/* Tombol Impor Excel (Hidden Input) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className="hidden"
                id="excel-upload-input"
              />
              <label
                htmlFor="excel-upload-input"
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 ${
                  isUploading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{isUploading ? 'Mengimpor...' : 'Impor Excel'}</span>
              </label>
            </div>
          </div>

          {/* Form Injeksi Manual (Grid 2 Kolom) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Injeksi Panitia Manual
            </h3>
            <form onSubmit={handleAddCommittee} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Kolom Kiri: Pilih Anggota (Combobox Search) */}
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Pilih Anggota <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedUserId(null);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder={
                        usersLoading
                          ? 'Memuat anggota...'
                          : 'Cari nama atau email...'
                      }
                      disabled={usersLoading}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:disabled:bg-white/5"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>

                  {/* Dropdown Hasil Search */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setSearchTerm(u.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex cursor-pointer flex-col px-3.5 py-2 text-xs transition ${
                              selectedUserId === u.id
                                ? 'bg-primary-50 font-semibold text-primary-600 dark:bg-primary-950/50 dark:text-primary-400'
                                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                            }`}
                          >
                            <span className="font-medium">{u.name}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              {u.email}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                          {usersLoading
                            ? 'Memuat data anggota...'
                            : 'Tidak ada anggota ditemukan.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Jabatan (Datalist Hibrida) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="jabatan-list"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Pilih atau ketik jabatan..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                  <datalist id="jabatan-list">
                    <option value="Ketua" />
                    <option value="Sekretaris" />
                    <option value="Bendahara" />
                    <option value="Koordinator Acara" />
                    <option value="Koordinator Media" />
                    <option value="Koordinator Konsumsi" />
                    <option value="Koordinator Perkap" />
                    <option value="Koordinator Sponsorship" />
                    <option value="Koordinator Humas" />
                    <option value="Anggota Divisi Acara" />
                    <option value="Anggota Divisi Media" />
                    <option value="Anggota Divisi Konsumsi" />
                    <option value="Anggota Divisi Perkap" />
                    <option value="Anggota Divisi Sponsorship" />
                    <option value="Anggota Divisi Humas" />
                  </datalist>
                </div>
              </div>

              {/* Tombol Tambah */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting || !selectedUserId || !position.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>Tambah Panitia</span>
                </button>
              </div>
            </form>
          </div>

          {/* Tabel Daftar Panitia Terdaftar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Daftar Panitia Terdaftar ({committeesList.length})
            </h3>

            {committeeLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  Memuat data panitia...
                </span>
              </div>
            ) : committeesList.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Nama
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Jabatan
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {committeesList.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {item.user?.name || item.user_name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {item.user?.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${getPositionBadge(
                              item.position
                            )}`}
                          >
                            {item.position}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteCommittee(item.id)}
                            disabled={deletingId === item.id}
                            title="Hapus Panitia"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-40 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400 dark:border-white/10 dark:text-slate-500">
                Belum ada panitia yang ditugaskan pada event ini.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
