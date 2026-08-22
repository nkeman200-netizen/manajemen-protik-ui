import { useState } from 'react';
import useSWR from 'swr';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, RefreshCw, CheckCircle2, XCircle, Wallet } from 'lucide-react';

export default function MonthlyDue() {
  // Menggunakan inline fetcher murni untuk menghindari pemotongan data (res.data.data) oleh fetcher global
  const { data, error, isLoading, mutate } = useSWR(
    '/api/monthly-dues',
    async (url) => {
      const res = await api.get(url);
      return res.data; // Mengambil langsung object {users: [], dues: []}
    }
  );

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post('/api/monthly-dues/sync');
      toast.success(res.data.message);
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal sinkronisasi');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Gagal memuat data kas.
      </div>
    );
  }

  // Fallback standar (Kembalikan kode ini ke bentuk semula)
  const users = data?.users || [];
  const dues = data?.dues || [];

  // Definisi Bulan sesuai urutan kepengurusan Protik (Okt -> Sep)
  const monthList = [
    { num: 10, name: 'Okt' },
    { num: 11, name: 'Nov' },
    { num: 12, name: 'Des' },
    { num: 1, name: 'Jan' },
    { num: 2, name: 'Feb' },
    { num: 3, name: 'Mar' },
    { num: 4, name: 'Apr' },
    { num: 5, name: 'Mei' },
    { num: 6, name: 'Jun' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kas Pengurus</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pemantauan kepatuhan iuran (Single Source of Truth dari Spreadsheet).
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Cloud'}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-transparent dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Nama Pengurus</th>
                {monthList.map((m) => (
                  <th key={m.num} className="px-3 py-3.5 text-center">
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </td>
                  {monthList.map((m) => {
                    const isPaid = dues.find((d) => d.user_id === user.id && d.month === m.num);
                    return (
                      <td key={m.num} className="px-3 py-4 text-center">
                        <div className="flex justify-center">
                          {isPaid ? (
                            <div className="group relative">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                                Rp {Number(isPaid.amount).toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <XCircle className="h-5 w-5 text-rose-200 dark:text-rose-500/30" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
