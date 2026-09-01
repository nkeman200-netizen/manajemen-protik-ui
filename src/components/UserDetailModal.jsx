import { createPortal } from 'react-dom';
import { X, Mail, Phone, MapPin, GraduationCap, Building2, Shield, Calendar, ExternalLink, MessageCircle } from 'lucide-react';

export function getWhatsAppUrl(phone, text = '') {
  if (!phone) return null;
  let cleanNumber = String(phone).replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith('62')) {
    cleanNumber = '62' + cleanNumber;
  }
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${cleanNumber}${query}`;
}

export default function UserDetailModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  const divisionName = user.division?.name || user.division_name || user.division || 'Tanpa Divisi (Umum)';
  const roleName = user.roles?.[0]?.name || user.role || 'member';
  const roleLabel = roleName === 'admin' ? 'Admin (BPH Pusat)' : roleName === 'advisor' ? 'Advisor / Dosen' : 'Anggota (Member)';
  const isActive = user.status === 'active';
  const waUrl = getWhatsAppUrl(user.phone, `Halo ${user.name}, dari Pengurus PROTIK...`);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white dark:from-primary-700 dark:to-slate-900">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white/80 backdrop-blur-md transition hover:bg-black/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-inner backdrop-blur-md border border-white/20">
              {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  isActive ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' : 'bg-rose-400/20 text-rose-200 border border-rose-400/30'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {isActive ? 'Aktif' : 'Nonaktif'}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white/90 border border-white/10">
                  {roleLabel}
                </span>
              </div>
              <h2 className="mt-1.5 truncate text-lg font-bold text-white">
                {user.name}
              </h2>
              <p className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {divisionName} {user.is_coordinator && '• Koordinator'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 p-6 text-slate-700 dark:text-slate-200 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Identitas & Akademik */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Shield className="h-3 w-3 text-primary-500" /> NIM / NIP
              </div>
              <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white font-mono">
                {user.nim || '-'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <GraduationCap className="h-3 w-3 text-emerald-500" /> Program Studi
              </div>
              <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                {user.prodi || '-'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Calendar className="h-3 w-3 text-amber-500" /> Angkatan
              </div>
              <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                {user.angkatan ? `Angkatan ${user.angkatan}` : '-'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Building2 className="h-3 w-3 text-indigo-500" /> Jabatan Divisi
              </div>
              <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                {user.is_coordinator ? 'Koordinator Divisi' : 'Anggota'}
              </p>
            </div>
          </div>

          {/* Kontak Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.02] space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Informasi Kontak
            </div>
            
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium">{user.email || '-'}</span>
              </div>
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="rounded-lg bg-slate-200/60 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-300/60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                >
                  Email
                </a>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium">{user.phone || '-'}</span>
              </div>
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  <MessageCircle className="h-3 w-3" />
                  Chat WA
                </a>
              )}
            </div>
          </div>

          {/* Alamat Domisili (Address) */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" /> Alamat Lengkap
            </div>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-800 dark:text-slate-200">
              {user.address || user.alamat || 'Alamat belum diatur / belum disinkronkan.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 p-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
