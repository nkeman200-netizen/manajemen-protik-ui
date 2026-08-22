import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { X, Loader2, UserCheck, Save, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { fetcher } from '../api/fetcher';
import toast from 'react-hot-toast';

export default function AttendanceModal({ isOpen, onClose, meeting, activeEventId }) {
  const [localData, setLocalData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch Partisipan
  const participantUrl = isOpen
    ? (activeEventId ? `/api/event-committees?event_id=${activeEventId}` : `/api/users?page=1`)
    : null;
  const { data: participantData, isLoading: participantLoading } = useSWR(participantUrl, fetcher);

  // Fetch Absensi Existing
  const attendanceUrl = isOpen && meeting ? `/api/meeting-attendances?meeting_id=${meeting.id}` : null;
  const { data: attendanceData, isLoading: attendanceLoading, mutate } = useSWR(attendanceUrl, fetcher);

  const participants = activeEventId 
    ? (participantData || []) 
    : (participantData?.data || participantData || []);
    
  const existingAttendances = attendanceData || [];

  // Sinkronisasi State Lokal
  useEffect(() => {
    if (isOpen && participants.length > 0) {
      const initialState = {};
      participants.forEach((p) => {
        const user = activeEventId ? p.user : p;
        if (!user) return;
        const existing = existingAttendances.find(a => a.user_id === user.id);
        initialState[user.id] = {
          status: existing?.status || 'absent',
          proof_url: existing?.proof_url || '',
        };
      });
      setLocalData(initialState);
    }
  }, [isOpen, participantData, attendanceData, activeEventId]);

  if (!isOpen || !meeting) return null;

  const handleChange = (userId, field, value) => {
    setLocalData(prev => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value }
    }));
  };

  const handleMarkAllPresent = () => {
    const newState = { ...localData };
    Object.keys(newState).forEach(key => {
      newState[key].status = 'present';
    });
    setLocalData(newState);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(localData).map(([userId, data]) => ({
        user_id: Number(userId),
        status: data.status,
        proof_url: data.proof_url || null
      }));

      await api.post('/api/meeting-attendances/bulk', {
        meeting_id: meeting.id,
        attendances: payload
      });

      toast.success('Seluruh absensi berhasil disimpan.');
      mutate();
      onClose();
    } catch (err) {
      toast.error('Gagal menyimpan absensi massal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/25">
              <UserCheck className="h-5 w-5 text-white"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Absensi Rapat</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{meeting.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
            <X className="h-5 w-5"/>
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex justify-end">
             <button onClick={handleMarkAllPresent} className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">
                <CheckCircle2 className="h-4 w-4"/> Hadirkan Semua
             </button>
          </div>

          {(participantLoading || attendanceLoading) ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-emerald-500"/></div>
          ) : participants.length === 0 ? (
            <div className="text-center text-sm text-slate-500">Belum ada anggota terdaftar.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-white/10">
                <tr>
                  <th className="pb-3 pr-4">Nama Anggota</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4">URL Bukti (Opsional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {participants.map(p => {
                  const user = activeEventId ? p.user : p;
                  if (!user) return null;
                  const rowData = localData[user.id] || { status: 'absent', proof_url: '' };
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                      <td className="py-3 px-4">
                        <select 
                          value={rowData.status}
                          onChange={(e) => handleChange(user.id, 'status', e.target.value)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none dark:bg-slate-800 ${rowData.status === 'present' ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : rowData.status === 'absent' ? 'border-red-500/50 text-red-600 bg-red-50 dark:bg-red-500/10' : 'border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-500/10'}`}
                        >
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
                          onChange={(e) => handleChange(user.id, 'proof_url', e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-slate-900/50">
           <button onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">Batal</button>
           <button onClick={handleSubmit} disabled={submitting || participantLoading} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-50">
             {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>} Simpan Semua Absensi
           </button>
        </div>
      </div>
    </div>
  );
}
