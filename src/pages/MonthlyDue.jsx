import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, RefreshCw, CheckCircle2, XCircle, Wallet, Search, Filter, ArrowUpDown, Building2, Minus } from 'lucide-react';

// --- MESIN WAKTU PROTIK (PERBAIKAN LOGIKA) ---
const getMonthIndex = (m) => {
  if (m >= 7 && m <= 9) return 0;       // Jul, Ags, Sep -> Pre-periode (Indeks 0)
  if (m >= 10 && m <= 12) return m - 9; // Okt(1), Nov(2), Des(3)
  if (m >= 1 && m <= 6) return m + 3;   // Jan(4) ... Jun(9)
  return 99; 
};

const currentMonthNum = new Date().getMonth() + 1;
const currentIdx = getMonthIndex(currentMonthNum);

const isFutureMonth = (targetMonth) => {
  return getMonthIndex(targetMonth) > currentIdx;
};

export default function MonthlyDue() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((r) => r.name === 'admin') || user?.roles?.[0]?.name === 'admin';

  const { data, error, isLoading, mutate } = useSWR(
    '/api/monthly-dues',
    async (url) => {
      const res = await api.get(url);
      return res.data;
    }
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  
  // State untuk UI Mobile Responsif (toggle di HP)
  const [showFilter, setShowFilter] = useState(false);

  const rawUsers = Array.isArray(data?.users) ? data.users : [];
  const dues = Array.isArray(data?.dues) ? data.dues : [];

  const monthList = useMemo(() => [
    { num: 10, name: 'Okt' }, { num: 11, name: 'Nov' }, { num: 12, name: 'Des' },
    { num: 1, name: 'Jan' }, { num: 2, name: 'Feb' }, { num: 3, name: 'Mar' },
    { num: 4, name: 'Apr' }, { num: 5, name: 'Mei' }, { num: 6, name: 'Jun' },
  ], []);

  const divisions = useMemo(() => {
    return [...new Set(rawUsers.map(u => u?.division?.name).filter(Boolean))];
  }, [rawUsers]);

  const processedUsers = useMemo(() => {
    let filtered = rawUsers.map(user => {
      let paidCount = 0;
      let overdueCount = 0;

      monthList.forEach(m => {
        const isPaid = dues.some(d => d?.user_id === user?.id && Number(d?.month) === m.num);
        const isFuture = isFutureMonth(m.num);

        if (isPaid) paidCount++;
        else if (!isPaid && !isFuture) overdueCount++;
      });

      return { ...user, stats: { paidCount, overdueCount } };
    });

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(u => {
        const nameStr = u?.name ? String(u.name).toLowerCase() : '';
        const nimStr = u?.nim ? String(u.nim).toLowerCase() : '';
        return nameStr.includes(q) || nimStr.includes(q);
      });
    }

    if (divisionFilter) {
      filtered = filtered.filter(u => u?.division?.name === divisionFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name_asc') return String(a?.name || '').localeCompare(String(b?.name || ''));
      if (sortBy === 'name_desc') return String(b?.name || '').localeCompare(String(a?.name || ''));
      if (sortBy === 'most_active') return (b?.stats?.paidCount || 0) - (a?.stats?.paidCount || 0);
      if (sortBy === 'most_overdue') return (b?.stats?.overdueCount || 0) - (a?.stats?.overdueCount || 0);
      return 0;
    });

    return filtered;
  }, [rawUsers, dues, search, divisionFilter, sortBy, monthList]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post('/api/monthly-dues/sync');
      toast.success(res.data?.message || 'Sinkronisasi berhasil.');
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal sinkronisasi');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-emerald-500"/></div>;
  if (error) return <div className="text-center text-red-500 py-16 font-semibold">Gagal memuat data kas.</div>;

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
            <Wallet className="h-5 w-5 text-white"/>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kas Pengurus</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pemantauan kepatuhan iuran terintegrasi Spreadsheet.</p>
          </div>
        </div>
        
        {isAdmin && (<button onClick={handleSync} disabled={isSyncing} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Cloud'}</span>
        </button>)}
      </div>

      {/* FILTER CARD (Diseragamkan dengan Keuangan) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/5 dark:bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4 text-emerald-500"/>
            PENCARIAN & FILTER
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 md:hidden"
          >
            <Filter className="h-3 w-3"/>
            {showFilter ? 'Tutup Filter' : 'Buka Filter'}
          </button>
        </div>

        {/* Konten Filter: Selalu tampil di Desktop (md:grid), dan toggleable di Mobile */}
        <div className={`p-6 gap-5 md:grid md:grid-cols-3 ${showFilter ? 'grid grid-cols-1' : 'hidden'}`}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cari Pengurus</label>
            <div className="relative">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik nama atau NIM..." className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter Divisi</label>
            <div className="relative">
              <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="appearance-none w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white">
                <option value="">Semua Divisi</option>
                {divisions.map(div => <option key={div} value={div}>{div}</option>)}
              </select>
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Urutkan Berdasarkan</label>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-white">
                <option value="name_asc">Nama (A - Z)</option>
                <option value="name_desc">Nama (Z - A)</option>
                <option value="most_active">Paling Rajin Bayar</option>
                <option value="most_overdue">Tunggakan Terbanyak</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
            </div>
          </div>
        </div>
      </div>

      {/* DATA GRID TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/50">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
              <tr>
                <th className="min-w-[250px] px-6 py-4">Nama Pengurus</th>
                {monthList.map((m) => <th key={m.num} className="px-3 py-4 text-center">{m.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {processedUsers.length > 0 ? processedUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{user?.name || 'Tanpa Nama'}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {user?.nim && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 dark:bg-white/10">{user.nim}</span>}
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3 text-emerald-500"/> {user?.division?.name || 'BPH Pusat'}</span>
                    </div>
                  </td>
                  {monthList.map((m) => {
                    const isPaidObj = dues.find((d) => d?.user_id === user?.id && Number(d?.month) === m.num);
                    const isFuture = isFutureMonth(m.num);

                    return (
                      <td key={m.num} className="px-3 py-4 text-center">
                        <div className="flex justify-center">
                          {isPaidObj ? (
                            <div className="group relative">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-sm"/>
                              <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                                Rp {Number(isPaidObj?.amount || 0).toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : isFuture ? (
                            <div className="group relative">
                              <Minus className="h-5 w-5 text-slate-300 dark:text-slate-600"/>
                              <span className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                                Belum Waktunya
                              </span>
                            </div>
                          ) : (
                            <div className="group relative">
                              <XCircle className="h-5 w-5 text-rose-500 drop-shadow-sm"/>
                              <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-rose-600 px-2 py-1 text-[10px] text-white group-hover:block shadow-lg shadow-rose-500/20">
                                Menunggak
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">
                    Tidak ada pengurus yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
