import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher, fetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import FinanceModal from '../components/FinanceModal';
import ConfirmModal from '../components/ConfirmModal';
import ActionMenu from '../components/ActionMenu';
import { TableSkeleton, DirectoryCardSkeleton } from '../components/SkeletonLoader';
import SyncHeaderActions from '../components/SyncHeaderActions';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
  Eye,
  Layers,
  ChevronRight as ChevronRightIcon,
  Search,
  Filter,
  FileSpreadsheet,
  RefreshCw,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
}

export default function Finance() {
  const { user } = useAuth();
  const { data: settingsData } = useSWR('/api/settings', fetcher);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fundingFilter, setFundingFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filter dropdowns or date range change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, dateRange.start, dateRange.end, categoryFilter, fundingFilter, paymentFilter]);

  // --- Directory Mode: Fetch Events ---
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(!activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher);

  // Fetch Dropdown Filters
  const { data: filterData } = useSWR(
    activeWorkspace ? `/api/finances/filters?event_id=${activeWorkspace.id || ''}` : null, fetcher
  );

  // --- Workspace Mode: Fetch Finances ---
  let financeUrl = null;
  if (activeWorkspace) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (activeWorkspace.id) {
      params.append('event_id', String(activeWorkspace.id));
    }
    if (debouncedSearch) {
      params.append('search', debouncedSearch);
    }
    if (typeFilter) {
      params.append('type', typeFilter);
    }
    if (categoryFilter) params.append('category_filter', categoryFilter);
    if (fundingFilter) params.append('funding_filter', fundingFilter);
    if (paymentFilter) params.append('payment_filter', paymentFilter);
    if (dateRange.start) {
      params.append('start_date', dateRange.start);
    }
    if (dateRange.end) {
      params.append('end_date', dateRange.end);
    }
    financeUrl = `/api/finances?${params.toString()}`;
  }

  const {
    data: financesData,
    error: financesError,
    isLoading: financesLoading,
    mutate: mutateFinances,
  } = useSWR(financeUrl, paginatedFetcher);

  // --- RBAC: Row-Level Authorization ---
  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(
    (c) => c.user_id === user?.id && ['Ketua', 'Bendahara'].includes(c.position)
  );
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  // --- Cloud Sync Handler ---
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const payload = activeWorkspace?.id ? { event_id: activeWorkspace.id } : {};
      const res = await api.post('/api/finances/sync', payload);
      toast.success(res.data.message || 'Sinkronisasi berhasil.');
      mutateFinances();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal melakukan sinkronisasi.');
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Export LPJ (Array-of-Arrays) ---
  const handleExportLPJ = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/api/finances', {
        params: {
          event_id: activeWorkspace?.id ?? undefined,
          export: true,
        },
      });

      const allData = response.data?.data || (Array.isArray(response.data) ? response.data : []);
      const incomes = allData.filter((i) => i.type === 'income');
      const expenses = allData.filter((i) => i.type === 'expense');

      const totalIncome = incomes.reduce(
        (sum, item) => sum + (Number(item.amount) || ((Number(item.qty) || 1) * (Number(item.unit_price) || 0))),
        0
      );
      const totalExpense = expenses.reduce(
        (sum, item) => sum + (Number(item.amount) || ((Number(item.qty) || 1) * (Number(item.unit_price) || 0))),
        0
      );

      const wsData = [];
      wsData.push(['REALISASI ANGGARAN', activeWorkspace?.name || 'KAS UMUM']);
      wsData.push(['']);

      // BAGIAN PEMASUKAN
      wsData.push(['a) PEMASUKAN', '', '', '', '', '']);
      incomes.forEach((inc, idx) => {
        const amount = Number(inc.amount) || ((Number(inc.qty) || 1) * (Number(inc.unit_price) || 0));
        wsData.push([
          `${idx + 1})`,
          `${inc.title || inc.description || ''} ${inc.funding_source ? `(${inc.funding_source})` : ''}`.trim(),
          '',
          '',
          '',
          amount,
        ]);
      });
      wsData.push(['SUBTOTAL A', '', '', '', '', totalIncome]);
      wsData.push(['']);

      // BAGIAN PENGELUARAN
      wsData.push(['b) PENGELUARAN', '', '', '', '', '']);
      wsData.push(['No', 'Keterangan', 'Volume', 'Satuan', 'Harga', 'Jumlah']);
      expenses.forEach((exp, idx) => {
        const amount = Number(exp.amount) || ((Number(exp.qty) || 1) * (Number(exp.unit_price) || 0));
        wsData.push([
          idx + 1,
          exp.title || exp.description || '',
          exp.qty ?? 1,
          exp.unit || '',
          Number(exp.unit_price) || 0,
          amount,
        ]);
      });
      wsData.push(['SUBTOTAL B', '', '', '', '', totalExpense]);
      wsData.push(['']);

      // TOTAL
      wsData.push(['SALDO AKHIR', '', '', '', '', totalIncome - totalExpense]);

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'LPJ_Keuangan');

      const cleanName = (activeWorkspace?.name || 'Kas_Umum').replace(/[^a-zA-Z0-9_-]/g, '_');
      XLSX.writeFile(wb, `LPJ_${cleanName}.xlsx`);
      toast.success('LPJ berhasil diekspor!');
    } catch (err) {
      toast.error('Gagal mengekspor data LPJ.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- Delete Handler ---
  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/finances/${deleteTarget.id}`);
      toast.success('Transaksi berhasil dihapus.');
      mutateFinances();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus transaksi.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const finances = financesData?.data?.data || (Array.isArray(financesData?.data) ? financesData.data : []) || [];
  const meta = financesData?.meta || (financesData?.data && !Array.isArray(financesData?.data) ? financesData.data : null);

  const lastSyncedAt = useMemo(() => {
    if (financesData?.last_synced_at) return financesData.last_synced_at;
    if (finances?.length > 0) {
      const timestamps = finances.map(f => f?.updated_at || f?.created_at).filter(Boolean);
      if (timestamps.length > 0) return timestamps.sort().reverse()[0];
    }
    return null;
  }, [financesData, finances]);

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white";

  // ==========================================
  // VIEW 1: DIRECTORY MODE (CARD DIRECTORY)
  // ==========================================
  if (!activeWorkspace) {
    if (eventsError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
            <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <div className="text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat direktori</p>
              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil daftar event.</p>
            </div>
          </div>
        </div>
      );
    }

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Kas & Keuangan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih ruang kerja kas umum atau kepanitiaan event untuk mengelola transaksi.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid or Skeleton */}
        {eventsLoading ? (
          <DirectoryCardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up-fade">
          {/* Card: Kas Umum */}
          <div
            onClick={() => {
              setActiveWorkspace({ id: null, name: 'Kas Umum', type: 'global' });
              setPage(1);
              setSearch('');
              setDebouncedSearch('');
              setTypeFilter('');
              setCategoryFilter('');
              setFundingFilter('');
              setPaymentFilter('');
              setDateRange({ start: '', end: '' });
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 dark:from-emerald-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-emerald-500/15"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-emerald-500/30" />
            <div className="relative flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                    Kas Utama
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors dark:text-white dark:group-hover:text-emerald-300">
                  Kas Umum
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  Pencatatan pemasukan & pengeluaran operasional umum organisasi.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-emerald-600 dark:border-white/10 dark:text-emerald-400">
                <span>Buka Ruang Kerja</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Cards: Event Workspaces */}
          {eventList.map((event) => {
            const ketua =
              event.committees?.find((c) => c.position === 'Ketua')?.user?.name ||
              'Belum Ditentukan';
            const dateDisplay = event.start_date || event.date;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveWorkspace(event);
                  setPage(1);
                  setSearch('');
                  setDebouncedSearch('');
                  setTypeFilter('');
                  setCategoryFilter('');
                  setFundingFilter('');
                  setPaymentFilter('');
                  setDateRange({ start: '', end: '' });
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-slate-50/80 hover:shadow-xl hover:shadow-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/[0.08] dark:hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary-500/20" />
                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                        Event
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-primary-300">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{formatTanggal(dateDisplay)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">Ketua: {ketua}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500 group-hover:text-primary-600 transition-colors dark:border-white/10 dark:text-slate-400 dark:group-hover:text-primary-400">
                    <span>Buka Ruang Kerja</span>
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE (FINANCE TABLE)
  // ==========================================
  if (financesError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data keuangan</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data transaksi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setActiveWorkspace(null);
            setPage(1);
            setSearch('');
            setDebouncedSearch('');
            setTypeFilter('');
            setCategoryFilter('');
            setFundingFilter('');
            setPaymentFilter('');
            setDateRange({ start: '', end: '' });
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Direktori
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${
              activeWorkspace.id === null
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/25'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-500/25'
            }`}
          >
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  activeWorkspace.id === null
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-primary-500/15 text-primary-600 border border-primary-500/20 dark:text-primary-400'
                }`}
              >
                {activeWorkspace.id === null ? 'Kas Umum' : 'Event'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.total ?? finances.length} transaksi terdaftar
            </p>
          </div>
        </div>

        {/* Action Buttons Container */}
        <SyncHeaderActions
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
          canSync={canEdit}
        >
          {/* Ekspor LPJ */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportLPJ}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100/70 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor LPJ'}</span>
          </button>
        </SyncHeaderActions>
      </div>

      {/* Advanced Collapsible Filter Panel */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/5 dark:bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4 text-emerald-500"/> PENCARIAN & FILTER
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="md:hidden flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            <Filter className="h-3 w-3"/> {showFilter ? 'Tutup Filter' : 'Buka Filter'}
          </button>
        </div>

        {showFilter && (
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pencarian Teks</label>
              <div className="relative"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik rincian transaksi..." className={inputClass} /><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tipe Transaksi</label>
              <div className="relative">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Tipe Transaksi</option><option value="income">Pemasukan (Income)</option><option value="expense">Pengeluaran (Expense)</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rentang Waktu</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({...p, start: e.target.value}))} className="w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({...p, end: e.target.value}))} className="w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kategori</label>
              <div className="relative">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Kategori</option>
                  {filterData?.categories?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Layers className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sumber Dana</label>
              <div className="relative">
                <select value={fundingFilter} onChange={(e) => setFundingFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Sumber Dana</option>
                  {filterData?.funding_sources?.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <Wallet className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metode Pembayaran</label>
              <div className="relative">
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Metode</option>
                  {filterData?.payment_methods?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <RefreshCw className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table & Mobile Cards Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl animate-slide-up-fade dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* VIEW 1: DESKTOP TABLE (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tanggal
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Tipe
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Rincian
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Vol/Satuan
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Harga Satuan
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Total
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {financesLoading ? (
                <TableSkeleton rows={5} cols={7} />
              ) : finances.length > 0 ? (
                finances.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatTanggal(item.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.type === 'income' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <ArrowUpCircle className="h-3.5 w-3.5" />
                          Pemasukan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                          <ArrowDownCircle className="h-3.5 w-3.5" />
                          Pengeluaran
                        </span>
                      )}
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {item.title || item.description || '-'}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {item.category && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.category}
                          </span>
                        )}
                        {item.pic && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            PIC: {item.pic}
                          </span>
                        )}
                        {item.funding_source && (
                          <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                            Dana: {item.funding_source}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {item.qty ?? 1} {item.unit || ''}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                      {formatRupiah(item.unit_price ?? item.amount)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${
                        item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}{' '}
                      {formatRupiah(item.amount ?? ((item.qty || 1) * (item.unit_price || 0)))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <ActionMenu
                        groups={[
                          {
                            title: 'Tautan Bukti',
                            items: [
                              {
                                label: 'Nota / Bukti Transaksi',
                                icon: ExternalLink,
                                iconColor: 'text-blue-500',
                                href: item.receipt_url,
                                hidden: !item.receipt_url,
                              },
                            ],
                          },
                          {
                            title: 'Aksi Transaksi',
                            items: [
                              {
                                label: 'Detail Transaksi',
                                icon: Eye,
                                iconColor: 'text-indigo-500',
                                onClick: () => {
                                  setSelectedFinance(item);
                                  setIsReadOnlyModal(true);
                                  setModalOpen(true);
                                },
                              },
                            ],
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Belum ada data transaksi untuk ruang kerja ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW 2: MOBILE CARD LIST (block md:hidden) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {financesLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : finances.length > 0 ? (
            finances.map((item) => (
              <div key={item.id} className="p-4 space-y-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                {/* Header: Type Badge, Date & ActionMenu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.type === 'income' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <ArrowUpCircle className="h-3.5 w-3.5" />
                        Pemasukan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                        <ArrowDownCircle className="h-3.5 w-3.5" />
                        Pengeluaran
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatTanggal(item.date)}
                    </span>
                  </div>

                  <div className="shrink-0 -mr-1 -mt-1">
                    <ActionMenu
                      groups={[
                        {
                          title: 'Tautan Bukti',
                          items: [
                            {
                              label: 'Nota / Bukti Transaksi',
                              icon: ExternalLink,
                              iconColor: 'text-blue-500',
                              href: item.receipt_url,
                              hidden: !item.receipt_url,
                            },
                          ],
                        },
                        {
                          title: 'Aksi Transaksi',
                          items: [
                            {
                              label: 'Detail Transaksi',
                              icon: Eye,
                              iconColor: 'text-indigo-500',
                              onClick: () => {
                                setSelectedFinance(item);
                                setIsReadOnlyModal(true);
                                setModalOpen(true);
                              },
                            },
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Title / Uraian & Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title || item.description || '-'}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-extrabold ${
                        item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}{' '}
                      {formatRupiah(item.amount ?? ((item.qty || 1) * (item.unit_price || 0)))}
                    </span>
                  </div>
                </div>

                {/* Tags: Kategori, PIC, Dana, Qty x Harga */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {item.category && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.category}
                    </span>
                  )}
                  {item.pic && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      PIC: {item.pic}
                    </span>
                  )}
                  {item.funding_source && (
                    <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                      Dana: {item.funding_source}
                    </span>
                  )}
                  {item.unit_price && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {item.qty ?? 1} {item.unit || 'unit'} × {formatRupiah(item.unit_price)}
                    </span>
                  )}
                </div>

                {/* Nota Quick Link */}
                {item.receipt_url && (
                  <div className="pt-2 border-t border-dashed border-slate-100 dark:border-white/5">
                    <a
                      href={item.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Lihat Nota / Bukti</span>
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Belum ada data transaksi untuk ruang kerja ini.
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.last_page || !financesData?.links?.next}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <FinanceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedFinance(null);
          setIsReadOnlyModal(false);
        }}
        onSuccess={() => mutateFinances()}
        currentUserId={user?.id}
        initialData={selectedFinance}
        isReadOnly={isReadOnlyModal}
        activeEventId={activeWorkspace?.id}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Hapus Transaksi"
        message={`Yakin hapus transaksi "${deleteTarget?.title || deleteTarget?.description || 'ini'}"?`}
        confirmText="Hapus Permanen"
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
