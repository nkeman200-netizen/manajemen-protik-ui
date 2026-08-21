import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Wallet,
  CalendarCheck,
  FileOutput,
  CalendarClock,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'd MMMM yyyy', { locale: localeID });
}

// --- Stat Card ---
function StatCard({ icon: Icon, label, value, gradient, iconBg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-2xl">
      {/* Gradient glow */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// --- Agenda List ---
function AgendaSection({ title, icon: Icon, items, renderItem, emptyText }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/15 dark:bg-primary-600/20">
          <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {items && items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <div className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR('/api/dashboard/statistics', fetcher);

  const {
    data: agenda,
    error: agendaError,
    isLoading: agendaLoading,
  } = useSWR('/api/dashboard/upcoming-agenda', fetcher);

  const isLoading = statsLoading || agendaLoading;
  const error = statsError || agendaError;

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-8 py-6">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Terjadi kesalahan saat mengambil data dari server.</p>
          </div>
        </div>
      </div>
    );
  }

  const financial = stats?.financial_health;
  const events = stats?.event_performance;
  const activity = stats?.organizational_activity;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Total Saldo"
          value={formatRupiah(financial?.total_balance)}
          gradient="bg-emerald-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
        <StatCard
          icon={CalendarCheck}
          label="Event Aktif"
          value={events?.active_events ?? 0}
          gradient="bg-primary-500"
          iconBg="bg-gradient-to-br from-primary-500 to-primary-700"
        />
        <StatCard
          icon={FileOutput}
          label="Surat Keluar"
          value={activity?.outgoing_letters ?? 0}
          gradient="bg-violet-500"
          iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
        />
      </div>

      {/* Agenda Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Events */}
        <AgendaSection
          title="Jadwal Event Terdekat"
          icon={TrendingUp}
          items={agenda?.upcoming_events}
          emptyText="Belum ada event mendatang."
          renderItem={(event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600/10 dark:bg-primary-600/15">
                <CalendarCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{event.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggal(event.start_date)}</p>
              </div>
            </div>
          )}
        />

        {/* Upcoming Meetings */}
        <AgendaSection
          title="Jadwal Rapat Terdekat"
          icon={Users}
          items={agenda?.upcoming_meetings}
          emptyText="Belum ada rapat mendatang."
          renderItem={(meeting) => (
            <div
              key={meeting.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 dark:bg-violet-600/15">
                <CalendarClock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{meeting.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggal(meeting.date)}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
