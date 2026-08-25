import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday 
} from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Wallet, CalendarClock, Activity, AlertCircle, Loader2, AlertTriangle, 
  ChevronDown, ChevronLeft, ChevronRight, MapPin
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

function StatCard({ icon: Icon, label, value, subValue, gradient, iconBg }) {
  return (
    <div className="group relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-2xl">
      <div className={`absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${gradient}`} />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
            {subValue && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{subValue}</span>}
          </div>
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${iconBg}`}>
          <Icon className="h-7 w-7 text-white"/>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeChartTab, setActiveChartTab] = useState('Kas Umum');
  const [timeRange, setTimeRange] = useState('6m');

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR('/api/dashboard/statistics', fetcher);
  const { data: agenda, error: agendaError, isLoading: agendaLoading } = useSWR('/api/dashboard/upcoming-agenda', fetcher);

  if (statsLoading || agendaLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 dark:text-primary-400"/>
          <p className="text-sm text-slate-500 dark:text-slate-400">Menyinkronkan data dasbor...</p>
        </div>
      </div>
    );
  }

  if (statsError || agendaError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-6 dark:bg-red-500/10">
          <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400"/>
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
  const chartKeys = useMemo(() => (financial?.chart_data ? Object.keys(financial.chart_data) : []), [financial?.chart_data]);
  const currentChartData = useMemo(() => financial?.chart_data?.[activeChartTab] || [], [financial?.chart_data, activeChartTab]);
  const displayChartData = useMemo(() => (timeRange === '3m' ? currentChartData.slice(-3) : currentChartData), [currentChartData, timeRange]);

  // Calendar Logic
  const allAgendas = agenda?.upcoming_meetings || [];
  const agendasSelectedDay = allAgendas.filter(m => isSameDay(new Date(m.start_date), selectedDate));

  const renderedCalendar = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayAgendas = allAgendas.filter(m => isSameDay(new Date(m.start_date), cloneDay));
        const hasAgenda = dayAgendas.length > 0;
        
        const isNotCurrentMonth = !isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);

        days.push(
          <div
            key={day.toISOString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={`group flex h-16 sm:h-24 cursor-pointer flex-col overflow-hidden border-b border-r border-slate-100 p-1.5 transition-all dark:border-white/5 ${
              isNotCurrentMonth ? "bg-slate-50/50 text-slate-300 dark:bg-slate-900/20 dark:text-slate-600" : 
              isSelected ? "bg-primary-50 dark:bg-primary-900/20" : 
              "hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                isSelected ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" : 
                isTodayDate ? "text-emerald-600 dark:text-emerald-400" : 
                "text-slate-700 dark:text-slate-300"
              }`}>
                {format(day, 'd')}
              </span>
              {hasAgenda && !isSelected && (
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]"></span>
              )}
            </div>
            
            {/* Indikator Baris Acara (Maks 2) */}
            <div className="mt-1 flex flex-col gap-1">
              {dayAgendas.slice(0, 2).map((m, idx) => (
                <div key={idx} className={`truncate rounded-sm px-1.5 py-0.5 text-[9px] font-semibold ${
                  isSelected ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/30 dark:text-primary-300' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400'
                }`}>
                  {m.title}
                </div>
              ))}
              {dayAgendas.length > 2 && (
                <span className="pl-1 text-[8px] font-medium text-slate-400">+{dayAgendas.length - 2} lagi</span>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toISOString()}>{days}</div>);
      days = [];
    }

    return (
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        {/* Header Kalender */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: localeID })}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:bg-white/5">
              <ChevronLeft className="h-4 w-4"/>
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:bg-white/5">
              <ChevronRight className="h-4 w-4"/>
            </button>
          </div>
        </div>

        {/* Hari (Header Grid) */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/30">
          {weekDays.map(dayName => (
            <div key={dayName} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {dayName}
            </div>
          ))}
        </div>

        {/* Matriks Tanggal */}
        <div className="flex flex-col border-l border-slate-100 dark:border-white/5">
          {rows}
        </div>
      </div>
    );
  }, [currentMonth, selectedDate, allAgendas]);

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* 1. WARNING BANNER (KEDISIPLINAN KAS) */}
      {personalDues?.unpaid_months > 0 && (
        <div className="flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5"/>
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Peringatan Tunggakan Kas!</h3>
            <p className="mt-1 text-xs font-medium text-red-600/80 dark:text-red-400/80">
              Kamu memiliki tunggakan kas pengurus selama <strong className="text-red-700 dark:text-red-300">{personalDues.unpaid_months} bulan</strong>. Segera lunasi kewajibanmu untuk mendukung operasional organisasi.
            </p>
          </div>
        </div>
      )}

      {/* 2. STAT CARDS & LEADERBOARD */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatCard gradient="bg-emerald-500" icon={Wallet} iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700" label="Total Saldo Kas Umum" value={formatRupiah(financial?.total_balance)}/>

        {/* Partisipasi Gamifikasi */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-2xl">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500 opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20" />
          <div className="relative mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-md">
                <Activity className="h-4 w-4 text-white"/>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leaderboard Partisipasi</h3>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Tingkat kehadiran 5 agenda terakhir</p>
              </div>
            </div>
          </div>

          <div className="relative space-y-3.5">
            {agendaPart && agendaPart.length > 0 ? (
              agendaPart.map((item, idx) => (
                <div key={idx}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="truncate pr-4 font-semibold text-slate-700 dark:text-slate-300">{item.title}</span>
                    <span className={`font-black tracking-tight ${item.rate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : item.rate >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{item.rate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:bg-slate-800/80">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${item.rate >= 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : item.rate >= 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} 
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-24 items-center justify-center text-xs font-medium text-slate-400">Belum ada riwayat absensi.</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. TABBED DYNAMIC CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Arus Kas Organisasi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Visualisasi tren pemasukan & pengeluaran.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <option value="6m">6 Bulan Terakhir</option>
                <option value="3m">3 Bulan Terakhir</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400"/>
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

      {/* 4. CALENDAR & AGENDA DETAIL (THE MASTERPIECE) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Native Calendar */}
        <div className="lg:col-span-2">
          {renderedCalendar}
        </div>

        {/* Selected Date Agendas */}
        <div className="lg:col-span-1">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <div className="border-b border-slate-200 bg-primary-600/5 px-6 py-4 dark:border-white/10 dark:bg-primary-900/10">
              <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400">
                Agenda {format(selectedDate, 'd MMMM yyyy', { locale: localeID })}
              </h3>
              <p className="mt-1 text-[10px] font-medium text-primary-600/70 dark:text-primary-400/70">
                {agendasSelectedDay.length} agenda dijadwalkan
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {agendasSelectedDay.length > 0 ? (
                <div className="space-y-2">
                  {agendasSelectedDay.map(meeting => (
                    <div key={meeting.id} className="group flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary-200 hover:shadow-md dark:border-white/5 dark:bg-slate-800/50 dark:hover:border-primary-500/30">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">{meeting.title}</h4>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {format(new Date(meeting.start_date), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {meeting.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-red-400"/>
                            <span className="truncate max-w-[100px]">{meeting.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-amber-500"/>
                          <span>Status: {meeting.status || 'Terjadwal'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5">
                    <CalendarClock className="h-6 w-6 text-slate-300 dark:text-slate-600"/>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tidak ada agenda.</p>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Pilih tanggal lain di kalender.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
