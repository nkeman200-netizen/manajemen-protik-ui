import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { paginatedFetcher } from '../api/fetcher';
import api from '../api/axios';
import toast from 'react-hot-toast';
import UserModal from '../components/UserModal';
import DivisionModal from '../components/DivisionModal';
import {
  Database,
  Users,
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Building2,
} from 'lucide-react';

export default function MasterData() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [userPage, setUserPage] = useState(1);
  const [divPage, setDivPage] = useState(1);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const isAdmin = user?.roles?.[0]?.name === 'admin';

  // Fetch Users
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    mutate: mutateUsers,
  } = useSWR(isAdmin ? `/api/users?page=${userPage}` : null, paginatedFetcher);

  // Fetch Divisions (paginated for Tab 2)
  const {
    data: divisionsData,
    error: divisionsError,
    isLoading: divisionsLoading,
    mutate: mutateDivisions,
  } = useSWR(
    isAdmin ? `/api/divisions?page=${divPage}` : null,
    paginatedFetcher
  );

  // Fetch all divisions for UserModal dropdown
  const { data: allDivisionsData } = useSWR(
    isAdmin ? '/api/divisions' : null,
    paginatedFetcher
  );

  // RBAC Access Guard
  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-50 px-8 py-8 text-center dark:bg-red-500/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Akses Ditolak</h2>
            <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
              Halaman Master Data hanya dapat diakses oleh Administrator BPH Pusat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const usersList =
    usersData?.data?.data || (Array.isArray(usersData?.data) ? usersData.data : []) || [];
  const userMeta =
    usersData?.meta || (usersData?.data && !Array.isArray(usersData?.data) ? usersData.data : null);

  const divisionsList =
    divisionsData?.data?.data || (Array.isArray(divisionsData?.data) ? divisionsData.data : []) || [];
  const divMeta =
    divisionsData?.meta ||
    (divisionsData?.data && !Array.isArray(divisionsData?.data) ? divisionsData.data : null);

  const dropdownDivisions =
    allDivisionsData?.data?.data ||
    (Array.isArray(allDivisionsData?.data) ? allDivisionsData.data : []) ||
    divisionsList;

  // Delete Division Handler
  const handleDeleteDivision = async (id) => {
    if (window.confirm('Yakin ingin menghapus divisi ini?')) {
      try {
        await api.delete(`/api/divisions/${id}`);
        toast.success('Divisi berhasil dihapus.');
        mutateDivisions();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Gagal menghapus divisi.');
      }
    }
  };

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'bg-purple-500/15 text-purple-600 border-purple-500/20 dark:text-purple-400';
      case 'advisor':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400';
      default:
        return 'bg-primary-500/15 text-primary-600 border-primary-500/20 dark:text-primary-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/25">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Master Data Organisasi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kelola data seluruh anggota, struktur divisi, dan hak akses sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'users'
              ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Daftar Anggota</span>
          <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {userMeta?.total ?? usersList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('divisions')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'divisions'
              ? 'bg-primary-600/15 text-primary-600 shadow-sm dark:bg-primary-600/20 dark:text-primary-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
          }`}
        >
          <FolderTree className="h-4 w-4" />
          <span>Struktur Divisi</span>
          <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {divMeta?.total ?? divisionsList.length}
          </span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: DAFTAR ANGGOTA (USERS)             */}
      {/* ========================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {usersLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : usersError ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-red-50 p-6 dark:bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Gagal memuat data anggota.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Nama Anggota
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Email
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Divisi
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Hak Akses (Role)
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {usersList.length > 0 ? (
                      usersList.map((item) => {
                        const userRole = item.roles?.[0]?.name || 'member';
                        const isSuspended = item.status === 'suspended';

                        return (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white">
                                  {item.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                              {item.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.division?.name ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                  {item.division.name}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${getRoleBadge(
                                  userRole
                                )}`}
                              >
                                {userRole}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {isSuspended ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                  Suspended
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedUser(item);
                                  setUserModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                        >
                          Belum ada anggota terdaftar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* User Pagination */}
              {userMeta && userMeta.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Halaman {userMeta.current_page} dari {userMeta.last_page}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage === 1}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>
                    <button
                      onClick={() => setUserPage((p) => p + 1)}
                      disabled={userPage >= userMeta.last_page || !usersData?.links?.next}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: STRUKTUR DIVISI                    */}
      {/* ========================================= */}
      {activeTab === 'divisions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSelectedDivision(null);
                setDivisionModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition hover:shadow-lg hover:shadow-primary-500/30"
            >
              <Plus className="h-4 w-4" />
              Tambah Divisi
            </button>
          </div>

          {divisionsLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : divisionsError ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/20 bg-red-50 p-6 dark:bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Gagal memuat data divisi.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-transparent">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Nama Divisi
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {divisionsList.length > 0 ? (
                      divisionsList.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                                <FolderTree className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDivision(item);
                                  setDivisionModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDivision(item.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                        >
                          Belum ada divisi terdaftar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Division Pagination */}
              {divMeta && divMeta.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-white/10">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Halaman {divMeta.current_page} dari {divMeta.last_page}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDivPage((p) => Math.max(1, p - 1))}
                      disabled={divPage === 1}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>
                    <button
                      onClick={() => setDivPage((p) => p + 1)}
                      disabled={divPage >= divMeta.last_page || !divisionsData?.links?.next}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:shadow-none dark:hover:bg-white/5"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Edit Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={() => mutateUsers()}
        initialData={selectedUser}
        divisions={dropdownDivisions}
      />

      {/* Division CRUD Modal */}
      <DivisionModal
        isOpen={divisionModalOpen}
        onClose={() => {
          setDivisionModalOpen(false);
          setSelectedDivision(null);
        }}
        onSuccess={() => mutateDivisions()}
        initialData={selectedDivision}
      />
    </div>
  );
}
