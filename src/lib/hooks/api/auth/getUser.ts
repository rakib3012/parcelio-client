import { useQuery } from "@tanstack/react-query";
import type { User } from "@/lib/types/auth";
import Cookies from "js-cookie";

// ── Request & Response types ────────────────────────────────────
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface ApiError {
  success: boolean;
  message: string;
}

// ── Fetch function ──────────────────────────────────────────────
export const getUser = async (token?: string): Promise<GetUserResponse> => {
  const authToken =
    token ||
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    "";

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch user");
  }

  return result as GetUserResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useGetUser = (token?: string) => {
  return useQuery<GetUserResponse, Error>({
    queryKey: ["auth-user", token],
    queryFn: () => getUser(token),
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
