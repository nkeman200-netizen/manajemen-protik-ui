import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Activity, ShieldAlert, Loader2, AlertCircle, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'dd MMM yyyy HH:mm:ss', { locale: localeID });
}

export default function AuditTrail() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedAudit, setSelectedAudit] = useState(null);

  const isAdmin = user?.roles?.[0]?.name === 'admin';
  const { data, error, isLoading } = useSWR(isAdmin ? `/api/audit-trails?page=${page}` : null, paginatedFetcher);

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

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-primary-500"/></div>;
  if (error) return <div className="flex justify-center py-16"><AlertCircle className="h-10 w-10 text-red-500"/></div>;

  const audits = data?.data?.data || (Array.isArray(data?.data) ? data.data : []) || [];
  const meta = data?.meta || (data?.data && !Array.isArray(data?.data) ? data.data : null);

  const getActionBadge = (action) => {
    switch (action) {
      case 'created': return <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Created</span>;
      case 'updated': return <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Updated</span>;
      case 'deleted': return <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600 dark:text-red-400">Deleted</span>;
      default: return action;
    }
  };

  const formatModelName = (modelPath) => {
    if (!modelPath) return '-';
    const parts = modelPath.split('\\');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
          <Activity className="h-5 w-5 text-white"/>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Log Aktivitas Sistem</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Jejak audit seluruh perubahan data (Audit Trail).</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-transparent dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Waktu</th>
                <th className="px-6 py-3.5">Aktor</th>
                <th className="px-6 py-3.5">Aksi</th>
                <th className="px-6 py-3.5">Modul (ID)</th>
                <th className="px-6 py-3.5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {audits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-600 dark:text-slate-300">{formatTanggalWaktu(item.created_at)}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">{item.user?.name || 'System'}</td>
                  <td className="whitespace-nowrap px-6 py-4">{getActionBadge(item.action)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">{formatModelName(item.auditable_type)} #{item.auditable_id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button onClick={() => setSelectedAudit(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      <Eye className="h-3.5 w-3.5"/> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Halaman {meta.current_page} dari {meta.last_page}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-white"><ChevronLeft className="h-4 w-4"/></button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= meta.last_page} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-white"><ChevronRight className="h-4 w-4"/></button>
            </div>
          </div>
        )}
      </div>

      {/* JSON Viewer Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAudit(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">Detail Perubahan JSON</h3>
              <button onClick={() => setSelectedAudit(null)}><X className="h-5 w-5 text-slate-500"/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-xs font-bold text-slate-500">Nilai Lama (Old)</p>
                <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-[10px] text-emerald-400">{JSON.stringify(selectedAudit.old_values, null, 2) || 'null'}</pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-slate-500">Nilai Baru (New)</p>
                <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-[10px] text-emerald-400">{JSON.stringify(selectedAudit.new_values, null, 2) || 'null'}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
