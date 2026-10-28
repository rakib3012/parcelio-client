import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface BulkAssignPayload {
  bookingIds: string[];
  riderId: string;
  note?: string;
  token?: string;
}

export interface BulkAssignResponse {
  success: boolean;
  message: string;
  data: {
    assignedCount: number;
    rider: {
      id: string;
      fullName: string;
      phone?: string;
    };
    operator: {
      id: string;
      fullName: string;
    };
    assignedAt: string;
    assignedBookingIds: string[];
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export const bulkAssignBookings = async (
  payload: BulkAssignPayload
): Promise<BulkAssignResponse> => {
  const token =
    payload.token ||
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    "";

  const { token: _extractedToken, ...requestBody } = payload;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings/bulk-assign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    const detail = error.errors?.[0]?.message;
    throw new Error(detail || error.message || "Failed to bulk assign parcels");
  }

  return result as BulkAssignResponse;
};

export const useBulkAssignBookings = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkAssignResponse, Error, BulkAssignPayload>({
    mutationFn: bulkAssignBookings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rider-assigned-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};

