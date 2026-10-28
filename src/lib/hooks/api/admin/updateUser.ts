import { useMutation, useQueryClient } from "@tanstack/react-query";

// ── Request & Response types ────────────────────────────────────
export interface AdminUser {
  id: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  role: "user" | "rider" | "admin" | "operator";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  id: string;
  fullName?: string;
  emailAddress?: string;
  password?: string;
  phone?: string;
  role?: "user" | "rider" | "admin" | "operator";
  token?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
export const updateUser = async (
  userData: UpdateUserData,
): Promise<UpdateUserResponse> => {
  const { id, token: token, ...bodyData } = userData;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    const firstDetail = error.errors?.[0]?.message;
    throw new Error(firstDetail || error.message || "Failed to update user");
  }

  return result as UpdateUserResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, Error, UpdateUserData>({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};
