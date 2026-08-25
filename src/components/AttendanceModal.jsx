import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import * as XLSX from 'xlsx';
import { X, Loader2, UserCheck, Save, CheckCircle2, Target, Users, Search, FileSpreadsheet } from 'lucide-react';
import api from '../api/axios';
import { fetcher, paginatedFetcher } from '../api/fetcher';
import toast from 'react-hot-toast';

export default function AttendanceModal({ isOpen, onClose, meeting: agenda, activeEventId }) {
  const [activeTab, setActiveTab] = useState('targets'); // 'targets' | 'attendance'
  const [localData, setLocalData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // --- State for Targets ---
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [searchUser, setSearchUser] = useState('');

  // Fetch Partisipan & Divisions
  const participantUrl = isOpen
    ? activeEventId
      ? `/api/event-committees?event_id=${activeEventId}`
      : `/api/users?all=true`
    : null;
  const { data: participantData, isLoading: participantLoading } = useSWR(participantUrl, fetcher);
  const { data: divData } = useSWR(isOpen && !activeEventId ? '/api/divisions' : null, fetcher); // Hanya ditarik jika BPH Pusat

  // Fetch Absensi Existing (Gunakan paginatedFetcher karena controller me-return array langsung tanpa wrapper data ganda)
  const attendanceUrl = isOpen && agenda ? `/api/agenda-attendances?agenda_id=${agenda.id}` : null;
  const { data: attendanceData, isLoading: attendanceLoading, mutate: mutateAttendance } = useSWR(
    attendanceUrl,
    paginatedFetcher
  );

  // FIX: Bungkus dengan useMemo agar React tidak menganggapnya sebagai array baru di setiap render (mencegah Infinite Loop)
  const rawParticipants = useMemo(() => {
    if (!participantData) return [];
    return Array.isArray(participantData) ? participantData : (participantData?.data || []);
  }, [participantData]);

  const divisions = useMemo(() => {
    if (!divData) return [];
    return Array.isArray(divData) ? divData : (divData?.data || []);
  }, [divData]);

  const existingAttendances = useMemo(() => {
    if (!attendanceData) return [];
    return Array.isArray(attendanceData) ? attendanceData : (attendanceData?.data || []);
  }, [attendanceData]);

  // Kunci agar revalidasi SWR di background tidak mereset inputan user
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Reset & Load Initial Targets
  useEffect(() => {
    if (isOpen && agenda) {
      setIsDataLoaded(false); // Reset kunci setiap buka modal
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

  // Filtering Peserta berdasarkan Selected Targets
  const isAllInvited = selectedTargets.length === 0 || selectedTargets.some((t) => t.type === 'all');

  const participants = rawParticipants.filter((p) => {
    if (isAllInvited) return true;
    const user = activeEventId ? p.user : p;
    if (!user) return false;

    return selectedTargets.some((t) => {
      if (t.type === 'bph') return user.roles?.[0]?.name === 'admin';
      if (t.type === 'coordinator') return user.is_coordinator;
      if (t.type === 'division' && !activeEventId) return String(user.division_id) === String(t.value);
      if (t.type === 'position' && activeEventId)
        return p.position?.toLowerCase() === String(t.value).toLowerCase();
      if (t.type === 'user') return String(user.id) === String(t.value);
      return false;
    });
  });

  // Sinkronisasi State Lokal Absensi
  useEffect(() => {
    // FIX: Hanya eksekusi jika data selesai diload dan BELUM pernah diset (isDataLoaded = false)
    if (isOpen && activeTab === 'attendance' && participants.length > 0 && !attendanceLoading && !isDataLoaded) {
      const initialState = {};
      participants.forEach((p) => {
        const user = activeEventId ? p.user : p;
        if (!user) return;
        const existing = existingAttendances.find((a) => a.user_id === user.id);
        initialState[user.id] = {
          status: existing?.status || 'uninvited', // default kosong
          proof_url: existing?.proof_url || '',
        };
      });
      setLocalData(initialState);
      setIsDataLoaded(true); // Kunci state agar tidak tertimpa re-render SWR
    }
  }, [isOpen, activeTab, participants.length, attendanceLoading, isDataLoaded, existingAttendances]);

  if (!isOpen || !agenda) return null;

  // --- Handlers ---
  const toggleTarget = (type, value = null) => {
    setSelectedTargets((prev) => {
      // Jika "all", hapus yang lain
      if (type === 'all') return [{ type: 'all', value: null }];

      let newTargets = prev.filter((t) => t.type !== 'all'); // Hapus 'all' jika milih spesifik
      const exists = newTargets.some((t) => t.type === type && t.value === value);
      if (exists) {
        return newTargets.filter((t) => !(t.type === type && t.value === value));
      } else {
        return [...newTargets, { type, value }];
      }
    });
  };

  const handleSaveTargetsAndProceed = async () => {
    if (selectedTargets.length === 0) {
      toast.error('Pilih minimal satu target (misal: Semua Peserta).');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/agendas/${agenda.id}/targets`, { targets: selectedTargets });
      toast.success('Target peserta diperbarui.');
      setActiveTab('attendance');
    } catch (err) {
      toast.error('Gagal menyimpan target.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (userId, field, value) => {
    setLocalData((prev) => ({ ...prev, [userId]: { ...prev[userId], [field]: value } }));
  };

  const handleMarkAllPresent = () => {
    const newState = { ...localData };
    Object.keys(newState).forEach((key) => {
      newState[key].status = 'present';
    });
    setLocalData(newState);
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    try {
      // Hanya kirim yang statusnya disetel (bukan 'uninvited')
      const payload = Object.entries(localData)
        .filter(([_, data]) => data.status && data.status !== 'uninvited')
        .map(([userId, data]) => ({
          user_id: Number(userId),
          status: data.status,
          proof_url: data.proof_url || null,
        }));

      await api.post('/api/agenda-attendances/bulk', { agenda_id: agenda.id, attendances: payload });
      toast.success('Data absensi berhasil disimpan.');
      mutateAttendance();
      onClose();
    } catch (err) {
      toast.error('Gagal menyimpan absensi massal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = () => {
    const wsData = [];
    wsData.push(['DAFTAR HADIR KEGIATAN PROTIK', '']);
    wsData.push(['Nama Agenda', ':', agenda.title]);
    wsData.push(['Waktu Pelaksanaan', ':', agenda.start_date ? new Date(agenda.start_date).toLocaleString('id-ID') : '-']);
    wsData.push(['Tempat / Lokasi', ':', agenda.location || '-']);
    wsData.push([]);
    wsData.push(['No', 'Nama Anggota', 'Divisi / Jabatan', 'Status Kehadiran', 'Bukti / Keterangan']);

    participants.forEach((p, index) => {
      const user = activeEventId ? p.user : p;
      if (!user) return;
      
      const savedAtt = existingAttendances.find((a) => a.user_id === user.id);
      let statusText = 'Belum Diabsen';
      if (savedAtt?.status === 'present') statusText = 'Hadir';
      if (savedAtt?.status === 'permit') statusText = 'Izin';
      if (savedAtt?.status === 'sick') statusText = 'Sakit';
      if (savedAtt?.status === 'absent') statusText = 'Alpha';

      const position = activeEventId ? p.position : (user.division?.name || 'BPH');
      
      wsData.push([
        index + 1,
        user.name,
        position,
        statusText,
        savedAtt?.proof_url || ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // Optimasi Lebar Kolom Excel
    ws['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 20 }, { wch: 18 }, { wch: 45 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Hadir');
    
    const safeTitle = agenda.title.replace(/[^a-zA-Z0-9]/g, '_');
    XLSX.writeFile(wb, `Absensi_${safeTitle}.xlsx`);
    toast.success('Daftar hadir berhasil diunduh!');
  };

  // --- RENDERERS ---
  const renderTargetsTab = () => (
    <div className="p-6 space-y-6 animate-slide-up-fade">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/50">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Grup Utama
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleTarget('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
              selectedTargets.some((t) => t.type === 'all')
                ? 'bg-primary-500 text-white border-primary-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10'
            }`}
          >
            Semua Peserta / Umum
          </button>
          {!activeEventId && (
            <>
              <button
                type="button"
                onClick={() => toggleTarget('bph')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                  selectedTargets.some((t) => t.type === 'bph')
                    ? 'bg-violet-500 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10'
                }`}
              >
                BPH Inti (Admin)
              </button>
              <button
                type="button"
                onClick={() => toggleTarget('coordinator')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                  selectedTargets.some((t) => t.type === 'coordinator')
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10'
                }`}
              >
                Koordinator Divisi
              </button>
            </>
          )}
        </div>
      </div>

      {!activeEventId && divisions.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Spesifik Divisi
          </h3>
          <div className="flex flex-wrap gap-2">
            {divisions.map((div) => (
              <button
                type="button"
                key={div.id}
                onClick={() => toggleTarget('division', String(div.id))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  selectedTargets.some((t) => t.type === 'division' && t.value === String(div.id))
                    ? 'bg-indigo-500 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10'
                }`}
              >
                {div.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Lepas (Search User) */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Undang Personal (Target Lepas)
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Cari nama anggota untuk diundang khusus..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-primary-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        {searchUser && (
          <div className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800">
            {rawParticipants
              .filter((p) => {
                const u = activeEventId ? p.user : p;
                return u?.name?.toLowerCase().includes(searchUser.toLowerCase());
              })
              .map((p) => {
                const u = activeEventId ? p.user : p;
                const isSelected = selectedTargets.some((t) => t.type === 'user' && t.value === String(u.id));
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between px-3 py-2 border-b last:border-0 border-slate-100 dark:border-white/5"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300">{u.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleTarget('user', String(u.id))}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        isSelected ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
                      }`}
                    >
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
        <p className="text-xs font-semibold text-slate-500">
          Menampilkan {participants.length} peserta tertarget.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <FileSpreadsheet className="h-4 w-4"/> Ekspor Excel
          </button>
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4"/> Hadirkan Semua
          </button>
        </div>
      </div>

      {participantLoading || attendanceLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center text-sm text-slate-500">Tidak ada peserta yang cocok dengan target.</div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-white/10">
            <tr>
              <th className="pb-3 pr-4">Nama Anggota</th>
              <th className="pb-3 px-4">Status Absensi</th>
              <th className="pb-3 pl-4">URL Bukti Izin (Opsional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {participants.map((p) => {
              const user = activeEventId ? p.user : p;
              if (!user) return null;
              const rowData = localData[user.id] || { status: 'uninvited', proof_url: '' };

              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {activeEventId ? p.position : user.division?.name || 'BPH'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={rowData.status}
                      onChange={(e) => handleChange(user.id, 'status', e.target.value)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none dark:bg-slate-800 ${
                        rowData.status === 'present'
                          ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
                          : rowData.status === 'absent'
                          ? 'border-red-500/50 text-red-600 bg-red-50 dark:bg-red-500/10'
                          : rowData.status === 'uninvited'
                          ? 'border-slate-300 text-slate-400 bg-slate-50 dark:bg-white/5 dark:border-white/10'
                          : 'border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-500/10'
                      }`}
                    >
                      <option value="uninvited">- Belum Diabsen -</option>
                      <option value="present">Hadir</option>
                      <option value="permit">Izin</option>
                      <option value="sick">Sakit</option>
                      <option value="absent">Alpha</option>
                    </select>
                  </td>
                  <td className="py-3 pl-4">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={rowData.proof_url}
                      disabled={rowData.status === 'present' || rowData.status === 'uninvited'}
                      onChange={(e) => handleChange(user.id, 'proof_url', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none disabled:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                    />
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
        {/* Header (Tabs) */}
        <div className="flex flex-col border-b border-slate-200 bg-white px-6 pt-4 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Buku Tamu Absensi</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{agenda.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('targets')}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === 'targets'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" /> 1. Tentukan Target
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`pb-3 text-sm font-semibold border-b-2 transition ${
                activeTab === 'attendance'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" /> 2. Catat Kehadiran
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'targets' ? renderTargetsTab() : renderAttendanceTab()}

        {/* Footer Actions */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
          >
            Batal
          </button>

          {activeTab === 'targets' ? (
            <button
              type="button"
              onClick={handleSaveTargetsAndProceed}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Menyimpan...' : 'Simpan & Lanjut Absen'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAttendance}
              disabled={submitting || participantLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
              Rekap Kehadiran
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
