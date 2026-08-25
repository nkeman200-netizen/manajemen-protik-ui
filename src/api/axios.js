import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true, // INI KUNCI UTAMANYA UNTUK AXIOS VERSI TERBARU!
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Tangkap Network Error (Internet mati atau Server Down)
        if (!error.response) {
            toast.error('Koneksi terputus. Periksa jaringan internet Anda.');
        } else if (error.response.status >= 500) {
            toast.error('Terjadi kesalahan internal server (500).');
        } else if ((error.response?.status === 401 || error.response?.status === 419) && window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;