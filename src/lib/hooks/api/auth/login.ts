import { useMutation } from "@tanstack/react-query";
import type { UserProfile } from "@/lib/types/auth";

// ── Request & Response types ────────────────────────────────────
interface LoginCredentials {
  emailAddress: string;
  password: string;
}

interface LoginResponse {
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
const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiError;
    throw new Error(error.message || "Login failed");
  }

  return result as LoginResponse;
};

// ── Hook ────────────────────────────────────────────────────────
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};
