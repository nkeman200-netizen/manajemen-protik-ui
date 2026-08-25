import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Wallet,
  CalendarCheck,
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

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'd MMM yyyy, HH:mm', { locale: localeID });
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

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
        <StatCard
          icon={Wallet}
          label="Total Saldo Kas Umum"
          value={formatRupiah(financial?.total_balance)}
          gradient="bg-emerald-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
      </div>

      {/* Financial Chart Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Arus Kas Organisasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Statistik pemasukan & pengeluaran 6 bulan terakhir.</p>
          </div>
        </div>

        <div className="h-72 w-full">
          {financial?.chart_data && financial.chart_data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financial.chart_data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-white/5" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fontSize: 11 }}
                  className="fill-slate-500"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  className="fill-slate-500"
                  tickFormatter={(value) =>
                    `Rp${value >= 1000000 ? value / 1000000 + 'M' : value / 1000 + 'K'}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatRupiah(value)}
                />
                <Area
                  type="monotone"
                  dataKey="Pemasukan"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="Pengeluaran"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Belum ada data keuangan untuk ditampilkan.
            </div>
          )}
        </div>
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
          title="Jadwal Agenda Terdekat"
          icon={Users}
          items={agenda?.upcoming_meetings}
          emptyText="Belum ada agenda mendatang."
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatTanggalWaktu(meeting.start_date)}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
