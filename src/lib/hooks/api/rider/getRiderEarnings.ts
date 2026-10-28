import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface CompletedDeliveryItem {
  _id: string;
  identifier: string;
  trackingId: string;
  parcelName: string;
  parcelType: "document" | "not-document";
  parcelWeight: number;
  receiverName: string;
  receiverPhone: string;
  receiverDistrict: string;
  receiverAddress: string;
  senderName: string;
  senderDistrict: string;
  deliveryCharge: number;
  paymentStatus: string;
  paymentMethod: string;
  deliveredAt?: string;
  status: "delivered";
  createdAt: string;
}

export interface RiderEarningsData {
  totalEarnings: number;
  completedTrips: number;
  todayEarnings: number;
  todayCount: number;
  inTransitEarnings: number;
  inTransitCount: number;
  completedDeliveries: CompletedDeliveryItem[];
}

export interface GetRiderEarningsResponse {
  success: boolean;
  message: string;
  data: RiderEarningsData;
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export const getRiderEarnings = async (
  tokenParam?: string
): Promise<GetRiderEarningsResponse> => {
  const token =
    tokenParam ||
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    "";

  const url = `${import.meta.env.VITE_API_BASE_URL}/bookings/rider/earnings`;

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
    const detail = error.errors?.[0]?.message;
    throw new Error(detail || error.message || "Failed to fetch rider earnings");
  }

  return result as GetRiderEarningsResponse;
};

export const useRiderEarnings = (token?: string) => {
  return useQuery({
    queryKey: ["rider-earnings", token],
    queryFn: () => getRiderEarnings(token),
  });
};

