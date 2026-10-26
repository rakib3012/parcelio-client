import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useGetUser} from "@/lib/hooks/api/auth/getUser";
import Cookies from "js-cookie";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const token =
    Cookies.get("accessToken") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : "") ||
    "";

  // If token exists in cookies/storage but store isn't populated, rehydrate from user API
  const shouldFetchUser = !isAuthenticated && !!token;
  const { data, isLoading, isError } = useGetUser(
    shouldFetchUser ? token : undefined,
  );

  useEffect(() => {
    if (data?.data?.user) {
      login(data.data.user);
    }
  }, [data, login]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  // If authenticated directly from store, render immediately
  if (isAuthenticated) {
    return <Outlet />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If verifying token, show loading state
  if (isLoading || shouldFetchUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
