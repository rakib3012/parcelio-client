import { useQuery } from "@tanstack/react-query";

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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: AdminBooking[];
    pagination: Pagination;
  };
}

export interface FetchAllBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
  district?: string;
  token?: string;
}

export const fetchAllBookings = async (
  params: FetchAllBookingsParams
): Promise<BookingsResponse> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.district) searchParams.set("district", params.district);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
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

export const useAdminBookings = (params: FetchAllBookingsParams) => {
  return useQuery({
    queryKey: ["admin-bookings", params],
    queryFn: () => fetchAllBookings(params),
  });
};
