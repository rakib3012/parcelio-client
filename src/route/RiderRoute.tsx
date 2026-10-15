import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useGetProfile } from "@/lib/hooks/api/auth/getProfile"
import Cookies from "js-cookie"

export const RiderRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUser = useAuthStore((state) => state.currentUser)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const currentLocation = useLocation()

  const token =
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    ""

  const shouldFetchProfile = !isAuthenticated && !!token
  const { data, isLoading, isError } = useGetProfile(shouldFetchProfile ? token : undefined)

  useEffect(() => {
    if (data?.data?.userProfile) {
      login(data.data.userProfile)
    }
  }, [data, login])

  useEffect(() => {
    if (isError) {
      logout()
    }
  }, [isError, logout])

  if (isAuthenticated) {
    // Only rider or admin can access rider dashboard
    if (currentUser?.role !== "rider" && currentUser?.role !== "admin") {
      return <Navigate to="/dashboard" replace />
    }
    return <Outlet />
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFromLocation: currentLocation }}
      />
    )
  }

  if (isLoading || shouldFetchProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
            Verifying Rider Access...
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFromLocation: currentLocation }}
      />
    )
  }

  return <Outlet />
}
