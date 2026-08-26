import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  CalendarRange,
  Database,
  Activity,
  CalendarClock,
  Wallet, 
  Calculator,
  FileText,
  User,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Manajemen Event', href: '/dashboard/events', icon: CalendarRange, adminOnly: true },
  { name: 'Master Data', href: '/dashboard/master-data', icon: Database, adminOnly: true },
  { name: 'Log Aktivitas', href: '/dashboard/audit-trails', icon: Activity, adminOnly: true },
  { name: 'Agenda', href: '/dashboard/agendas', icon: CalendarClock, restrictedForMember: true },
  { name: 'Keuangan', href: '/dashboard/finance', icon: Calculator, restrictedForMember: true },
  { name: 'Kas Pengurus', href: '/dashboard/monthly-dues', icon: Wallet, adminOnly: true },
  { name: 'Dokumen', href: '/dashboard/documents', icon: FileText },
  { name: 'Profil Saya', href: '/dashboard/profile', icon: User },
  { name: 'Peringatan', href: '/dashboard/warnings', icon: AlertTriangle },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Untuk Desktop

  const isAdmin = user?.roles?.[0]?.name === 'admin';
  const isMember = user?.roles?.[0]?.name === 'member';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-primary-950 transition-colors duration-300">
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
          ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-72'}
        `}
      >
        {/* Logo area */}
        <div className={`flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
          
          {!isCollapsed ? (
            <>
              {/* Logo Lengkap (Terbuka) */}
              <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                  <LayoutDashboard className="h-5 w-5 text-white"/>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Protik</span>
              </div>

              {/* Tombol Ciutkan (Desktop) - Gaya Gemini */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:block shrink-0"
                title="Tutup sidebar"
              >
                <PanelLeftClose className="h-5 w-5"/>
              </button>
            </>
          ) : (
            /* Tombol Buka (Desktop) - Menggantikan Logo ala Gemini */
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:flex"
              title="Buka sidebar"
            >
              <PanelLeftOpen className="h-5 w-5"/>
            </button>
          )}

          {/* Tombol Tutup (Mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden shrink-0"
          >
            <X className="h-5 w-5"/>
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
          {navigation.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    isCollapsed ? 'justify-center mx-1 p-2.5' : 'gap-3 px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400 dark:shadow-primary-500/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap">
                        <span className="truncate">{item.name}</span>
                        {isMember && item.restrictedForMember && (
                          <span className="ml-2 shrink-0 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Read Only
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400"/>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card */}
        <Link
          to="/dashboard/profile"
          title={isCollapsed ? 'Profil Saya' : undefined}
          className={`block shrink-0 border-t border-slate-200 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 ${
            isCollapsed ? 'p-3' : 'px-4 py-4'
          }`}
        >
          <div className={`flex items-center rounded-xl bg-slate-100 dark:bg-white/5 transition-all duration-300 ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'
          }`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.name ?? 'Pengguna'}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 uppercase">{user?.roles?.[0]?.name ?? 'user'}</p>
              </div>
            )}
          </div>
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5"/>
            </button>
            <div className="min-w-0 overflow-hidden">
              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                Halo, {user?.name ?? 'Pengguna'} 👋
              </h2>
              <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">Selamat datang kembali di panel manajemen.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-400">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-600">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 sm:px-4 text-sm font-medium text-slate-700 transition hover:border-red-500/30 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0"/>
              <span className="hidden sm:block">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
