import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  FolderArchive,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navigationGroups = [
  {
    title: 'Utama',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Operasional',
    items: [
      { name: 'Manajemen Event', href: '/dashboard/events', icon: CalendarRange, adminOnly: true },
      { name: 'Agenda', href: '/dashboard/agendas', icon: CalendarClock, restrictedForMember: true },
      { name: 'Dokumen', href: '/dashboard/documents', icon: FileText },
      { name: 'Arsip', href: '/dashboard/archives', icon: FolderArchive },
    ]
  },
  {
    title: 'Finansial',
    items: [
      { name: 'Keuangan', href: '/dashboard/finance', icon: Calculator, restrictedForMember: true },
      { name: 'Kas Pengurus', href: '/dashboard/monthly-dues', icon: Wallet, adminOnly: true },
    ]
  },
  {
    title: 'Sistem & HR',
    items: [
      { name: 'Peringatan', href: '/dashboard/warnings', icon: AlertTriangle },
      { name: 'Master Data', href: '/dashboard/master-data', icon: Database, adminOnly: true },
      { name: 'Log Aktivitas', href: '/dashboard/audit-trails', icon: Activity, adminOnly: true },
    ]
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';
  const isMember = user?.roles?.[0]?.name === 'member';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-primary-950 transition-colors duration-300">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
          ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-72'}
        `}
      >
        {/* Header Area */}
        <div 
          className={`relative flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'}`}
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={() => setIsHeaderHovered(false)}
        >
          <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100'}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <LayoutDashboard className="h-5 w-5 text-white"/>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Protik</span>
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:block shrink-0"
              title="Tutup sidebar"
            >
              <PanelLeftClose className="h-5 w-5"/>
            </button>
          )}

          {isCollapsed && (
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isHeaderHovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
                  <LayoutDashboard className="h-4 w-4 text-white"/>
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className={`absolute inset-0 flex h-full w-full items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:flex ${isHeaderHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                title="Buka sidebar"
              >
                <PanelLeftOpen className="h-5 w-5"/>
              </button>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden shrink-0 absolute right-4"
          >
            <X className="h-5 w-5"/>
          </button>
        </div>

        {/* Navigasi (Menu Personal Telah Dihapus) */}
        <nav className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
          {navigationGroups.map((group, groupIndex) => {
            const validItems = group.items.filter(item => !(item.adminOnly && !isAdmin));
            if (validItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {!isCollapsed ? (
                  <h3 className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {group.title}
                  </h3>
                ) : (
                  groupIndex > 0 && <hr className="mx-4 my-2 border-slate-200 dark:border-white/10" />
                )}

                {validItems.map((item) => (
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
                ))}
              </div>
            );
          })}
        </nav>

        {/* User Card (Merangkap Tombol Profil Saya) */}
        <NavLink
          to="/dashboard/profile"
          onClick={() => setSidebarOpen(false)}
          title={isCollapsed ? 'Profil Saya' : undefined}
          className={({ isActive }) => 
            `block shrink-0 border-t border-slate-200 transition dark:border-white/10 ${isCollapsed ? 'p-3' : 'px-4 py-4'} ${isActive ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`
          }
        >
          {({ isActive }) => (
            <div className={`flex items-center rounded-xl transition-all duration-300 ${
              isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'
            } ${
              isActive 
                ? 'bg-primary-100 dark:bg-primary-500/20 ring-1 ring-primary-500/30 shadow-inner' 
                : 'bg-slate-100 dark:bg-white/5'
            }`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white ring-2 ring-primary-100 dark:ring-primary-900' 
                  : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
              }`}>
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              
              {!isCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className={`truncate text-sm font-bold transition-colors ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                    {user?.name ?? 'Pengguna'}
                  </p>
                  <p className={`truncate text-[10px] font-semibold uppercase tracking-wider transition-colors ${isActive ? 'text-primary-600/80 dark:text-primary-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {user?.roles?.[0]?.name ?? 'user'}
                  </p>
                </div>
              )}
            </div>
          )}
        </NavLink>
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
                  <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
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
