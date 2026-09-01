import toast from 'react-hot-toast';

/**
 * Mengurai (parse) objek error dari backend Laravel / Axios menjadi pesan string yang ramah pengguna.
 *
 * @param {any} error - Error object, string, atau axios error
 * @param {string} fallback - Pesan fallback jika error tidak memiliki detail
 * @returns {string} Pesan error yang sudah diformat
 */
export function parseApiError(error, fallback = 'Terjadi kesalahan pada sistem.') {
  if (!error) return fallback;

  if (typeof error === 'string') return error;

  const response = error.response;
  if (!response) {
    if (error.message === 'Network Error' || !navigator.onLine) {
      return 'Koneksi internet terputus. Silakan periksa jaringan Anda.';
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Waktu permintaan habis (timeout). Silakan coba lagi.';
    }
    return error.message || fallback;
  }

  const data = response.data;
  if (!data) {
    if (response.status === 403) return 'Anda tidak memiliki hak akses untuk tindakan ini.';
    if (response.status === 404) return 'Data atau sumber daya yang diminta tidak ditemukan.';
    if (response.status === 500) return 'Terjadi kendala pada server (500). Silakan hubungi admin.';
    return fallback;
  }

  // 1. Cek jika ada array errors dari validasi Laravel (HTTP 422)
  if (data.errors && typeof data.errors === 'object') {
    const errorKeys = Object.keys(data.errors);
    if (errorKeys.length > 0) {
      const firstError = data.errors[errorKeys[0]];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
      if (typeof firstError === 'string') {
        return firstError;
      }
    }
  }

  // 2. Cek properti message langsung
  if (data.message && typeof data.message === 'string') {
    return data.message;
  }

  // 3. Cek properti error string
  if (data.error && typeof data.error === 'string') {
    return data.error;
  }

  return fallback;
}

/**
 * Smart Toast Helper dengan Anti-Spam (De-duplication) dan Parsing Error Otomatis.
 */
export const showToast = {
  /**
   * Menampilkan toast sukses dengan anti-duplikasi
   */
  success(message, options = {}) {
    const text = typeof message === 'string' ? message : 'Operasi berhasil dilakukan.';
    const toastId = options.id || `success-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`;
    return toast.success(text, {
      id: toastId,
      ...options,
    });
  },

  /**
   * Menampilkan toast error dengan parsing otomatis error Laravel / Axios dan anti-duplikasi
   */
  error(error, fallback = 'Terjadi kesalahan.', options = {}) {
    const text = parseApiError(error, fallback);
    const toastId = options.id || `error-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`;
    return toast.error(text, {
      id: toastId,
      ...options,
    });
  },

  /**
   * Menampilkan toast info umum
   */
  info(message, options = {}) {
    const text = typeof message === 'string' ? message : '';
    const toastId = options.id || `info-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`;
    return toast(text, {
      id: toastId,
      ...options,
    });
  },

  /**
   * Menutup toast tertentu atau semua toast
   */
  dismiss(toastId) {
    toast.dismiss(toastId);
  },
};

export default showToast;
