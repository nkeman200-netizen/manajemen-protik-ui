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
## [2026-08-21]
### Added
- Mengimplementasikan antarmuka modul `Meeting` (Rapat) beserta komponen `MeetingModal` untuk manajemen agenda rutin.
- Mengimplementasikan antarmuka modul `Document` (Surat Keluar) beserta komponen `DocumentModal` yang terintegrasi dengan validasi unik *letter_number*.
- Mengaktifkan tautan navigasi dinamis pada komponen *Sidebar* (`DashboardLayout.jsx`) menggunakan React Router DOM.
## [2026-08-21]
### Added
- Menyelesaikan *Core Domain Integration* dengan mengimplementasikan modul `Warning` (Surat Peringatan) beserta `WarningModal`.
- Menerapkan isolasi tampilan UI Peringatan yang sinkron dengan filter otorisasi pada *Backend*.
### Fixed
- Menambahkan `color-scheme: dark;` pada `index.css` global untuk memaksa mesin peramban me-*render* ikon elemen *native* (seperti `date` dan `datetime-local`) dengan kontras tinggi.
## [2026-08-21]
### Added
- Penutupan Fase 4: *Core Domain Integration*.
- Menyusun Roadmap Fase 5: *Build, Gateway Prep, & VPS Provisioning* mencakup konfigurasi Nginx untuk SPA dan pembuatan skrip *monitoring* utilisasi server berbasis Bash.
## [2026-08-21]
### Added
- Penutupan siklus pengembangan antarmuka (UI) v1.0.0.
- Aplikasi dinyatakan *feature-complete* untuk ruang lingkup *local development*.
### Changed
- Membatalkan fase *Deployment & VPS Provisioning* sesuai dengan batasan lingkup proyek (*project scope*) yang ditetapkan.
## [2026-08-21]
### Added
- Mengimplementasikan desain antarmuka *Workspace Directory* (Card Grid) untuk modul Keuangan berdasarkan pemisahan Kas Umum dan Kas Event.
- Mengintegrasikan antarmuka *Full CRUD* (`Edit` dan `Delete`) pada tabel transaksi yang terhubung ke Backend.
- Mengimplementasikan visibilitas dinamis (*Read-Only Detail* vs *Edit/Delete*) berbasis *Contextual Authorization* untuk membedakan hak akses Anggota dan BPH.
## [2026-08-21]
### Added
- Menerapkan arsitektur *Workspace Directory* (Card Grid) secara penuh pada antarmuka `Meeting.jsx`.
- Mengintegrasikan antarmuka *Full CRUD* (Edit & Delete) dan mode *Read-Only Detail* yang disinkronisasi dengan *Contextual Authorization* dari *Backend*.
## [2026-08-21]
### Changed
- Mengimplementasikan inversi semantik Tailwind (`dark:` *prefix*) pada `DashboardLayout.jsx` dan `Dashboard.jsx` untuk mendukung fungsionalitas tema ganda (*Dark/Light Mode*).
## [2026-08-21]
### Changed
- Menyelesaikan *Global UI Refactoring* gelombang kedua dengan menerapkan inversi semantik warna (Tailwind `dark:`) pada seluruh antarmuka Direktori Ruang Kerja (Keuangan, Dokumen, Rapat) beserta komponen Modal Form.
## [2026-08-21]
### Added
- Mengimplementasikan `EventManagement.jsx` beserta komponen formulirnya untuk menyediakan antarmuka CRUD *Master Data Event* bagi Administrator.
- Membuat `CommitteeModal.jsx` untuk menangani proses penunjukan dan penghapusan BPH Event secara dinamis, yang secara langsung mengontrol sistem otorisasi kontekstual.
- Menambahkan rute `/dashboard/events` yang diproteksi khusus untuk *role* Admin di navigasi tata letak Dasbor.
## [2026-08-21]
### Added
- Mengimplementasikan `CommitteeModal.jsx` dengan fitur *Custom Combobox Search* dan *Hybrid Datalist Input* untuk jabatan.
- Menambahkan fitur *Multi-Sheet Excel Export* (Form, Referensi, Panduan) dan *Sequential Bulk Import* menggunakan pustaka `xlsx`.
## [2026-08-22]
### Added
- Menyuntikkan animasi *Native CSS Keyframes* (`animate-slide-up-fade`) pada transisi render *Workspace* dan Direktori untuk meredam *bug* efek *hover* yang tumpang tindih.
### Changed
- Mengadopsi arsitektur antarmuka *Collapsible Panel* untuk fitur *Advanced Filtering* pada tata letak *Mobile* guna menjaga hierarki dan kebersihan UX.
- Menambahkan *Label Semantic* pada *Input Date* untuk menghindari miskonsepsi format *placeholder* bawaan peramban.
## [2026-08-22]
### Changed
- Mengintegrasikan antarmuka modul Keuangan (`Finance.jsx` & `FinanceModal.jsx`) dengan sistem Volume dan Kalkulasi Otomatis harga satuan.
- Memperbarui filter Datalist sumber dana menjadi kolom string bebas untuk mengakomodasi diversifikasi *cashflow*.
## [2026-08-22]
### Added
- Mengintegrasikan pustaka `xlsx` pada modul Keuangan (`Finance.jsx`) untuk fungsionalitas ekspor *Template Buku Kas Multi-Sheet*.
- Mengimplementasikan parser asinkronus *Bulk Insert* untuk fitur Impor Excel massal dengan mapping kolom pintar (mendukung *legacy headers*).
- Menambahkan validasi *client-side* untuk mengonversi matriks Tipe Transaksi bahasa Indonesia (Pemasukan/Pengeluaran) menjadi enumerasi *Backend* (`income/expense`).
## [2026-08-22]
### Added
- Mengimplementasikan fitur *Export Laporan Pertanggungjawaban (LPJ)* pada modul Keuangan yang menghasilkan dokumen Excel hierarkis menggunakan *SheetJS Array-of-Arrays (AoA)*.
- Mengimplementasikan *bypass parameter export* pada `FinanceController` untuk mengoptimalkan *Bulk Fetch Query* tanpa merusak batasan paginasi tampilan tabel.
## [2026-08-22]
### Added
- Mengimplementasikan `Profile.jsx` sebagai portal *Self-Service* bagi pengguna untuk melengkapi atribut *Demografi* (NIM, Telepon, Prodi, Angkatan, Alamat).
- Mengintegrasikan modul keamanan *Ganti Kata Sandi* secara mandiri (terisolasi tanpa harus menghubungi Admin).
### Changed
- Memperbarui komponen `DashboardLayout.jsx` dengan mengonversi *User Card Info* menjadi *Navigation Link* interaktif.
## [2026-08-22]
### Added
- Mengimplementasikan `AttendanceModal.jsx` untuk antarmuka "Simpan Massal" (Bulk Upsert) absensi rapat, menggunakan *Local State Tracking* untuk meniadakan latensi beban jaringan.
- Mengintegrasikan fitur *Auto-Fill* (Tombol "Hadirkan Semua") yang memutasikan keseluruhan *state* entitas partisipan dalam satu siklus render komponen.
### Changed
- Memperbarui `Meeting.jsx` untuk menampilkan tombol aksi operasional "Absensi" (berbasis otorisasi kontekstual *Role*) di dalam *Table Row*.
## [2026-08-22]
### Added
- Membuat antarmuka `AuditTrail.jsx` eksklusif untuk Admin BPH Pusat guna memantau riwayat mutasi *database*.
- Mengimplementasikan *JSON Viewer Modal* untuk membedah perbedaan komparatif antara data lama dan data baru secara visual.
### Changed
- Memperbarui `DashboardLayout.jsx` dengan menambahkan modul *Log Aktivitas* pada navigasi *sidebar*.   
## [2026-08-23]
### Added
- Mengimplementasikan input formulir `document_sync_url` dan `finance_sync_url` pada `EventModal.jsx` untuk mengakomodasi penautan *spreadsheet* terdistribusi bagi kepanitiaan.
### Changed
- Merefaktor *Engine* Sinkronisasi `FinanceController` dan `DocumentController` menjadi arsitektur *Context-Aware*. *Endpoint* kini memproses injeksi parameter `event_id` untuk melakukan *routing data* (Wipe & Reload / UpdateOrCreate) secara terisolasi berdasarkan tautan URL milik ruang kerja masing-masing kepanitiaan.
- Membuka blokir render tombol "Sinkronisasi Cloud" di UI Dokumen dan Keuangan agar fitur *SSOT* dapat dieksekusi secara universal lintas ruang kerja.
## [2026-08-23]
### Added
- Mengimplementasikan `Agenda.jsx` untuk menggantikan modul Rapat lama, memperkenalkan antarmuka visualisasi *Timeline/Kanban List* yang reaktif dengan *Badge Status* kontekstual (Selesai/Proses/Tunda/Kendala).
### Changed
- Mengintegrasikan tombol *Cloud Sync* pada antarmuka Agenda sebagai gerbang utama mutasi data, meniadakan ketergantungan pada formulir input konvensional.
- Merevisi struktur *Routing* (`App.jsx`), navigasi *Sidebar* (`DashboardLayout.jsx`), dan *Payload API* (`AttendanceModal.jsx`) untuk mengakomodasi transisi terminologi dan URL *endpoint* dari `meetings` menjadi `agendas`.
### Removed
- Membuang komponen *Legacy* `Meeting.jsx` dan `MeetingModal.jsx` secara permanen.
## [2026-08-23]
### Added
- Mengimplementasikan antarmuka *Switch/Toggle Checkbox* `is_coordinator` pada `UserModal.jsx` untuk kontrol hierarkis (Master Data).
- Merombak arsitektur `AttendanceModal.jsx` menjadi *Wizard Flow* 2-Langkah: (1) Konfigurasi Otorisasi Target (*Target Provisioning*) dan (2) Eksekusi Mutasi Kehadiran (*Attendance Logging*). Perombakan ini secara fungsional menghubungkan interaksi UI dengan algoritma *Client-Side Filtering* secara dinamis sebelum di-*submit* ke *Backend*.
## [2026-08-25]
### Fixed
- Menambal celah *State Hydration Failure* pada `AttendanceModal` dengan mengimplementasikan state *lock* `isDataLoaded`. Ini mencegah mekanisme *background revalidation* bawaan SWR menimpa (*wipe*) *local state* formulir absensi pengguna secara paksa.
- Merevisi penggunaan `fetcher` menjadi `paginatedFetcher` pada inisialisasi `attendanceData` untuk meluruskan asimetri *wrapper* respons JSON antara *Controller* API dan klien.
## [2026-08-25]
### Added
- Mengimplementasikan modul *Data Export* mandiri pada `AttendanceModal` menggunakan kapabilitas *Client-Side Array-of-Arrays (AoA) Mapping* dari pustaka `xlsx`. Fitur ini merakit laporan *Buku Tamu Digital* berformat Excel secara lokal, meniadakan latensi komputasi *Backend* sekaligus memberikan struktur pelaporan LPJ *Out-of-the-Box* bagi administrator.
## [2026-08-25]
### Changed
- Mengeksekusi *Dashboard Metric Cleanup* dengan memusnahkan kalkulasi *Vanity Metrics* (Event Aktif & Surat Keluar) dari `DashboardService` untuk mengurangi beban komputasi *time-series* SQL yang tidak relevan.
- Merevisi *parser* waktu pada komponen `Dashboard.jsx` (Upcoming Meetings) untuk menggunakan atribut `start_date` secara eksplisit, menambal anomali referensi kolom usang (*nullish output*) akibat transisi arsitektur *Agendas*.
## [2026-08-25]
### Added
- Mengimplementasikan *Executive Dashboard UI* pada `Dashboard.jsx`, merombak arsitektur presentasi menjadi 3 layer krusial: *Alert Banner* (Tunggakan Personal), *KPI Metrics* (Partisipasi Rapat), dan *Dynamic Visual Analytics*.
- Membangun antarmuka *Tabbed Recharts* yang memungkinkan pengguna untuk melakukan *switching* visualisasi grafik arus kas secara instan antara entitas *General Ledger* (Kas Umum) dan *Event Ledger* tanpa beban kueri *Backend* tambahan.
- Menambahkan fungsionalitas *Time-Scope Filter* (3 Bulan vs 6 Bulan) berbasis pemotongan lar
## [2026-08-25]
### Added
- Mengimplementasikan antarmuka *Gamification Leaderboard* pada metrik Partisipasi Agenda di halaman *Dashboard*. Fitur ini memvisualisasikan data historis 5 agenda terakhir menggunakan *Progress Bar* reaktif (*color-coded thresholds*: Emerald > 80%, Amber > 50%, Rose < 50%) untuk menstimulasi transparansi performa dan intervensi organik antar-pengurus.
- Merevisi komponen hierarki `StatCard` dengan *layout alignment* `flex-col justify-center` untu