import { useQuery } from "@tanstack/react-query";
import type { TrackBookingResponse } from "@/lib/types/booking";

/**
 * Fetch parcel tracking details by unique tracking ID (e.g. PRCL-123456)
 * Public endpoint - no authorization header required
 */
export const fetchTrackBooking = async (
  trackingId: string
): Promise<TrackBookingResponse> => {
  const normalizedTrackingId = trackingId.trim().toUpperCase();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(
    `${apiBaseUrl}/bookings/track/${normalizedTrackingId}`
  );
  const result = await response.json();

  if (!response.ok) {
    const errorMessage =
      result.message ||
      `No shipment found with tracking code: ${trackingId}`;
    throw new Error(errorMessage);
  }

  return result as TrackBookingResponse;
};

/**
 * React Query hook to track a parcel by tracking ID
 */
export const useTrackBooking = (
  trackingId: string,
  isQueryEnabled = true
) => {
  const normalizedTrackingId = trackingId ? trackingId.trim().toUpperCase() : "";
  const isValidLength = normalizedTrackingId.length >= 4;

  return useQuery<TrackBookingResponse, Error>({
    queryKey: ["track-booking", normalizedTrackingId],
    queryFn: () => fetchTrackBooking(normalizedTrackingId),
    enabled: Boolean(isValidLength && isQueryEnabled),
    retry: 1,
    staleTime: 1000 * 30, // 30 seconds
  });
};
