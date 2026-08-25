import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Wallet,
  CalendarClock,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatTanggalWaktu(dateStr) {
  if (!dateStr) return '-';
  return format(new Date(dateStr), 'd MMM yyyy, HH:mm', { locale: localeID });
}

function StatCard({ icon: Icon, label, value, subValue, gradient, iconBg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-2xl">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
            {subValue && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{subValue}</span>}
          </div>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function AgendaSection({ title, icon: Icon, items, renderItem, emptyText }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4 dark:border-white/10">
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

export default function Dashboard() {
  const [activeChartTab, setActiveChartTab] = useState('Kas Umum');
  const [timeRange, setTimeRange] = useState('6m'); // 6m or 3m

  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR('/api/dashboard/statistics', fetcher);
  const { data: agenda, error: agendaError, isLoading: agendaLoading } = useSWR('/api/dashboard/upcoming-agenda', fetcher);

  if (statsLoading || agendaLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Menyinkronkan data dasbor...</p>
        </div>
      </div>
    );
  }

  if (statsError || agendaError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-6 dark:bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          <div className="text-center">
            <p className="font-semibold text-red-700 dark:text-red-300">Gagal memuat data</p>
            <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/70">Koneksi ke server terputus.</p>
          </div>
        </div>
      </div>
    );
  }

  const personalDues = stats?.personal_dues;
  const agendaPart = stats?.agenda_participation;
  const financial = stats?.financial_health;

  // Chart Logic
  const chartKeys = financial?.chart_data ? Object.keys(financial.chart_data) : [];
  const currentChartData = financial?.chart_data?.[activeChartTab] || [];
  const displayChartData = timeRange === '3m' ? currentChartData.slice(-3) : currentChartData;

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* 1. WARNING BANNER (KEDISIPLINAN KAS) */}
      {personalDues?.unpaid_months > 0 && (
        <div className="flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Peringatan Tunggakan Kas!</h3>
            <p className="mt-1 text-xs font-medium text-red-600/80 dark:text-red-400/80">
              Kamu memiliki tunggakan kas pengurus selama{' '}
              <strong className="text-red-700 dark:text-red-300">{personalDues.unpaid_months} bulan</strong>. Segera lunasi
              kewajibanmu untuk mendukung operasional organisasi.
            </p>
          </div>
        </div>
      )}

      {/* 2. STAT CARDS (KESEHATAN ORGANISASI) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <StatCard
          gradient="bg-emerald-500"
          icon={Wallet}
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
          label="Total Saldo Kas Umum"
          value={formatRupiah(financial?.total_balance)}
        />
        <StatCard
          gradient="bg-blue-500"
          icon={Activity}
          iconBg="bg-gradient-to-br from-blue-500 to-indigo-700"
          label="Partisipasi Rapat Terakhir"
          value={`${agendaPart?.rate ?? 0}%`}
          subValue={agendaPart?.last_agenda_title ? `(${agendaPart.last_agenda_title})` : '-'}
        />
      </div>

      {/* 3. TABBED DYNAMIC CHART (ANALITIK KEUANGAN) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Arus Kas Organisasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Visualisasi tren pemasukan & pengeluaran.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab Navigation */}
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {chartKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveChartTab(key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeChartTab === key
                      ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Time Scope Filter */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <option value="6m">6 Bulan Terakhir</option>
                <option value="3m">3 Bulan Terakhir</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {displayChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayChartData}
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
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
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
              Belum ada data transaksi.
            </div>
          )}
        </div>
      </div>

      {/* 4. AGENDA MENDATANG */}
      <div className="grid gap-4 lg:grid-cols-1">
        <AgendaSection
          title="Jadwal Agenda Terdekat"
          icon={CalendarClock}
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
