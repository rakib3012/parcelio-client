import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useGetUser } from "@/lib/hooks/api/auth/getUser";
import Cookies from "js-cookie";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Cookies ba localStorage theke safely token neya
  const token =
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    "";

  // Token ache kintu store-e user set na thakle, API theke fetch korbe
  const shouldFetchUser = !isAuthenticated && !!token;
  const { data, isLoading, isError } = useGetUser(
    shouldFetchUser ? token : undefined
  );

  // Fetch successful hole user data store-e save kora
  useEffect(() => {
    if (data?.data?.user) {
      login(data.data.user);
    }
  }, [data, login]);

  // Token invalid ba expired hole logout kora
  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  // Kono token na thakle direct login page-e redirect kora
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Already authenticated thakle directly page render kora
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Session verify/rehydrate howar shomoy loading spinner dekhano
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

  // Verification fail ba error hole login page-e pathano
  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
