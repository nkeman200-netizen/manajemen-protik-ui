import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { SWRConfig } from 'swr';
import { Loader2, X } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Loading Halaman (Diet Performa)
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EventManagement = lazy(() => import('./pages/EventManagement'));
const MasterData = lazy(() => import('./pages/MasterData'));
const Finance = lazy(() => import('./pages/Finance'));
const Agenda = lazy(() => import('./pages/Agenda'));
const Document = lazy(() => import('./pages/Document'));
const Warning = lazy(() => import('./pages/Warning'));
const Profile = lazy(() => import('./pages/Profile'));
const AuditTrail = lazy(() => import('./pages/AuditTrail'));
const MonthlyDue = lazy(() => import('./pages/MonthlyDue'));
const Archives = lazy(() => import('./pages/Archives'));
const Settings = lazy(() => import('./pages/Settings'));

// Fallback Spinner saat transisi halaman
const PageLoader = () => (
  <div className="flex h-[60vh] w-full flex-col items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    <span className="mt-3 text-xs font-medium text-slate-400">Memuat modul...</span>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateIfStale: false,
              shouldRetryOnError: false,
              dedupingInterval: 10000, // Mencegah duplikat request dalam 10 detik
              keepPreviousData: true, // Pertahankan data lama saat memuat halaman/filter baru (Cegah UI Berkedip)
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/dashboard/events" element={<EventManagement />} />
                      <Route path="/dashboard/master-data" element={<MasterData />} />
                      <Route path="/dashboard/audit-trails" element={<AuditTrail />} />
                      <Route path="/dashboard/finance" element={<Finance />} />
                      <Route path="/dashboard/monthly-dues" element={<MonthlyDue />} />
                      <Route path="/dashboard/agendas" element={<Agenda />} />
                      <Route path="/dashboard/documents" element={<Document />} />
                      <Route path="/dashboard/archives" element={<Archives />} />
                      <Route path="/dashboard/profile" element={<Profile />} />
                      <Route path="/dashboard/warnings" element={<Warning />} />
                      <Route path="/dashboard/settings" element={<Settings />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </SWRConfig>
          <Toaster
            position="top-right"
            containerStyle={{
              top: 24,
              right: 24,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '1rem',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#ffffff' },
              },
              error: {
                duration: 5000,
                iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
              },
            }}
          >
            {(t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    {icon}
                    <div className="flex-1 text-xs font-medium leading-relaxed">{message}</div>
                    {t.type !== 'loading' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.dismiss(t.id);
                        }}
                        className="ml-1 -mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        title="Tutup notifikasi"
                        aria-label="Tutup notifikasi"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </ToastBar>
            )}
          </Toaster>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
