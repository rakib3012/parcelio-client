import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface AssignedBookingItem {
  id: string;
  _id: string;
  trackingId: string;
  parcelName: string;
  parcelType: "document" | "not-document";
  parcelWeight: number;
  senderName: string;
  senderPhone: string;
  senderDistrict: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverDistrict: string;
  receiverAddress: string;
  deliveryInstruction?: string;
  deliveryCharge: number;
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "cancelled";
  paymentMethod: string;
  assignedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  operatorId?: {
    _id: string;
    fullName: string;
    phone?: string;
    emailAddress?: string;
  } | null;
  statusHistory: {
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string | null;
    updatedByRole?: "user" | "operator" | "rider" | "admin" | null;
  }[];
  createdAt: string;
}

export interface GetRiderAssignedBookingsParams {
  status?: string;
  page?: number;
  limit?: number;
  token?: string;
}

export interface RiderAssignedBookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: AssignedBookingItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export const getRiderAssignedBookings = async (
  params?: GetRiderAssignedBookingsParams
): Promise<RiderAssignedBookingsResponse> => {
  const token =
    params?.token ||
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    "";

  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const queryParameters = searchParams.toString();
  const url = `${import.meta.env.VITE_API_BASE_URL}/bookings/rider/assigned${
    queryParameters ? `?${queryParameters}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to fetch assigned deliveries");
  }

  return result as RiderAssignedBookingsResponse;
};

export const useRiderAssignedBookings = (
  params?: GetRiderAssignedBookingsParams
) => {
  return useQuery<RiderAssignedBookingsResponse, Error>({
    queryKey: ["rider-assigned-deliveries", params?.status, params?.page, params?.limit],
    queryFn: () => getRiderAssignedBookings(params),
  });
};

