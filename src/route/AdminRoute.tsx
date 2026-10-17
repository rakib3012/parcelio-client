import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useGetProfile } from "@/lib/hooks/api/auth/getProfile"
import Cookies from "js-cookie"

export const AdminRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUser = useAuthStore((state) => state.currentUser)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const currentLocation = useLocation()

  const token =
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "") ||
    ""

  // If token exists in cookies/storage but store isn't populated, rehydrate from profile API
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

  // If authenticated directly from store, check role
  if (isAuthenticated) {
    if (currentUser?.role !== "admin") {
      return <Navigate to="/user_dashboard" replace />
    }
    return <Outlet />
  }

  // If no token exists at all, redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectedFromLocation: currentLocation }}
      />
    )
  }

  // If verifying token, show loading state
  if (isLoading || shouldFetchProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
            Verifying Admin Access...
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
