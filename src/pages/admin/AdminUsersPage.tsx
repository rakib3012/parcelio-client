import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Bike,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useAdminUsers,
  type AdminUser,
} from "@/lib/hooks/api/admin/getAllUsers";
import {
  useCreateUser,
  type CreateUserData as CreateUserPayload,
} from "@/lib/hooks/api/admin/createUser";
import {
  useUpdateUser,
  type UpdateUserData as UpdateUserPayload,
} from "@/lib/hooks/api/admin/updateUser";
import { useDeleteUser } from "@/lib/hooks/api/admin/deleteUser";
import Cookies from "js-cookie";

// ── Role badge component ────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const config: Record<
    string,
    {
      bg: string;
      text: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    user: {
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-700",
      icon: UserCheck,
    },
    rider: {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-700",
      icon: Bike,
    },
    admin: {
      bg: "bg-purple-50 border-purple-100",
      text: "text-purple-700",
      icon: ShieldCheck,
    },
  };
  const c = config[role] || config.user;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.bg} ${c.text}`}
    >
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────────

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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

  const { data, isLoading, isError } = useAdminUsers({
    page,
    limit: 10,
    role: roleFilter || undefined,
    search: debouncedSearch || undefined,
    token,
  });

  const users = data?.data?.users ?? [];
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
      { id: deleteConfirm.identifier, token },
      {
        onSuccess: () => setDeleteConfirm(null),
      },
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {pagination
              ? `${pagination.total} total users`
              : "Manage all registered users"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#1C1D20] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["", "user", "rider", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  roleFilter === r
                    ? "bg-[#1C1D20] text-white border-[#1C1D20]"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {r === ""
                  ? "All"
                  : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-neutral-500">Failed to load users</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Users className="w-10 h-10 text-neutral-300" />
            <p className="text-sm text-neutral-400 font-medium">
              No users found
            </p>
            <p className="text-xs text-neutral-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      User
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
                <tbody className="divide-y divide-neutral-50">
                  {users.map((user) => (
                    <tr
                      key={user.identifier}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-neutral-900">
                            {user.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {user.emailAddress}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-500">
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
                            },
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
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
            <div className="md:hidden divide-y divide-neutral-100">
              {users.map((user) => (
                <div key={user.identifier} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-neutral-500">
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
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
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
        <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200/80 shadow-xs px-6 py-3">
          <span className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} users
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

// ── User Form Modal ────────────────────────────────────────────

function UserFormModal({
  user,
  onClose,
  createMutation,
  updateMutation,
}: {
  user: AdminUser | null;
  onClose: () => void;
  createMutation: ReturnType<typeof useCreateUser>;
  updateMutation: ReturnType<typeof useUpdateUser>;
}) {
  const isEditing = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName ?? "",
    emailAddress: user?.emailAddress ?? "",
    password: "",
    phone: user?.phone ?? "",
    role: user?.role ?? "user",
  });
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.emailAddress.trim()) {
      setError("Email address is required");
      return;
    }
    if (!isEditing && !formData.password) {
      setError("Password is required for new users");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const token = Cookies.get("accessToken") || "";

    if (isEditing) {
      const payload: UpdateUserPayload = {
        id: user!.identifier,
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        phone: formData.phone,
        role: formData.role as "user" | "rider" | "admin",
        token,
      };
      if (formData.password) payload.password = formData.password;
      updateMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      });
    } else {
      const payload: CreateUserPayload = {
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        password: formData.password,
        phone: formData.phone,
        role: formData.role as "user" | "rider" | "admin",
        token,
      };
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {isEditing ? "Edit User" : "Create New User"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isEditing
                ? `Editing ${user?.fullName}`
                : "Fill in the details below"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Password {isEditing ? "(leave blank to keep)" : "*"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
                placeholder={isEditing ? "••••••••" : "Min. 6 characters"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
              placeholder="01712345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["user", "rider", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange("role", r)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    formData.role === r
                      ? "bg-[#1C1D20] text-white border-[#1C1D20] shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {r === "user" && <UserCheck className="w-3.5 h-3.5" />}
                  {r === "rider" && <Bike className="w-3.5 h-3.5" />}
                  {r === "admin" && <ShieldCheck className="w-3.5 h-3.5" />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────────

function DeleteConfirmModal({
  user,
  isLoading,
  onCancel,
  onConfirm,
}: {
  user: AdminUser;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Delete User</h3>
        <p className="text-sm text-neutral-500 mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-neutral-700">
            {user.fullName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
