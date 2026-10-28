import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

// ── Request & Response types ────────────────────────────────────
export interface DashboardStatsParams {
  token?: string;
}

export interface DashboardStats {
  users: {
    total: number;
    customers: number;
    riders: number;
    operators?: number;
    admins: number;
  };
  bookings: {
    total: number;
    pending: number;
    accepted: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  revenue: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
export const getDashboardStats = async (
  params?: DashboardStatsParams
): Promise<DashboardStatsResponse> => {
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

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/stats`,
    {
      method: "GET",
      headers,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }

  return result as DashboardStatsResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useAdminDashboardStats = (params?: DashboardStatsParams) => {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: ["admin-dashboard-stats", params?.token],
    queryFn: () => getDashboardStats(params),
  });
};
