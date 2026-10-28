import { useState, useEffect } from "react";
import {
  Headset,
  Search,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import {
  useAdminUsers,
  type AdminUser,
} from "@/lib/hooks/api/admin/getAllUsers";
import { useCreateUser } from "@/lib/hooks/api/admin/createUser";
import { useUpdateUser } from "@/lib/hooks/api/admin/updateUser";
import { useDeleteUser } from "@/lib/hooks/api/admin/deleteUser";
import Cookies from "js-cookie";
import { RoleBadge } from "@/components/AdminComponent/RoleBadge";
import { UserFormModal } from "@/components/Modal/UserFormModal";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";

export const AdminOperatorsPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const token = Cookies.get("accessToken") || "";

  // Fetch only users with role="operator"
  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit: 10,
    role: "operator",
    search: debouncedSearch || undefined,
    token,
  });

  const operators = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const openCreateModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    deleteMutation.mutate(
      { id: deleteConfirm._id, token },
      {
        onSuccess: () => setDeleteConfirm(null),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Operator Management
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {pagination
                  ? `${pagination.total} registered hub & dispatch operators`
                  : "Manage parcel sorting, dispatch & branch operators"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Operator
        </button>
      </div>

      {/* Operator Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Total Operators
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Headset className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            {pagination?.total ?? operators.length}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Active dispatch & branch staff
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Hub Coverage
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            64 Districts
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Central & regional dispatch centers
          </p>
        </div>

        <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Access Control
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
            Role: Operator
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Authorized for hub dispatch & riders
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs p-4 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search operators by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-700 dark:text-neutral-200 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Operators Table / Cards */}
      <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Failed to load operators</p>
          </div>
        ) : operators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
              <Headset className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                No operators found
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm">
                {debouncedSearch
                  ? "No operator matched your search query. Try another keyword."
                  : "Add your first operator to manage parcels and dispatch operations."}
              </p>
            </div>
            {!debouncedSearch && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CAEA3C] text-neutral-900 font-bold text-xs hover:bg-[#bde028] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Operator
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-[#10141d]/50">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Operator
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Phone
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Joined
                    </th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-white/10">
                  {operators.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white block">
                              {user.fullName}
                            </span>
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                              Hub Specialist
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                          {user.emailAddress}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {user.phone || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-neutral-400">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Edit Operator"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Delete Operator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-neutral-100 dark:divide-white/10">
              {operators.map((user) => (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {user.emailAddress}
                        </p>
                      </div>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {user.phone || "No phone"} · Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs px-6 py-3 transition-colors">
          <span className="text-xs text-neutral-400 dark:text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} operators
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <UserFormModal
          user={editingUser}
          defaultRole="operator"
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          createMutation={createMutation}
          updateMutation={updateMutation}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          user={deleteConfirm}
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdminOperatorsPage;

