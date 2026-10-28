import { useMutation, useQueryClient } from "@tanstack/react-query";

// ── Request & Response types ────────────────────────────────────
export interface AdminUser {
  identifier: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  role: "user" | "rider" | "admin" | "operator";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  fullName: string;
  emailAddress: string;
  password: string;
  phone?: string;
  role?: "user" | "rider" | "admin" | "operator";
  token?: string;
}

export interface CreateUserResponse {
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
export const createUser = async (
  userData: CreateUserData
): Promise<CreateUserResponse> => {


  const { token:token, ...bodyData } = userData;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/users`,
    {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    const firstDetail = error.errors?.[0]?.message;
    throw new Error(firstDetail || error.message || "Failed to create user");
  }

  return result as CreateUserResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateUserResponse, Error, CreateUserData>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};
