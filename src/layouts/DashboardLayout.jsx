import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  CalendarClock,
  Wallet,
  FileText,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rapat', href: '/rapat', icon: CalendarClock, restrictedForMember: true },
  { name: 'Kas', href: '/dashboard/finance', icon: Wallet, restrictedForMember: true },
  { name: 'Dokumen', href: '/dokumen', icon: FileText },
  { name: 'Peringatan', href: '/peringatan', icon: AlertTriangle },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMember = user?.roles?.[0]?.name === 'member';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950">
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
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Protik</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isMember && item.restrictedForMember && (
                    <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      Read Only
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-primary-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name ?? 'Pengguna'}</p>
              <p className="truncate text-xs text-slate-400">{user?.roles?.[0]?.name ?? 'user'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Halo, {user?.name ?? 'Pengguna'} 👋
              </h2>
              <p className="text-xs text-slate-400">Selamat datang kembali di panel manajemen.</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
