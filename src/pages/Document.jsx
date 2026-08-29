import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher, fetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import DocumentModal from '../components/DocumentModal';
import ConfirmModal from '../components/ConfirmModal';
import GenerateDocumentModal from '../components/GenerateDocumentModal';
import {
  Plus, ChevronLeft, ChevronRight, Loader2, AlertCircle, FileText, FileBadge,
  ArrowLeft, Calendar, User, Pencil, Trash2, Eye, Layers,
  ChevronRight as ChevronRightIcon, Search, RefreshCw, MoreVertical, Send, Inbox,
  Filter, Tag, Building2, MapPin
} from 'lucide-react';

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  try { return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID }); }
  catch { return dateStr; }
}

export default function Document() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('outgoing');
  const [page, setPage] = useState(1);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const [classificationFilter, setClassificationFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');

  const [isSyncing, setIsSyncing] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [classificationFilter, originFilter, destinationFilter]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setClassificationFilter('');
    setOriginFilter('');
    setDestinationFilter('');
  };

  const { data: eventsData, error: eventsError, isLoading: eventsLoading } = useSWR(
    !activeWorkspace ? '/api/events?page=1' : null, paginatedFetcher
  );

  // Fetch Dropdown Filters
  const { data: filterData } = useSWR(
    activeWorkspace ? `/api/documents/filters?type=${activeTab}&event_id=${activeWorkspace.id || ''}` : null, fetcher
  );

  let documentUrl = null;
  if (activeWorkspace) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('type', activeTab);
    if (activeWorkspace.id) params.append('event_id', String(activeWorkspace.id));
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (classificationFilter) params.append('classification_filter', classificationFilter);
    if (activeTab === 'incoming' && originFilter) params.append('origin_filter', originFilter);
    if (activeTab === 'outgoing' && destinationFilter) params.append('destination_filter', destinationFilter);
    documentUrl = `/api/documents?${params.toString()}`;
  }

  const { data: documentsData, error: documentsError, isLoading: documentsLoading, mutate: mutateDocuments } = useSWR(documentUrl, paginatedFetcher);

  const isGlobalAdmin = user?.roles?.[0]?.name === 'admin';
  const isCommittee = activeWorkspace?.committees?.some(c => c.user_id === user?.id && ['Ketua', 'Sekretaris'].includes(c.position?.name || c.position));
  const canEdit = isGlobalAdmin || (activeWorkspace?.id !== null && isCommittee);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const payload = activeWorkspace?.id ? { event_id: activeWorkspace.id } : {};
      const res = await api.post('/api/documents/sync', payload);
      toast.success(res.data.message || 'Sinkronisasi berhasil.');
      mutateDocuments();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal sinkronisasi.'); } 
    finally { setIsSyncing(false); }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/documents/${deleteTarget.id}`);
      toast.success('Surat berhasil dihapus.');
      mutateDocuments();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menghapus surat.'); } 
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-primary-500 dark:border-white/10 dark:bg-slate-800 dark:text-white";

  // ==========================================
  // VIEW 1: DIRECTORY MODE
  // ==========================================
  if (!activeWorkspace) {
    if (eventsLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>;
    if (eventsError) return <div className="text-center text-red-500 py-16">Gagal memuat direktori.</div>;

    const eventList = eventsData?.data?.data || (Array.isArray(eventsData?.data) ? eventsData.data : []) || [];
    return (
      <div className="space-y-8 animate-slide-up-fade">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg"><Layers className="h-5 w-5 text-white" /></div>
          <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Direktori Dokumen & Surat</h1><p className="text-xs text-slate-500 dark:text-slate-400">Pilih ruang kerja dokumen umum atau kepanitiaan event.</p></div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => { setActiveWorkspace({ id: null, name: 'Dokumen Umum BPH Pusat', type: 'global' }); setPage(1); setSearch(''); setActiveTab('outgoing'); }} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-500/20 dark:from-violet-950/40 dark:via-slate-900/70 dark:to-slate-950/80 dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-violet-500/15">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl transition-opacity duration-300 group-hover:bg-violet-500/30 dark:bg-violet-500/10" />
            <div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600 dark:text-violet-400"><FileText className="h-6 w-6" /></div><span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase text-violet-600 dark:text-violet-400">BPH Pusat</span></div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Dokumen Umum BPH Pusat</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">Pencatatan dan arsip operasional umum organisasi.</p>
          </div>
          {eventList.map((event) => (
            <div key={event.id} onClick={() => { setActiveWorkspace(event); setPage(1); setSearch(''); setActiveTab('outgoing'); }} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-600 dark:text-primary-400"><Calendar className="h-6 w-6" /></div><span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase text-primary-600 dark:text-primary-400">Event</span></div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 line-clamp-1 dark:text-white">{event.name}</h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">Ruang kerja surat menyurat kepanitiaan.</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKSPACE MODE
  // ==========================================
  const documents = documentsData?.data?.data || (Array.isArray(documentsData?.data) ? documentsData.data : []) || [];
  const meta = documentsData?.meta || (documentsData?.data && !Array.isArray(documentsData?.data) ? documentsData.data : null);

  return (
    <div className="space-y-6 animate-slide-up-fade">
      <button onClick={() => { setActiveWorkspace(null); setPage(1); setSearch(''); setDebouncedSearch(''); setClassificationFilter(''); setOriginFilter(''); setDestinationFilter(''); setShowFilter(false); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ArrowLeft className="h-4 w-4" /> Kembali ke Direktori</button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ${activeWorkspace.id === null ? 'bg-gradient-to-br from-violet-500 to-violet-700' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}><FileText className="h-5 w-5 text-white" /></div>
          <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeWorkspace.name}</h1><p className="text-xs text-slate-500 dark:text-slate-400">Pusat arsip dokumen.</p></div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-3">
            <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"><RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Sync</span></button>
            <button onClick={() => setGenerateModalOpen(true)} className="flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-100 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400"><FileText className="h-4 w-4" /> Dapur Surat</button>
            <button onClick={() => { setSelectedDocument(null); setIsReadOnlyModal(false); setModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl"><Plus className="h-4 w-4" /> Arsipkan</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
        <button onClick={() => switchTab('outgoing')} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${activeTab === 'outgoing' ? 'bg-primary-600/15 text-primary-700 shadow-sm dark:bg-primary-600/20 dark:text-primary-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}><Send className="h-4 w-4" /> Surat Keluar</button>
        <button onClick={() => switchTab('incoming')} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${activeTab === 'incoming' ? 'bg-indigo-600/15 text-indigo-700 shadow-sm dark:bg-indigo-600/20 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}><Inbox className="h-4 w-4" /> Surat Masuk</button>
      </div>

      {/* FILTER PANEL GROUP */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/5 dark:bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4 text-primary-500"/> PENCARIAN & FILTER
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="md:hidden flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            <Filter className="h-3 w-3"/> {showFilter ? 'Tutup Filter' : 'Buka Filter'}
          </button>
        </div>

        {showFilter && (
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pencarian Teks</label>
              <div className="relative"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nomor / perihal surat..." className={inputClass} /><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Klasifikasi Surat</label>
              <div className="relative">
                <select value={classificationFilter} onChange={(e) => setClassificationFilter(e.target.value)} className={`appearance-none ${inputClass}`}>
                  <option value="">Semua Klasifikasi</option>
                  {filterData?.classifications?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{activeTab === 'outgoing' ? 'Tujuan / Destinasi' : 'Asal / Pengirim'}</label>
              <div className="relative">
                <select 
                  value={activeTab === 'outgoing' ? destinationFilter : originFilter} 
                  onChange={(e) => activeTab === 'outgoing' ? setDestinationFilter(e.target.value) : setOriginFilter(e.target.value)} 
                  className={`appearance-none ${inputClass}`}
                >
                  <option value="">Semua Instansi</option>
                  {activeTab === 'outgoing' 
                    ? filterData?.destinations?.map(d => <option key={d} value={d}>{d}</option>) 
                    : filterData?.origins?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {activeTab === 'outgoing' ? <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/> : <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto pb-32 min-h-[300px]">
          {documentsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
          ) : documents.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Detail Surat</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{activeTab === 'outgoing' ? 'Tujuan / Penerima' : 'Asal / Pengirim'}</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Staff / Pembuat</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {documents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5"><span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-mono font-bold text-slate-700 w-max dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/5">{item.letter_number}</span><p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>{item.activity_date && (<div className="flex items-center gap-1 text-[10px] font-medium text-slate-500"><Calendar className="h-3 w-3" /> Pelaksanaan: {formatTanggal(item.activity_date)}</div>)}</div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{activeTab === 'outgoing' ? (item.destination || '-') : (item.origin || '-')}</span></td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400"><div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{item.creator?.name ?? 'Sistem'}</div></td>
                    <td className="relative whitespace-nowrap px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === item.id ? null : item.id); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-white"><MoreVertical className="h-4 w-4" /></button>
                      {openDropdownId === item.id && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute right-10 top-4 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-800">
                          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tautan Dokumen</div>
                          {item.letter_link && <a href={item.letter_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"><FileText className="h-4 w-4 text-blue-500" /> Draft (Word)</a>}
                          {item.scan_link && <a href={item.scan_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"><FileBadge className="h-4 w-4 text-red-500" /> Scan Valid (PDF)</a>}
                          <div className="my-1 h-px bg-slate-100 dark:bg-white/10"></div>
                          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Aksi Data</div>
                          <button onClick={() => { setOpenDropdownId(null); setSelectedDocument(item); setIsReadOnlyModal(!canEdit); setModalOpen(true); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">{canEdit ? <><Pencil className="h-4 w-4 text-amber-500" /> Edit Metadata</> : <><Eye className="h-4 w-4 text-indigo-500" /> Detail Surat</>}</button>
                          {canEdit && <button onClick={() => { setOpenDropdownId(null); setDeleteTarget(item); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /> Hapus Surat</button>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400">Tidak ada dokumen yang cocok dengan filter.</div>
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

      <DocumentModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedDocument(null); setIsReadOnlyModal(false); }} onSuccess={() => mutateDocuments()} currentUserId={user?.id} initialData={selectedDocument} isReadOnly={isReadOnlyModal} activeEventId={activeWorkspace?.id} />
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={executeDelete} title="Hapus Surat" message={`Yakin hapus surat nomor "${deleteTarget?.letter_number}"?`} confirmText="Hapus Permanen" isLoading={isDeleting} isDanger={true} />
      <GenerateDocumentModal isOpen={generateModalOpen} onClose={() => setGenerateModalOpen(false)} activeEventId={activeWorkspace?.id} />
    </div>
  );
}
