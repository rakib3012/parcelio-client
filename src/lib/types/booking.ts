export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "cancelled";

export type PaymentMethod = "cash_on_delivery" | "online" | "bkash" | "nagad";

export type ParcelType = "document" | "not-document";

export interface StatusHistoryItem {
  status: BookingStatus;
  timestamp: string | Date;
  note?: string;
  updatedBy?: string | { _id: string; fullName: string };
  updatedByRole?: "user" | "operator" | "rider" | "admin";
}

export interface BookingDetail {
  id?: string;
  _id?: string;
  trackingId: string;
  userId?:
    | {
        _id?: string;
        fullName?: string;
        emailAddress?: string;
        phone?: string;
      }
    | string;
  parcelType: ParcelType;
  parcelName: string;
  parcelWeight: number;
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
  deliveryCharge: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  operatorId?: string | { _id: string; fullName: string; phone?: string; emailAddress?: string };
  riderId?: string | { _id: string; fullName: string; phone?: string; emailAddress?: string };
  assignedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TrackBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: BookingDetail;
  };
}

export interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: BookingDetail[];
  };
}
