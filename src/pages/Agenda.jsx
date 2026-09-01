import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher, fetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import AttendanceModal from '../components/AttendanceModal';
import ActionMenu from '../components/ActionMenu';
import { TableSkeleton, DirectoryCardSkeleton } from '../components/SkeletonLoader';
import SyncHeaderActions from '../components/SyncHeaderActions';
import {
  ChevronLeft, ChevronRight, Loader2, AlertCircle, CalendarClock, ExternalLink,
  ArrowLeft, Calendar, User, Search, UserCheck, RefreshCw, MapPin, Filter, Activity
} from 'lucide-react';

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  try { return format(new Date(dateStr), 'd MMM yyyy, HH:mm', { locale: localeID }); }
  catch { return dateStr; }
}

export default function Agenda() {
  const { user } = useAuth();
  const { data: settingsData } = useSWR('/api/settings', fetcher);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [page, setPage] = useState(1);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const [statusFilter, setStatusFilter] = useState('');
  const [locationType, setLocationType] = useState(''); // '' | 'lainnya' | specific_location
  const [customLocation, setCustomLocation] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedAgendaForAttendance, setSelectedAgendaForAttendance] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, locationType, customLocation, dateRange.start, dateRange.end]);

  // Fetch Events for Directory
  const { data: eventsData, error: eventsError, isLoading: eventsLoading } = useSWR(
    !activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher
  );

  // Fetch Dropdown Filters
  const { data: filterData } = useSWR(
    activeWorkspace ? `/api/agendas/filters?event_id=${activeWorkspace.id || ''}` : null, fetcher
  );

  // Fetch Agendas
  let agendaUrl = null;
  if (activeWorkspace) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    if (activeWorkspace.id) params.append('event_id', String(activeWorkspace.id));
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (statusFilter) params.append('status_filter', statusFilter);
    if (dateRange.start) params.append('start_date', dateRange.start);
    if (dateRange.end) params.append('end_date', dateRange.end);
    
    const finalLocation = locationType === 'lainnya' ? customLocation : locationType;
    if (finalLocation) params.append('location_filter', finalLocation);

    agendaUrl = `/api/agendas?${params.toString()}`;
  }

  const { data: agendasData, error: agendasError, isLoading: agendasLoading, mutate: mutateAgendas } = useSWR(agendaUrl, paginatedFetcher);

  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(c => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position));
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const payload = activeWorkspace?.id ? { event_id: activeWorkspace.id } : {};
      const res = await api.post('/api/agendas/sync', payload);
      toast.success(res.data.message || 'Sinkronisasi berhasil.');
      mutateAgendas();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal sinkronisasi.'); } 
    finally { setIsSyncing(false); }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('selesai') || s.includes('berhasil') || s.includes('terlaksana')) return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20';
    if (s.includes('berjalan') || s.includes('proses')) return 'bg-blue-500/15 text-blue-600 border-blue-500/20';
    if (s.includes('kendala') || s.includes('batal')) return 'bg-red-500/15 text-red-600 border-red-500/20';
    if (s.includes('reschedule') || s.includes('tunda')) return 'bg-amber-500/15 text-amber-600 border-amber-500/20';
    return 'bg-slate-500/15 text-slate-600 border-slate-500/20 dark:text-slate-400';
  };

  const agendas = agendasData?.data?.data || (Array.isArray(agendasData?.data) ? agendasData.data : []) || [];
  const meta = agendasData?.meta || (agendasData?.data && !Array.isArray(agendasData?.data) ? agendasData.data : null);

  const lastSyncedAt = useMemo(() => {
    if (agendasData?.last_synced_at) return agendasData.last_synced_at;
    if (agendas?.length > 0) {
      const timestamps = agendas.map(a => a?.updated_at || a?.created_at).filter(Boolean);
      if (timestamps.length > 0) return timestamps.sort().reverse()[0];
    }
    return null;
  }, [agendasData, agendas]);

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800 dark:text-white";

  // ==========================================
  // VIEW 1: DIRECTORY MODE
  // ==========================================
  if (!activeWorkspace) {
    if (eventsError) return <div className="text-center text-red-500 py-16">Gagal memuat direktori event.</div>;

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];
    return (
      <div className="space-y-8 animate-slide-up-fade">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg"><CalendarClock className="h-5 w-5 text-white"/></div>
          <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Agenda</h1><p className="text-xs text-slate-500 dark:text-slate-400">Pilih ruang kerja untuk melihat timeline.</p></div>
        </div>
        {eventsLoading ? (
          <DirectoryCardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div onClick={() => { setActiveWorkspace({ id: null, name: 'Agenda Umum BPH Pusat', type: 'global' }); setPage(1); }} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 dark:border-blue-500/20 dark:from-blue-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-blue-500/15">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-blue-500/30 dark:bg-blue-500/10" />
              <div className="flex items-center justify-between mb-4"><CalendarClock className="h-8 w-8 text-blue-600"/><span className="rounded-full bg-blue-500/15 px-3 py-1 text-[10px] font-bold uppercase text-blue-600">BPH Pusat</span></div>
              <h3 className="font-bold text-slate-900 dark:text-white">Agenda BPH Pusat</h3>
              <p className="text-xs text-slate-500 mt-1">Timeline kegiatan operasional organisasi.</p>
            </div>
            {eventList.map((event) => (
              <div key={event.id} onClick={() => { setActiveWorkspace(event); setPage(1); }} className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4"><Calendar className="h-8 w-8 text-primary-600"/><span className="rounded-full bg-primary-500/10 px-3 py-1 text-[10px] font-bold uppercase text-primary-600">Event</span></div>
                <h3 className="font-bold text-slate-900 line-clamp-1 dark:text-white">{event.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Ruang kerja timeline kepanitiaan.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE
  // ==========================================
  return (
    <div className="space-y-6 animate-slide-up-fade">
      <button onClick={() => { setActiveWorkspace(null); setSearch(''); setDebouncedSearch(''); setLocationType(''); setStatusFilter(''); setDateRange({start:'', end:''}); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white"><ArrowLeft className="h-4 w-4"/> Kembali ke Direktori</button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg"><CalendarClock className="h-5 w-5 text-white"/></div>
          <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1><p className="text-xs text-slate-500 dark:text-slate-400">{meta?.total ?? agendas.length} agenda kegiatan</p></div>
        </div>
        
        <SyncHeaderActions
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
          canSync={canEdit}
        />
      </div>

      {/* FILTER PANEL GROUP */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/5 dark:bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4 text-blue-500"/> PENCARIAN & FILTER
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="md:hidden flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            <Filter className="h-3 w-3"/> {showFilter ? 'Tutup Filter' : 'Buka Filter'}
          </button>
        </div>

        {showFilter && (
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pencarian Teks</label>
              <div className="relative"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama agenda..." className={inputClass} /><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lokasi / Tempat</label>
              <div className="relative">
                <select value={locationType} onChange={(e) => { setLocationType(e.target.value); setCustomLocation(''); }} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Lokasi</option>
                  {filterData?.locations?.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status Pelaksanaan</label>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Status</option>
                  {filterData?.statuses?.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                <Activity className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rentang Waktu</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({...p, start: e.target.value}))} className="w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({...p, end: e.target.value}))} className="w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CONTAINER (Dual View: Desktop Table + Mobile Cards) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* VIEW 1: DESKTOP TABLE (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              <tr><th className="px-6 py-3.5">Agenda Kegiatan</th><th className="px-6 py-3.5">Waktu & Tempat</th><th className="px-6 py-3.5">PJ / Divisi</th><th className="px-6 py-3.5 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {agendasLoading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : agendas.length > 0 ? (
                agendas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">{item.title}</div>
                      <div className="mt-1.5"><span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>{item.status || 'Belum Ditentukan'}</span></div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/> {formatTanggalWaktu(item.start_date)} {item.end_date && `- ${formatTanggalWaktu(item.end_date)}`}</div>
                      {item.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400"/> {item.location}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400"/> {item.pic || 'Belum Ada PIC'}</div></td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <ActionMenu
                        groups={[
                          {
                            title: 'Tautan Kegiatan',
                            items: [
                              {
                                label: 'Buka Notulensi / Materi',
                                icon: ExternalLink,
                                iconColor: 'text-blue-500',
                                href: item.minutes_url,
                                hidden: !item.minutes_url,
                              },
                            ],
                          },
                          {
                            title: 'Aksi Agenda',
                            items: [
                              {
                                label: 'Kelola Absensi',
                                icon: UserCheck,
                                iconColor: 'text-emerald-500',
                                onClick: () => {
                                  setSelectedAgendaForAttendance(item);
                                  setAttendanceModalOpen(true);
                                },
                                hidden: !canEdit,
                              },
                            ],
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">Tidak ada agenda yang cocok dengan filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW 2: MOBILE CARD LIST (block md:hidden) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {agendasLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200/60 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : agendas.length > 0 ? (
            agendas.map((item) => (
              <div key={item.id} className="p-4 space-y-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                {/* Header: Title, Status Badge & ActionMenu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <div>
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                        {item.status || 'Belum Ditentukan'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 -mr-1 -mt-1">
                    <ActionMenu
                      groups={[
                        {
                          title: 'Tautan Kegiatan',
                          items: [
                            {
                              label: 'Buka Notulensi / Materi',
                              icon: ExternalLink,
                              iconColor: 'text-blue-500',
                              href: item.minutes_url,
                              hidden: !item.minutes_url,
                            },
                          ],
                        },
                        {
                          title: 'Aksi Agenda',
                          items: [
                            {
                              label: 'Kelola Absensi',
                              icon: UserCheck,
                              iconColor: 'text-emerald-500',
                              onClick: () => {
                                setSelectedAgendaForAttendance(item);
                                setAttendanceModalOpen(true);
                              },
                              hidden: !canEdit,
                            },
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Details: Time, Location, PIC */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>
                      {formatTanggalWaktu(item.start_date)} {item.end_date && `- ${formatTanggalWaktu(item.end_date)}`}
                    </span>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>PJ: <strong className="font-semibold text-slate-700 dark:text-slate-300">{item.pic || 'Belum Ada PIC'}</strong></span>
                  </div>
                </div>

                {/* Footer Quick Action: Minutes URL & Absensi */}
                {(item.minutes_url || canEdit) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-slate-100 dark:border-white/5">
                    {item.minutes_url && (
                      <a
                        href={item.minutes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Materi / Notulensi</span>
                      </a>
                    )}
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAgendaForAttendance(item);
                          setAttendanceModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400"
                      >
                        <UserCheck className="h-3 w-3" />
                        <span>Presensi</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Tidak ada agenda yang cocok dengan filter.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Halaman {meta.current_page} dari {meta.last_page}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-white"><ChevronLeft className="h-4 w-4"/></button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= meta.last_page} className="rounded-xl border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-white"><ChevronRight className="h-4 w-4"/></button>
            </div>
          </div>
        )}
      </div>

      <AttendanceModal isOpen={attendanceModalOpen} onClose={() => { setAttendanceModalOpen(false); setSelectedAgendaForAttendance(null); }} meeting={selectedAgendaForAttendance} activeEventId={activeWorkspace?.id} />
    </div>
  );
}
