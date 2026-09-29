import { useMutation } from "@tanstack/react-query";

// ── Request & Response types ────────────────────────────────────
interface RiderApplicationData {
  applicantName: string;
  drivingLicenseNumber: string;
  emailAddress: string;
  region: string;
  district: string;
  nidNumber: string;
  phoneNumber: string;
  bikeBrandModelYear: string;
  bikeRegistrationNumber: string;
  aboutYourself?: string;
}

interface RiderApplicationResponse {
  success: boolean;
  message: string;
  data: {
    riderApplication: RiderApplicationData & {
      identifier: string;
      applicationStatus: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
const submitRiderApplication = async (
  applicationData: RiderApplicationData
): Promise<RiderApplicationResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rider/apply`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Failed to submit rider application");
  }

  return result as RiderApplicationResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useRiderApplication = () => {
  return useMutation<RiderApplicationResponse, Error, RiderApplicationData>({
    mutationFn: submitRiderApplication,
  });
};
