import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Key, Save, Loader2, ShieldCheck, Mail, Phone, Hash, GraduationCap, Calendar, MapPin } from 'lucide-react';

export default function Profile() {
  const { user, checkAuth } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    nim: '',
    phone: '',
    prodi: '',
    angkatan: '',
    address: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        nim: user.nim || '',
        phone: user.phone || '',
        prodi: user.prodi || '',
        angkatan: user.angkatan || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileErrors({});

    try {
      await api.put('/api/user/profile', profileForm);
      await checkAuth();
      toast.success('Profil berhasil diperbarui.');
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.errors) {
          setProfileErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError) toast.error(firstError);
        } else if (data.message) {
          toast.error(data.message);
        }
      } else {
        toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordErrors({});

    try {
      await api.put('/api/user/password', passwordForm);
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      toast.success('Kata sandi berhasil diperbarui.');
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.errors) {
          setPasswordErrors(data.errors);
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError) toast.error(firstError);
        } else if (data.message) {
          toast.error(data.message);
        }
      } else {
        toast.error(err.response?.data?.message || 'Gagal memperbarui kata sandi.');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:placeholder-slate-500 ${
      hasError
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-white/10 dark:focus:ring-primary-500/20'
    }`;

  return (
    <div className="space-y-6 max-w-4xl animate-slide-up-fade">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profil Saya</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola informasi data diri dan pengaturan keamanan akun Anda.
          </p>
        </div>
      </div>

      {/* Card 1: Informasi Pribadi */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <User className="h-5 w-5 text-primary-500" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Informasi Pribadi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perbarui biodata dan kontak akun Anda.
              </p>
            </div>
          </div>
          <span className="rounded-md bg-primary-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {user?.roles?.[0]?.name || 'Member'}
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Row 1: Nama & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <User className="h-3.5 w-3.5" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Masukkan nama lengkap"
                className={inputClass(!!profileErrors.name)}
              />
              {profileErrors.name && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="contoh@email.com"
                className={inputClass(!!profileErrors.email)}
              />
              {profileErrors.email && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Row 2: NIM & No Telepon */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Hash className="h-3.5 w-3.5" />
                NIM / Nomor Induk
              </label>
              <input
                type="text"
                name="nim"
                value={profileForm.nim}
                onChange={handleProfileChange}
                placeholder="Masukkan NIM"
                className={inputClass(!!profileErrors.nim)}
              />
              {profileErrors.nim && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.nim[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5" />
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="081234567890"
                className={inputClass(!!profileErrors.phone)}
              />
              {profileErrors.phone && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.phone[0]}</p>
              )}
            </div>
          </div>

          {/* Row 3: Program Studi & Angkatan */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <GraduationCap className="h-3.5 w-3.5" />
                Program Studi
              </label>
              <input
                type="text"
                name="prodi"
                value={profileForm.prodi}
                onChange={handleProfileChange}
                placeholder="Contoh: Teknik Informatika"
                className={inputClass(!!profileErrors.prodi)}
              />
              {profileErrors.prodi && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.prodi[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                Tahun Angkatan
              </label>
              <input
                type="text"
                name="angkatan"
                value={profileForm.angkatan}
                onChange={handleProfileChange}
                placeholder="Contoh: 2024"
                className={inputClass(!!profileErrors.angkatan)}
              />
              {profileErrors.angkatan && (
                <p className="mt-1 text-xs text-red-400">{profileErrors.angkatan[0]}</p>
              )}
            </div>
          </div>

          {/* Row 4: Alamat */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Alamat Domisili
            </label>
            <textarea
              name="address"
              rows={3}
              value={profileForm.address}
              onChange={handleProfileChange}
              placeholder="Masukkan alamat lengkap domisili saat ini..."
              className={inputClass(!!profileErrors.address)}
            />
            {profileErrors.address && (
              <p className="mt-1 text-xs text-red-400">{profileErrors.address[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Card 2: Keamanan Akun */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <Key className="h-5 w-5 text-amber-500" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Keamanan Akun</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
              </p>
            </div>
          </div>
          <ShieldCheck className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              placeholder="Masukkan kata sandi lama Anda"
              className={inputClass(!!passwordErrors.current_password)}
            />
            {passwordErrors.current_password && (
              <p className="mt-1 text-xs text-red-400">{passwordErrors.current_password[0]}</p>
            )}
          </div>

          {/* New Password & Confirmation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
                placeholder="Minimal 8 karakter"
                className={inputClass(!!passwordErrors.password)}
              />
              {passwordErrors.password && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={passwordForm.password_confirmation}
                onChange={handlePasswordChange}
                placeholder="Ulangi kata sandi baru"
                className={inputClass(!!passwordErrors.password_confirmation)}
              />
              {passwordErrors.password_confirmation && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.password_confirmation[0]}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-amber-400"
            >
              {isSavingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Key className="h-4 w-4" />
              )}
              <span>{isSavingPassword ? 'Memperbarui...' : 'Perbarui Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
