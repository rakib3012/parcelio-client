import { Outlet, NavLink, useNavigate, Link } from "react-router"
import { LogOut, ArrowLeft } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"

const DashboardLayout = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans text-neutral-900 antialiased">
      {/* Dashboard Top Header */}
      <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/logo.png"
                alt="Parcelio Logo"
                className="h-6 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-neutral-900">
               Parcelio
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
                Portal
              </span>
            </Link>

            <nav
              aria-label="Dashboard navigation"
              className="hidden sm:flex items-center gap-4"
            >
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                    isActive
                      ? "bg-neutral-100 text-neutral-950 font-semibold"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`
                }
              >
                Overview
              </NavLink>
              <NavLink
                to="/dashboard/deliveries"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                    isActive
                      ? "bg-neutral-100 text-neutral-950 font-semibold"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`
                }
              >
                My Deliveries
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-[#CAEA3C] text-neutral-950 flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName
                  ? currentUser.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-neutral-900">
                  {currentUser?.fullName || "Active User"}
                </span>
                <span className="text-xs text-neutral-500">
                  {currentUser?.emailAddress || "user@example.com"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
