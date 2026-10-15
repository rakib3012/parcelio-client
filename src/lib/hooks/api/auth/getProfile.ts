import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@/lib/types/auth";
import Cookies from "js-cookie";

// ── Request & Response types ────────────────────────────────────
export interface GetProfileResponse {
  success: boolean;
  message: string;
  data: {
    userProfile: UserProfile;
  };
}

interface ApiError {
  success: boolean;
  message: string;
}

// ── Fetch function ──────────────────────────────────────────────
export const getProfile = async (token?: string): Promise<GetProfileResponse> => {
  const authToken =
    token ||
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    "";

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
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
    throw new Error(error.message || "Failed to fetch profile");
  }

  return result as GetProfileResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useGetProfile = (token?: string) => {
  const activeToken =
    token ||
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "");

  return useQuery<GetProfileResponse, Error>({
    queryKey: ["auth-profile", activeToken],
    queryFn: () => getProfile(activeToken || undefined),
    enabled: !!activeToken,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
