import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventManagement from './pages/EventManagement';
import MasterData from './pages/MasterData';
import Finance from './pages/Finance';
import Agenda from './pages/Agenda';
import Document from './pages/Document';
import Warning from './pages/Warning';
import Profile from './pages/Profile';
import AuditTrail from './pages/AuditTrail';
import MonthlyDue from './pages/MonthlyDue';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
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
