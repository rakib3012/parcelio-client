import { useMutation } from "@tanstack/react-query";

export interface BookingPayload {
  parcelType: "document" | "not-document";
  parcelName: string;
  parcelWeight: number | string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderDistrict: string;
  pickupInstruction?: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverDistrict: string;
  deliveryInstruction?: string;
  paymentMethod?: "cash_on_delivery" | "online" | "bkash" | "nagad";
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: {
      identifier: string;
      trackingId: string;
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
      status: string;
      paymentStatus: string;
      paymentMethod: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

const submitBooking = async (
  bookingData: BookingPayload
): Promise<BookingResponse> => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...bookingData,
        parcelWeight: Number(bookingData.parcelWeight),
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    const firstDetail = error.errors?.[0]?.message;
    throw new Error(firstDetail || error.message || "Failed to create parcel booking");
  }

  return result as BookingResponse;
};

export const useCreateBooking = () => {
  return useMutation<BookingResponse, Error, BookingPayload>({
    mutationFn: submitBooking,
  });
};
