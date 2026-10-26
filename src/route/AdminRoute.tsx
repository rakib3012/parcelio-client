import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useGetUser } from "@/lib/hooks/api/auth/getUser";
import Cookies from "js-cookie";

export const AdminRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
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

  // If authenticated directly from store, check role
  if (isAuthenticated) {
    if (currentUser?.role === "admin") {
      return <Outlet />;
    }
    if (currentUser?.role === "rider") {
      return <Navigate to="/rider" replace />;
    }
    return <Navigate to="/user_dashboard" replace />;
  }

  // If no token exists at all, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If verifying token, show loading state
  if (isLoading || shouldFetchUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Verifying Admin Access...
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
