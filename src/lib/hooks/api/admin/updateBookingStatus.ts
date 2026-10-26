import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface UpdateBookingStatusPayload {
  id: string;
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  note?: string;
  paymentStatus?: "pending" | "paid" | "cancelled";
  token?: string;
}

export interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: {
      identifier: string;
      trackingId: string;
      status: string;
      paymentStatus: string;
    };
  };
}

export const updateBookingStatus = async (payload: UpdateBookingStatusPayload): Promise<SingleBookingResponse> => {
  const { id, token, ...bodyData } = payload;

console.log("payload>>>>>", payload);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    const firstDetail = error.errors?.[0]?.message;
    throw new Error(firstDetail || error.message || "Failed to update booking status");
  }

  return result as SingleBookingResponse;
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
};
