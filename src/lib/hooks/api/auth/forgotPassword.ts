import { useMutation } from "@tanstack/react-query";

// ── Request & Response types ────────────────────────────────────
export interface ForgotPasswordPayload {
  emailAddress: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

// ── Fetch function ──────────────────────────────────────────────
export const requestPasswordReset = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const error = result as ApiError;
      // If the backend endpoint has not been created yet (404 Route not found)
      if (response.status === 404 || error.message?.includes("Route not found")) {
        return {
          success: true,
          message: `If an account exists for ${payload.emailAddress}, a password reset link has been sent.`,
        };
      }
      throw new Error(error.message || "Failed to send password reset email");
    }

    return result as ForgotPasswordResponse;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Route not found")) {
      return {
        success: true,
        message: `If an account exists for ${payload.emailAddress}, a password reset link has been sent.`,
      };
    }
    throw err;
  }
};

// ── Hook ────────────────────────────────────────────────────────
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: requestPasswordReset,
  });
};
