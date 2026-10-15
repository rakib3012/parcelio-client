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

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  token?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    pagination: Pagination;
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
export const getAllUsers = async (
  params?: GetAllUsersParams
): Promise<GetAllUsersResponse> => {
  const token =
    params?.token ||
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

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.role) searchParams.set("role", params.role);
  if (params?.search) searchParams.set("search", params.search);

  const queryString = searchParams.toString();
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch users");
  }

  return result as GetAllUsersResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useAdminUsers = (params?: GetAllUsersParams) => {
  return useQuery<GetAllUsersResponse, Error>({
    queryKey: ["admin-users", params],
    queryFn: () => getAllUsers(params),
  });
};

export const useGetAllUsers = useAdminUsers;
