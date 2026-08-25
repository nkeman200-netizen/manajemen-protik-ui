import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-50 p-6 text-center dark:bg-red-500/10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-8 w-8"/>
          </div>
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Terjadi Kesalahan Visual</h2>
          <p className="mt-2 max-w-md text-sm text-red-600/80 dark:text-red-400/80">
            Sistem gagal memuat komponen ini. Mohon muat ulang halaman atau hubungi administrator jika masalah berlanjut.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-red-500"
          >
            <RefreshCcw className="h-4 w-4"/> Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
