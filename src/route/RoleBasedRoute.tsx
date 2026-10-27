import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useGetUser } from "@/lib/hooks/api/auth/getUser";
import type { User } from "@/lib/types/auth";
import Cookies from "js-cookie";
import { getRoleDestination } from "@/lib/utils/roleCheckFunction";



interface RoleBasedRouteProps {
  allowedRoles: Array<User["role"]>; // Je je role access korte parbe
  redirectTo?: string;               // Access na thakle kothay pathano hobe (optional)
  loadingMessage?: string;           // Loading-er text
}

export const RoleBasedRoute = ({
  allowedRoles,
  redirectTo,
  loadingMessage = "Verifying Access...",
}: RoleBasedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Cookies ba localStorage theke safely accessToken collect kora
  const token =
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    "";

  // Token ache kintu store-e user load kora nai, tahole API theke user ante hobe
  const shouldFetchUser = !isAuthenticated && !!token;
  const { data, isLoading, isError } = useGetUser(
    shouldFetchUser ? token : undefined
  );

  // API theke user data ashle store-e login update kora
  useEffect(() => {
    if (data?.data?.user) {
      login(data.data.user);
    }
  }, [data, login]);

  // Token expired ba invalid hole logout kore deya
  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  // Step 1: Kono token-e jodi na thake, tahole direct /login page-e pathiye dao
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Step 2: User jodi authenticated hoy ebong user data thake, tokhon role check koro
  if (isAuthenticated && currentUser) {
    // Current user-er role ki allowedRoles array-te ache?
    if (allowedRoles.includes(currentUser.role)) {
      return <Outlet />; // Access thakle vitore dhukte dao
    }

    // Role match na korle tar nijer role-er dashboard-e redirect koro
    const targetPath = redirectTo || getRoleDestination(currentUser.role);
    return <Navigate to={targetPath} replace />;
  }

  // Step 3: Session verify ba data rehydrate howar shomoy loading spinner dekhano
  if (isLoading || shouldFetchUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  // Step 4: Token invalid ba server error hole login page-e pathiye dao
  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
