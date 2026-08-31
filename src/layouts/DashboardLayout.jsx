import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../api/fetcher';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmModal from '../components/ConfirmModal';
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
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  User as UserIcon,
  X
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
      { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings, adminOnly: true },
    ]
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const { data: settingsData } = useSWR('/api/settings', fetcher);
  const orgName = settingsData?.org_name || 'Protik';
  const orgLogo = settingsData?.org_logo || '';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Reset state error jika orgLogo diperbarui dari API/Backend
  useEffect(() => {
    setLogoError(false);
  }, [orgLogo]);
  
  // State Dropdown Profil & Logout
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdmin = user?.roles?.[0]?.name === 'admin';
  const isMember = user?.roles?.[0]?.name === 'member';

  // Auto-close profil dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLogoutModalOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72 ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-72'}
        `}
      >
        {/* Header Area (Brand) */}
        <div 
          className={`relative flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-white/10 transition-all duration-300 px-5 ${isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'}`}
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={() => setIsHeaderHovered(false)}
        >
          {/* Brand Name & Logo - Hidden ONLY on LG when Collapsed */}
          <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 w-auto opacity-100 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:absolute' : ''}`}>
            {orgLogo ? (
              <img
                src={logoError ? '/default-logo.png' : (orgLogo || '/default-logo.png')}
                alt="Logo Organisasi"
                onError={() => setLogoError(true)}
                className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-sm bg-white/50"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                <LayoutDashboard className="h-5 w-5 text-white"/>
              </div>
            )}
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{orgName}</span>
          </div>

          {/* Mobile Close Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white shrink-0"
            title="Tutup menu"
          >
            <X className="h-5 w-5"/>
          </button>

          {/* Desktop Collapse Button - Hidden on Mobile, Hidden on LG if Collapsed */}
          <button
            onClick={() => setIsCollapsed(true)}
            className={`hidden shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white ${isCollapsed ? 'lg:hidden' : 'lg:block'}`}
            title="Tutup sidebar"
          >
            <PanelLeftClose className="h-5 w-5"/>
          </button>

          {/* Collapsed Brand/Button - Visible ONLY on LG when Collapsed */}
          <div className={`relative h-10 w-10 items-center justify-center hidden ${isCollapsed ? 'lg:flex' : 'lg:hidden'}`}>
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isHeaderHovered ? 'opacity-0' : 'opacity-100'}`}>
              {orgLogo ? (
                <img
                  src={logoError ? '/default-logo.png' : (orgLogo || '/default-logo.png')}
                  alt="Logo Organisasi"
                  onError={() => setLogoError(true)}
                  className="h-8 w-8 rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                  <LayoutDashboard className="h-4 w-4 text-white"/>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(false)}
              className={`absolute inset-0 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-opacity duration-200 dark:bg-white/10 dark:text-white ${isHeaderHovered ? 'opacity-100' : 'opacity-0'}`}
              title="Buka sidebar"
            >
              <PanelLeftOpen className="h-5 w-5"/>
            </button>
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-4 custom-scrollbar">
          {navigationGroups.map((group) => {
            const visibleItems = group.items.filter(item => {
              if (item.adminOnly && !isAdmin) return false;
              if (item.restrictedForMember && isMember) return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                <h3 className={`mb-3 px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block ${isCollapsed ? 'lg:hidden' : ''}`}>
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === '/dashboard'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-500/10 dark:text-primary-400'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                        } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0 transition-colors group-hover:text-primary-500" />
                      <span className={`block ${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Micro-Footer (Enterprise Edition) */}
        <div className="mt-auto shrink-0 border-t border-slate-200 p-4 dark:border-white/10 flex justify-center">
          <div className={`flex flex-col items-center justify-center gap-0.5 opacity-80 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <p className="text-[9px] font-extrabold tracking-wide text-slate-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} {orgName.toUpperCase()}.
            </p>
            <p className="text-[8px] font-medium tracking-wider text-slate-400/80 dark:text-slate-500/80">
              v1.0.0 &bull; Stable Release
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* UNIVERSAL TOP NAVBAR */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 z-20">
          
          {/* Mobile Hamburger & Brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
              <Menu className="h-5 w-5"/>
            </button>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{orgName}</span>
          </div>

          {/* Desktop Spacer */}
          <div className="hidden lg:block"></div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* 1. Theme Toggle (Independent) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400"/> : <Moon className="h-5 w-5"/>}
            </button>

            {/* 2. User Avatar Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:ring-primary-500/50"
              >
                {user?.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4"/>}
              </button>

              {/* Popover Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900 animate-slide-up-fade origin-top-right">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
                    <span className="mt-1.5 inline-block rounded-md bg-primary-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {user?.roles?.[0]?.name || 'Member'}
                    </span>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <UserIcon className="h-4 w-4"/> Profil Saya
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 p-1 dark:border-white/5">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4"/> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport for Pages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            <Outlet/>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari panel manajemen? Sesi Anda akan diakhiri."
        confirmText="Ya, Keluar"
        isDanger={true}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
