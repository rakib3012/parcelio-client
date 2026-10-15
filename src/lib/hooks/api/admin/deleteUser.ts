import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

// ── Request & Response types ────────────────────────────────────
export interface DeleteUserData {
  id: string;
  token?: string;
}

export type DeleteUserPayload = string | DeleteUserData;

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
export const deleteUser = async (
  payload: DeleteUserPayload
): Promise<DeleteUserResponse> => {
  const id = typeof payload === "string" ? payload : payload.id;
  const passedToken = typeof payload === "object" ? payload.token : undefined;

  const token =
    passedToken ||
    Cookies.get("accessToken") ||
    Cookies.get("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
    {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to delete user");
  }

  return result as DeleteUserResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, Error, DeleteUserPayload>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};
