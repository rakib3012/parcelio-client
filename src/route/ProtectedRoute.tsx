import { Navigate, Outlet, useLocation } from "react-router"
import { useAuthStore } from "@/lib/store/authStore"

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentLocation = useLocation()

  if (!isAuthenticated) {
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
