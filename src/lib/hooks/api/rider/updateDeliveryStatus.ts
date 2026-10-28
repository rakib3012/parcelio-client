import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface UpdateDeliveryStatusPayload {
  id: string;
  status: "in_transit" | "delivered" | "cancelled";
  cancellationReason?: string;
  note?: string;
  token?: string;
}

export interface UpdateDeliveryStatusResponse {
  success: boolean;
  message: string;
  data: {
    booking: {
      id: string;
      trackingId: string;
      status: string;
      paymentStatus: string;
      deliveredAt?: string;
      cancelledAt?: string;
      cancellationReason?: string;
    };
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export const updateDeliveryStatus = async (
  payload: UpdateDeliveryStatusPayload
): Promise<UpdateDeliveryStatusResponse> => {
  const token =
    payload.token ||
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    "";

  const { id, token: _extractedToken, ...requestBody } = payload;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings/${id}/delivery-status`,
    {
      method: "PATCH",
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
    throw new Error(
      detail || error.message || "Failed to update delivery status"
    );
  }

  return result as UpdateDeliveryStatusResponse;
};

export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateDeliveryStatusResponse,
    Error,
    UpdateDeliveryStatusPayload
  >({
    mutationFn: updateDeliveryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-assigned-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["rider-earnings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};

