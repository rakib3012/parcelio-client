import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

// ── Request & Response types ────────────────────────────────────
export interface AdminUser {
  identifier: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  role: "user" | "rider" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface GetUserByIdParams {
  id: string;
  token?: string;
}

export interface GetUserByIdResponse {
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
export const getUserById = async (
  params: GetUserByIdParams
): Promise<GetUserByIdResponse> => {
  const token =
    params.token ||
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
    `${import.meta.env.VITE_API_BASE_URL}/admin/users/${params.id}`,
    {
      method: "GET",
      headers,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch user");
  }

  return result as GetUserByIdResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useAdminUser = (params: string | GetUserByIdParams) => {
  const id = typeof params === "string" ? params : params.id;
  const paramObj: GetUserByIdParams = typeof params === "string" ? { id: params } : params;

  return useQuery<GetUserByIdResponse, Error>({
    queryKey: ["admin-user", id, paramObj.token],
    queryFn: () => getUserById(paramObj),
    enabled: !!id,
  });
};

export const useGetUserById = useAdminUser;
