## [2026-08-20]
### Added
- Menginisiasi proyek Frontend berbasis React 18, Vite, dan Tailwind CSS.
- Mengimplementasikan `axios` dengan kapabilitas *Credentials* untuk integrasi *Cookie-based Auth* Sanctum.
- Membuat `AuthContext` untuk manajemen *state* otentikasi (CSRF Handshake, Login, Check, Logout).
- Mengimplementasikan `ProtectedRoute` untuk mengamankan akses halaman Dashboard.
- Membuat halaman Login fungsional.
## [2026-08-21]
### Fixed
- Menyelesaikan *blocker* HTTP 419 CSRF Token Mismatch saat login.
- Menambahkan parameter `withXSRFToken: true` pada konfigurasi instance Axios untuk mengatasi *breaking changes* pengiriman header CSRF pada Axios v1.6.0+ untuk *request Cross-Origin*.
## [2026-08-21]
### Added
- Mendefinisikan Draf PRD Fase 3 (Layouting & Dashboard UI).
- Merancang struktur `DashboardLayout` dengan navigasi dinamis berbasis peran (Role-based Navigation).
- Menetapkan `swr` sebagai arsitektur *data fetching* tingkat lanjut untuk visualisasi matriks *Dashboard*.
## [2026-08-21]
### Added
- Mengimplementasikan `DashboardLayout` dengan fitur *Sidebar* dan *Role-based navigation UI*.
- Menambahkan *library* `swr` untuk optimasi *caching* dan *data fetching* reaktif.
- Mengimplementasikan antarmuka *Dashboard* (Grid Cards statistik keuangan dan daftar jadwal agenda terdekat).
## [2026-08-21]
### Added
- Mendefinisikan Draf PRD Fase 4 (Core Domain Integration).
- Merancang arsitektur Modul Keuangan mencakup *SWR Pagination*, *Role-Based Access Control* (RBAC) pada UI, dan *Error Handling* untuk limitasi anggaran.  
## [2026-08-21]
### Added
- Mengimplementasikan `Finance.jsx` untuk antarmuka manajemen kas dengan *SWR Pagination* dan *Tailwind Table*.
- Membuat komponen `FinanceModal.jsx` untuk penanganan formulir dan intersep limitasi anggaran (HTTP 422).
- Menerapkan *Role-Based Access Control* (RBAC) pada UI; tombol Tambah Transaksi hanya terlihat oleh *role* `admin`.
### Changed
- Memperbarui `fetcher.js` dengan penambahan `paginatedFetcher` untuk mendukung struktur meta pada Laravel API Resources.
## [2026-08-21]
### Fixed
- Memperbaiki visibilitas teks (kontras warna) pada elemen `<option>` di dalam formulir modal.
- Menyelesaikan *error* validasi `user_id is required` dengan menyisipkan identitas sesi pengguna ke dalam *payload* POST API.