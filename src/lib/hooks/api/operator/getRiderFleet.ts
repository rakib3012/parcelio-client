import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export interface RiderFleetUser {
  _id: string;
  identifier: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  role: "rider";
  createdAt: string;
  updatedAt?: string;
}

export interface GetRiderFleetParams {
  page?: number;
  limit?: number;
  search?: string;
  token?: string;
}

export interface GetRiderFleetResponse {
  success: boolean;
  message: string;
  data: {
    riders: RiderFleetUser[];
    users: RiderFleetUser[];
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

export const getRiderFleet = async (
  params?: GetRiderFleetParams
): Promise<GetRiderFleetResponse> => {
  const token =
    params?.token ||
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    "";

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const queryParameters = searchParams.toString();
  const url = `${import.meta.env.VITE_API_BASE_URL}/rider/fleet${
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
    const detail = error.errors?.[0]?.message;
    throw new Error(detail || error.message || "Failed to fetch rider fleet");
  }

  return result as GetRiderFleetResponse;
};

export const useRiderFleet = (params?: GetRiderFleetParams) => {
  return useQuery({
    queryKey: [
      "operator-rider-fleet",
      params?.page,
      params?.limit,
      params?.search,
      params?.token,
    ],
    queryFn: () => getRiderFleet(params),
  });
};

