import { useMutation } from "@tanstack/react-query";
import type { UserProfile } from "@/lib/types/auth";

// ── Request & Response types ────────────────────────────────────
interface RegisterData {
  fullName: string;
  emailAddress: string;
  password: string;
  phone?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userProfile: UserProfile;
    token: string;
  };
}

interface ApiError {
  success: boolean;
  message: string;
  errors: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
const registerUser = async (
  userData: RegisterData
): Promise<RegisterResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Registration failed");
  }

  return result as RegisterResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: registerUser,
  });
};
