import { useState, useEffect, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import api from '../api/axios';
import { fetcher } from '../api/fetcher';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import UserModal from '../components/UserModal';
import UserDetailModal, { getWhatsAppUrl } from '../components/UserDetailModal';
import ActionMenu from '../components/ActionMenu';
import SyncHeaderActions from '../components/SyncHeaderActions';
import {
  Users,
  Search,
  Filter,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Pencil,
  Eye,
  MessageCircle,
  UserCog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  UserX,
  X,
} from 'lucide-react';

export default function UsersIndex() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.roles?.some((r) => r.name === 'admin');
  const { data: settingsData } = useSWR('/api/settings', fetcher);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    divisions: [],
    prodis: [],
    angkatans: [],
  });

  const [filters, setFilters] = useState({
    search: '',
    division_filter: '',
    prodi_filter: '',
    angkatan_filter: '',
    sort_by: 'name',
    sort_direction: 'asc',
  });

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState('');

  // Modal edit user
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch filter options (Called once on component mount)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await api.get('/api/users/filters');
      const data = res.data?.data || res.data || {};
      setFilterOptions({
        divisions: Array.isArray(data.divisions) ? data.divisions : [],
        prodis: Array.isArray(data.prodis) ? data.prodis : [],
        angkatans: Array.isArray(data.angkatans) ? data.angkatans : [],
      });
    } catch (err) {
      console.error('Gagal mengambil opsi filter pengguna:', err);
    }
  }, []);

  // Fetch users data based on active filters & current page
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.division_filter) params.division_filter = filters.division_filter;
      if (filters.prodi_filter) params.prodi_filter = filters.prodi_filter;
      if (filters.angkatan_filter) params.angkatan_filter = filters.angkatan_filter;
      if (filters.sort_by) params.sort_by = filters.sort_by;
      if (filters.sort_direction) params.sort_direction = filters.sort_direction;
      params.page = currentPage;

      const res = await api.get('/api/users', { params });
      const rawData = res.data;
      const data = rawData?.data || (Array.isArray(rawData) ? rawData : []);
      setUsers(Array.isArray(data) ? data : []);
      setPaginationMeta(rawData?.meta || null);
    } catch (err) {
      console.error('Gagal memuat data pengguna:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data pengurus.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Debounce search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        setCurrentPage(1);
        return { ...prev, search: searchInput };
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users whenever filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Cloud Synchronization Handler (Admin Only)
  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const toastId = toast.loading('Menyinkronkan data pengurus dari Cloud...');

    try {
      const res = await api.post('/api/users/sync');
      toast.success(res.data?.message || 'Sinkronisasi data pengurus berhasil!', { id: toastId });
      await fetchUsers();
      await fetchFilterOptions();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Gagal melakukan sinkronisasi dengan Cloud.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper to extract display and value for options
  const getOptionValue = (opt) => (typeof opt === 'object' && opt !== null ? (opt.id ?? opt.name ?? '') : opt);
  const getOptionLabel = (opt) => (typeof opt === 'object' && opt !== null ? (opt.name ?? opt.year ?? '') : opt);

  const lastSyncedAt = useMemo(() => {
    if (users?.length > 0) {
      const timestamps = users.map(u => u?.updated_at || u?.created_at).filter(Boolean);
      if (timestamps.length > 0) return timestamps.sort().reverse()[0];
    }
    return null;
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Master Data Pengurus
              </h1>
              <span className="hidden sm:inline-flex rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-semibold text-primary-600 border border-primary-500/20 dark:text-primary-400">
                {paginationMeta?.total ?? users.length} Pengurus
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              Direktori keanggotaan organisasi terintegrasi.
            </p>
          </div>
        </div>

        <SyncHeaderActions
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
          canSync={isAdmin}
        />
      </div>

      {/* ========================================================================= */}
      {/* Filter Section (Accordion Style on Mobile)                                */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* Toggle Button (Mobile Only) */}
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
            <Filter className="h-4 w-4" />
            <span>PENCARIAN & FILTER</span>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {isFilterOpen ? 'Tutup Filter' : 'Buka Filter'}
          </button>
        </div>

        {/* Header Teks (Desktop Only) */}
        <div className="hidden items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 md:flex mb-4">
          <Filter className="h-4 w-4" />
          <span>PENCARIAN & FILTER</span>
        </div>

        {/* Grid Filter Content */}
        <div className={`mt-4 md:mt-0 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
          {/* 1. Pencarian */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pencarian
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ketik nama, NIM, atau Email..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-8 text-xs outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-2.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Filter Divisi */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Divisi
            </label>
            <div className="relative">
              <select
                value={filters.division_filter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilters((prev) => ({ ...prev, division_filter: e.target.value }));
                }}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-8 text-xs outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
              >
                <option value="">Semua Divisi</option>
                {filterOptions.divisions.map((div, idx) => (
                  <option
                    key={idx}
                    value={getOptionValue(div)}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {getOptionLabel(div)}
                  </option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 3. Filter Prodi */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Program Studi
            </label>
            <div className="relative">
              <select
                value={filters.prodi_filter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilters((prev) => ({ ...prev, prodi_filter: e.target.value }));
                }}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-8 text-xs outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
              >
                <option value="">Semua Prodi</option>
                {filterOptions.prodis.map((prodi, idx) => (
                  <option
                    key={idx}
                    value={getOptionValue(prodi)}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {getOptionLabel(prodi)}
                  </option>
                ))}
              </select>
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 4. Filter Angkatan */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Angkatan
            </label>
            <div className="relative">
              <select
                value={filters.angkatan_filter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilters((prev) => ({ ...prev, angkatan_filter: e.target.value }));
                }}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-8 text-xs outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
              >
                <option value="">Semua Angkatan</option>
                {filterOptions.angkatans.map((angkatan, idx) => (
                  <option
                    key={idx}
                    value={getOptionValue(angkatan)}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {getOptionLabel(angkatan)}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 5. Urutkan */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Urutkan
            </label>
            <div className="relative">
              <select
                value={`${filters.sort_by}-${filters.sort_direction}`}
                onChange={(e) => {
                  const [sort_by, sort_direction] = e.target.value.split('-');
                  setCurrentPage(1);
                  setFilters((prev) => ({ ...prev, sort_by, sort_direction }));
                }}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-8 text-xs outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
              >
                <option value="name-asc">Nama (A - Z)</option>
                <option value="name-desc">Nama (Z - A)</option>
                <option value="nim-asc">NIM (Kecil - Besar)</option>
                <option value="angkatan-desc">Angkatan Terbaru</option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3.C. Data Table & Mobile Cards (Dual View)                                */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* VIEW 1: DESKTOP TABLE (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Pengurus
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Kontak
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Demografi Akademik
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-200 dark:bg-white/10" />
                        <div className="space-y-2">
                          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-white/10" />
                          <div className="flex gap-2">
                            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
                            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-white/10" />
                        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-white/10" />
                        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="ml-auto h-7 w-8 rounded-xl bg-slate-200 dark:bg-white/10" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-500 dark:text-slate-400">
                    <div className="mx-auto flex flex-col items-center justify-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                        <UserX className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Data pengurus tidak ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const divisionName = item.division?.name || item.division_name || item.division || null;
                  const isActive = item.status === 'active';
                  const waLink = getWhatsAppUrl(item.phone, `Halo ${item.name}, dari Pengurus PROTIK...`);
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/5">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-sm ring-2 ring-primary-500/10">
                            {item.name?.charAt(0)?.toUpperCase() ?? 'U'}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                              {item.name}
                            </span>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {item.nim && <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.nim}</span>}
                              {divisionName ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                  <Building2 className="h-3 w-3" />
                                  {divisionName}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400 dark:bg-white/5 dark:text-slate-500">Tanpa Divisi</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300"><Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /><span className="truncate max-w-[200px]">{item.email || '-'}</span></div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500"><Phone className="h-3 w-3 shrink-0" /><span>{item.phone || '-'}</span></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.prodi || '-'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.angkatan ? `Angkatan ${item.angkatan}` : '-'}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Aktif</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Nonaktif</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <ActionMenu
                          groups={[
                            {
                              title: 'Informasi',
                              items: [
                                { label: 'Detail Lengkap', icon: Eye, iconColor: 'text-primary-500', onClick: () => setSelectedUserForDetail(item) },
                                { label: 'Hubungi WhatsApp', icon: MessageCircle, iconColor: 'text-emerald-500', href: waLink, hidden: !item.phone },
                              ],
                            },
                            {
                              title: 'Aksi Sistem',
                              items: [
                                { label: 'Kelola Hak Akses', icon: UserCog, iconColor: 'text-amber-500', onClick: () => { setSelectedUser(item); setIsModalOpen(true); }, hidden: !isAdmin },
                              ],
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW 2: MOBILE CARD LIST (block md:hidden) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-1.5 flex-1"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" /></div>
                  </div>
                  <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <UserX className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold">Data pengurus tidak ditemukan</p>
            </div>
          ) : (
            users.map((item) => {
              const divisionName = item.division?.name || item.division_name || item.division || null;
              const isActive = item.status === 'active';
              const waLink = getWhatsAppUrl(item.phone, `Halo ${item.name}, dari Pengurus PROTIK...`);
              return (
                <div key={item.id} className="p-4 space-y-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-sm ring-2 ring-primary-500/10">{item.name?.charAt(0)?.toUpperCase() ?? 'U'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap"><h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>{isActive ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><span className="h-1 w-1 rounded-full bg-emerald-500" />Aktif</span> : <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20"><span className="h-1 w-1 rounded-full bg-rose-500" />Nonaktif</span>}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">{item.nim && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.nim}</span>}{divisionName && <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">{divisionName}</span>}</div>
                      </div>
                    </div>
                    <div className="shrink-0 -mr-1 -mt-1">
                      <ActionMenu
                        groups={[
                          {
                            title: 'Informasi',
                            items: [
                              { label: 'Detail Lengkap', icon: Eye, iconColor: 'text-primary-500', onClick: () => setSelectedUserForDetail(item) },
                              { label: 'Hubungi WhatsApp', icon: MessageCircle, iconColor: 'text-emerald-500', href: waLink, hidden: !item.phone },
                            ],
                          },
                          {
                            title: 'Aksi Sistem',
                            items: [
                              { label: 'Kelola Hak Akses', icon: UserCog, iconColor: 'text-amber-500', onClick: () => { setSelectedUser(item); setIsModalOpen(true); }, hidden: !isAdmin },
                            ],
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" /><span>{item.prodi || '-'} {item.angkatan ? `• Angkatan ${item.angkatan}` : ''}</span></div>
                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" /><span className="truncate">{item.email || '-'}</span></div>
                  </div>
                  {item.phone && <div className="pt-2 border-t border-dashed border-slate-100 dark:border-white/5"><a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400"><MessageCircle className="h-3 w-3" /><span>Chat WhatsApp ({item.phone})</span></a></div>}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {paginationMeta && paginationMeta.last_page > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Halaman {paginationMeta.current_page} dari {paginationMeta.last_page} (Total {paginationMeta.total} Pengurus)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= paginationMeta.last_page || isLoading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail User (Termasuk Alamat & Profil Lengkap) */}
      <UserDetailModal
        isOpen={!!selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
        user={selectedUserForDetail}
      />

      {/* Modal Edit Hak Akses / Role / Status (Admin Only) */}
      {isModalOpen && selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
          }}
          initialData={selectedUser}
          divisions={filterOptions.divisions}
        />
      )}
    </div>
  );
}
