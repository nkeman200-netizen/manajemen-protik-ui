import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';
import { Loader2 } from 'lucide-react';
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
                      <Route path="/dashboard/profile" element={<Profile />} />
                      <Route path="/dashboard/warnings" element={<Warning />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </SWRConfig>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
