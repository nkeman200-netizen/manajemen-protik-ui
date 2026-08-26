import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import * as XLSX from 'xlsx';
import { X, Loader2, UserCheck, Save, CheckCircle2, Target, Users, Search, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { fetcher, paginatedFetcher } from '../api/fetcher';
import toast from 'react-hot-toast';

export default function AttendanceModal({ isOpen, onClose, meeting: agenda, activeEventId }) {
  const [activeTab, setActiveTab] = useState('targets');
  const [localData, setLocalData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // FETCH SEMUA DATA SEKALIGUS (Data Blending)
  const { data: usersData, isLoading: usersLoading } = useSWR(isOpen ? '/api/users?all=true' : null, fetcher);
  const { data: divData } = useSWR(isOpen ? '/api/divisions' : null, fetcher);
  const { data: committeeData } = useSWR(isOpen && activeEventId ? `/api/event-committees?event_id=${activeEventId}` : null, fetcher);
  const { data: attendanceData, isLoading: attendanceLoading, mutate: mutateAttendance } = useSWR(
    isOpen && agenda ? `/api/agenda-attendances?agenda_id=${agenda.id}` : null,
    paginatedFetcher
  );

  const allUsers = useMemo(() => Array.isArray(usersData) ? usersData : (usersData?.data || []), [usersData]);
  const divisions = useMemo(() => Array.isArray(divData) ? divData : (divData?.data || []), [divData]);
  const committees = useMemo(() => Array.isArray(committeeData) ? committeeData : (committeeData?.data || []), [committeeData]);
  const existingAttendances = useMemo(() => Array.isArray(attendanceData) ? attendanceData : (attendanceData?.data || []), [attendanceData]);

  // FIX 1: EKSTRAK JABATAN PANITIA UNIK (Pastikan mengekstrak string .name dari Object)
  const eventPositions = useMemo(() => {
    if (!activeEventId) return [];
    return [...new Set(committees.map(c => c.position?.name))].filter(Boolean);
  }, [committees, activeEventId]);

  useEffect(() => {
    if (isOpen && agenda) {
      setIsDataLoaded(false);
      if (agenda.targets && agenda.targets.length > 0) {
        setSelectedTargets(agenda.targets.map((t) => ({ type: t.target_type, value: t.target_value })));
        setActiveTab('attendance');
      } else {
        setSelectedTargets([]);
        setActiveTab('targets');
      }
    } else {
      setActiveTab('targets');
    }
  }, [isOpen, agenda]);

  // MESIN FILTER PINTAR
  const isAllInvited = selectedTargets.length === 0 || selectedTargets.some((t) => t.type === 'all');
  const targetedUsers = useMemo(() => {
    return allUsers.filter((user) => {
      if (isAllInvited) return activeEventId ? committees.some(c => c.user_id === user.id) : true;

      return selectedTargets.some((t) => {
        if (t.type === 'bph') return user.roles?.[0]?.name === 'admin';
        if (t.type === 'coordinator') return user.is_coordinator;
        if (t.type === 'division') return String(user.division_id) === String(t.value);
        if (t.type === 'user') return String(user.id) === String(t.value);
        // FIX 2: Akses properti .name dari Object position saat filter
        if (t.type === 'position' && activeEventId) {
          const userCommittee = committees.find(c => c.user_id === user.id);
          return userCommittee?.position?.name?.toLowerCase() === String(t.value).toLowerCase();
        }
        return false;
      });
    });
  }, [allUsers, selectedTargets, isAllInvited, activeEventId, committees]);

  // HIDRASI STATE LOKAL
  useEffect(() => {
    if (isOpen && activeTab === 'attendance' && targetedUsers.length > 0 && !attendanceLoading && !isDataLoaded) {
      const initialState = {};
      targetedUsers.forEach((user) => {
        const existing = existingAttendances.find((a) => a.user_id === user.id);
        initialState[user.id] = { status: existing?.status || 'uninvited', proof_url: existing?.proof_url || '' };
      });
      setLocalData(initialState);
      setIsDataLoaded(true);
    }
  }, [isOpen, activeTab, targetedUsers.length, attendanceLoading, isDataLoaded, existingAttendances]);

  if (!isOpen || !agenda) return null;

  const toggleTarget = (type, value = null) => {
    setSelectedTargets((prev) => {
      if (type === 'all') return [{ type: 'all', value: null }];
      let newTargets = prev.filter((t) => t.type !== 'all');
      const exists = newTargets.some((t) => t.type === type && t.value === value);
      return exists ? newTargets.filter((t) => !(t.type === type && t.value === value)) : [...newTargets, { type, value }];
    });
  };

  const handleSaveTargetsAndProceed = async () => {
    if (selectedTargets.length === 0) { toast.error('Pilih minimal satu target.'); return; }
    setSubmitting(true);
    try {
      await api.post(`/api/agendas/${agenda.id}/targets`, { targets: selectedTargets });
      toast.success('Target peserta diperbarui.');
      setActiveTab('attendance');
    } catch (err) { toast.error('Gagal menyimpan target.'); } 
    finally { setSubmitting(false); }
  };

  const handleChange = (userId, field, value) => {
    setLocalData((prev) => ({ ...prev, [userId]: { ...prev[userId], [field]: value } }));
  };

  const handleMarkAllPresent = () => {
    const newState = { ...localData };
    Object.keys(newState).forEach((key) => { newState[key].status = 'present'; });
    setLocalData(newState);
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(localData)
        .filter(([_, data]) => data.status && data.status !== 'uninvited')
        .map(([userId, data]) => ({ user_id: Number(userId), status: data.status, proof_url: data.proof_url || null }));

      await api.post('/api/agenda-attendances/bulk', { agenda_id: agenda.id, attendances: payload });
      toast.success('Data absensi berhasil disimpan.');
      mutateAttendance();
      onClose();
    } catch (err) { toast.error('Gagal menyimpan absensi massal.'); } 
    finally { setSubmitting(false); }
  };

  // FIX 3: Pastikan getPositionString mengekstrak nama dari Object
  const getPositionString = (user) => {
    if (activeEventId) {
      const c = committees.find(com => com.user_id === user.id);
      return c?.position?.name ? c.position.name : (user.division?.name ? `${user.division.name} (Eksternal Event)` : 'BPH (Eksternal Event)');
    }
    return user.division?.name || 'BPH Pusat';
  };

  const handleExportExcel = () => {
    const wsData = [
      ['DAFTAR HADIR KEGIATAN PROTIK', ''],
      ['Nama Agenda', ':', agenda.title],
      ['Waktu Pelaksanaan', ':', agenda.start_date ? new Date(agenda.start_date).toLocaleString('id-ID') : '-'],
      ['Tempat / Lokasi', ':', agenda.location || '-'],
      [],
      ['No', 'Nama Anggota', 'Divisi / Jabatan', 'Status Kehadiran', 'Bukti / Keterangan']
    ];

    targetedUsers.forEach((user, index) => {
      const savedAtt = existingAttendances.find((a) => a.user_id === user.id);
      const statusMap = { present: 'Hadir', permit: 'Izin', sick: 'Sakit', absent: 'Alpha' };
      wsData.push([index + 1, user.name, getPositionString(user), statusMap[savedAtt?.status] || 'Belum Diabsen', savedAtt?.proof_url || '']);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 25 }, { wch: 18 }, { wch: 45 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Hadir');
    XLSX.writeFile(wb, `Absensi_${agenda.title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
    toast.success('Daftar hadir berhasil diunduh!');
  };

  const buttonClass = (isSelected, activeColor) => `px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isSelected ? activeColor : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10'}`;

  const renderTargetsTab = () => (
    <div className="p-6 space-y-6 animate-slide-up-fade">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/50">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Grup Utama</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => toggleTarget('all')} className={buttonClass(selectedTargets.some(t => t.type === 'all'), 'bg-primary-500 text-white border-primary-600')}>
            {activeEventId ? 'Semua Panitia Event' : 'Semua Peserta / Umum'}
          </button>
          <button type="button" onClick={() => toggleTarget('bph')} className={buttonClass(selectedTargets.some(t => t.type === 'bph'), 'bg-violet-500 text-white border-violet-600')}>
            BPH Inti (Admin)
          </button>
          <button type="button" onClick={() => toggleTarget('coordinator')} className={buttonClass(selectedTargets.some(t => t.type === 'coordinator'), 'bg-amber-500 text-white border-amber-600')}>
            Koordinator Divisi
          </button>
        </div>
      </div>

      {activeEventId && eventPositions.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Spesifik Jabatan Panitia</h3>
          <div className="flex flex-wrap gap-2">
            {eventPositions.map((pos) => (
              <button type="button" key={pos} onClick={() => toggleTarget('position', pos)} className={buttonClass(selectedTargets.some(t => t.type === 'position' && t.value === pos), 'bg-emerald-500 text-white border-emerald-600')}>
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}

      {divisions.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Spesifik Divisi (Global)</h3>
          <div className="flex flex-wrap gap-2">
            {divisions.map((div) => (
              <button type="button" key={div.id} onClick={() => toggleTarget('division', String(div.id))} className={buttonClass(selectedTargets.some(t => t.type === 'division' && t.value === String(div.id)), 'bg-indigo-500 text-white border-indigo-600')}>
                {div.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Undang Personal (Target Lepas)</h3>
        <div className="relative">
          <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Cari nama anggota untuk diundang khusus..." className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-primary-500 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
        </div>
        {searchUser && (
          <div className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800">
            {allUsers.filter(u => u.name?.toLowerCase().includes(searchUser.toLowerCase())).map(u => {
              const isSelected = selectedTargets.some(t => t.type === 'user' && t.value === String(u.id));
              return (
                <div key={u.id} className="flex items-center justify-between px-3 py-2 border-b last:border-0 border-slate-100 dark:border-white/5">
                  <span className="text-xs text-slate-700 dark:text-slate-300">{u.name}</span>
                  <button type="button" onClick={() => toggleTarget('user', String(u.id))} className={`px-2 py-1 rounded text-[10px] font-bold ${isSelected ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
                    {isSelected ? 'Batal' : 'Undang'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="flex-1 overflow-y-auto p-6 animate-slide-up-fade">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">Menampilkan {targetedUsers.length} peserta tertarget.</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleExportExcel} className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"><FileSpreadsheet className="h-4 w-4"/> Ekspor Excel</button>
          <button type="button" onClick={handleMarkAllPresent} className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4"/> Hadirkan Semua</button>
        </div>
      </div>

      {usersLoading || attendanceLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-emerald-500"/></div>
      ) : targetedUsers.length === 0 ? (
        <div className="text-center text-sm text-slate-500">Tidak ada peserta yang cocok dengan target.</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-white/10">
            <tr><th className="pb-3 pr-4">Nama Anggota</th><th className="pb-3 px-4">Status Absensi</th><th className="pb-3 pl-4">URL Bukti Izin</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {targetedUsers.map((user) => {
              const rowData = localData[user.id] || { status: 'uninvited', proof_url: '' };
              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{getPositionString(user)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <select value={rowData.status} onChange={(e) => handleChange(user.id, 'status', e.target.value)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none dark:bg-slate-800 ${rowData.status === 'present' ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : rowData.status === 'absent' ? 'border-red-500/50 text-red-600 bg-red-50 dark:bg-red-500/10' : rowData.status === 'uninvited' ? 'border-slate-300 text-slate-400 bg-slate-50 dark:bg-white/5 dark:border-white/10' : 'border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-500/10'}`}>
                      <option value="uninvited">- Belum Diabsen -</option><option value="present">Hadir</option><option value="permit">Izin</option><option value="sick">Sakit</option><option value="absent">Alpha</option>
                    </select>
                  </td>
                  <td className="py-3 pl-4">
                    <input type="url" placeholder="https://..." value={rowData.proof_url} disabled={rowData.status === 'present' || rowData.status === 'uninvited'} onChange={(e) => handleChange(user.id, 'proof_url', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none disabled:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-white" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        <div className="flex flex-col border-b border-slate-200 bg-white px-6 pt-4 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
                <UserCheck className="h-5 w-5 text-white"/>
              </div>
              <div><h2 className="text-base font-bold text-slate-900 dark:text-white">Buku Tamu Absensi</h2><p className="text-xs text-slate-500 dark:text-slate-400">{agenda.title}</p></div>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"><X className="h-5 w-5"/></button>
          </div>
          <div className="flex gap-6">
            <button type="button" onClick={() => setActiveTab('targets')} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'targets' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><span className="flex items-center gap-2"><Target className="h-4 w-4"/> 1. Tentukan Target</span></button>
            <button type="button" onClick={() => setActiveTab('attendance')} className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'attendance' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><span className="flex items-center gap-2"><Users className="h-4 w-4"/> 2. Catat Kehadiran</span></button>
          </div>
        </div>
        {activeTab === 'targets' ? renderTargetsTab() : renderAttendanceTab()}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-slate-900/50">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300">Batal</button>
          {activeTab === 'targets' ? (
            <button type="button" onClick={handleSaveTargetsAndProceed} disabled={submitting} className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin"/>} {submitting ? 'Menyimpan...' : 'Simpan & Lanjut Absen'}</button>
          ) : (
            <button type="button" onClick={handleSubmitAttendance} disabled={submitting || usersLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-50">{submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>} Simpan Rekap Kehadiran</button>
          )}
        </div>
      </div>
    </div>
  );
}
