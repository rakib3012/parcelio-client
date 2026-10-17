import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  UserCheck,
  Bike,
  ShieldCheck,
} from "lucide-react";
import Cookies from "js-cookie";
import type { AdminUser } from "@/lib/hooks/api/admin/getAllUsers";
import {
  useCreateUser,
  type CreateUserData as CreateUserPayload,
} from "@/lib/hooks/api/admin/createUser";
import {
  useUpdateUser,
  type UpdateUserData as UpdateUserPayload,
} from "@/lib/hooks/api/admin/updateUser";

interface UserFormModalProps {
  user: AdminUser | null;
  onClose: () => void;
  createMutation: ReturnType<typeof useCreateUser>;
  updateMutation: ReturnType<typeof useUpdateUser>;
}

export function UserFormModal({
  user,
  onClose,
  createMutation,
  updateMutation,
}: UserFormModalProps) {
  const isEditing = Boolean(user);
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
    setFormData((previousData) => ({ ...previousData, [field]: value }));
    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
        id: user?._id || "",
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        phone: formData.phone,
        role: formData.role as "user" | "rider" | "admin",
        token,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
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
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
