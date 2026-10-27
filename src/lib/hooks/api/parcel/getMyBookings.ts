import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type { MyBookingsResponse } from "@/lib/types/booking";

/**
 * Fetch all parcel bookings created by the authenticated user
 */
export const fetchMyBookings = async (): Promise<MyBookingsResponse> => {
  const accessToken =
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${apiBaseUrl}/bookings/my-bookings`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.message || "Failed to retrieve user parcel bookings";
    throw new Error(errorMessage);
  }

  return result as MyBookingsResponse;
};

/**
 * React Query hook to get the logged-in user's parcel bookings
 */
export const useMyBookings = (isQueryEnabled = true) => {
  const accessToken =
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  const hasAccessToken = Boolean(accessToken);

  return useQuery<MyBookingsResponse, Error>({
    queryKey: ["my-bookings"],
    queryFn: fetchMyBookings,
    enabled: Boolean(hasAccessToken && isQueryEnabled),
    staleTime: 1000 * 60, // 1 minute
  });
};
