import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface AdminBooking {
  identifier: string;
  trackingId: string;
  userId: {
    identifier: string;
    fullName: string;
    emailAddress: string;
    phone: string;
  } | null;
  parcelType: "document" | "not-document";
  parcelName: string;
  parcelWeight: number;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderDistrict: string;
  pickupInstruction: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverDistrict: string;
  deliveryInstruction: string;
  deliveryCharge: number;
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "cancelled";
  paymentMethod: string;
  riderId: string | null;
  statusHistory: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: AdminBooking[];
    pagination: Pagination;
  };
}

interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: { booking: AdminBooking };
}

export interface UpdateBookingStatusPayload {
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  note?: string;
  paymentStatus?: "pending" | "paid" | "cancelled";
  token?: string;
}

// ── Fetch Functions ────────────────────────────────────────────

export const fetchAllBookings = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  district?: string;
  token?: string;
}): Promise<BookingsResponse> => {
  

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.district) searchParams.set("district", params.district);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings?${searchParams.toString()}`,
    {
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${params.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch bookings");
  }

  return result as BookingsResponse;
};

export const updateBookingStatus = async ({
  id,
  ...payload
}: UpdateBookingStatusPayload & { id: string }): Promise<SingleBookingResponse> => {

  const { token: token, ...bodyData } = payload;

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

// ── Hooks ──────────────────────────────────────────────────────

export const useAdminBookings = (params: {
  page?: number;
  limit?: number;
  status?: string;
  district?: string;
  token?: string;
}) => {
  return useQuery({
    queryKey: ["admin-bookings", params],
    queryFn: () => fetchAllBookings(params),
  });
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
