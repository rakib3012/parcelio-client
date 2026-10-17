import { useState } from "react"
import { Outlet, NavLink, useNavigate, Link } from "react-router"
import {
  LayoutDashboard,
  Package,
  Send,
  MapPin,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
  ArrowLeft,
 
} from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import Cookies from "js-cookie"

interface SidebarItem {
  to: string
  end?: boolean
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: string
}

const sidebarLinks: SidebarItem[] = [
  {
    to: "/user_dashboard",
    end: true,
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    to: "/user_dashboard/deliveries",
    end: false,
    icon: Package,
    label: "My Deliveries",
  },
  {
    to: "/user_dashboard/booking",
    end: false,
    icon: Send,
    label: "Book a Parcel",
    badge: "Send",
  },
  {
    to: "/user_dashboard/tracking",
    end: false,
    icon: MapPin,
    label: "Track Shipment",
  },
]

const UserDashboardLayout = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("token")
    logout()
    navigate("/")
  }

  const userInitial = currentUser?.fullName
    ? currentUser.fullName.charAt(0).toUpperCase()
    : "U"

  return (
    <div className="h-screen w-full bg-[#F5F5F7] flex overflow-hidden font-sans text-neutral-900 antialiased selection:bg-[#CAEA3C] selection:text-neutral-900">
      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 bg-[#1C1D20] text-white flex flex-col shrink-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-18" : "w-65"}
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen
        `}
      >
        {/* Sidebar Header / Logo */}
        <div
          className={`flex items-center h-16 px-4 border-b border-white/10 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-white leading-tight">
                  Parcelio
                </span>
                <span className="text-[10px] font-semibold text-[#CAEA3C] uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/" title="Parcelio Home">
              <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                <Package className="w-4 h-4 text-neutral-900" />
              </div>
            </Link>
          )}

          {/* Close button on mobile view */}
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#CAEA3C] text-neutral-900 shadow-md shadow-[#CAEA3C]/20 font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                } ${collapsed ? "justify-center px-2" : ""}`
              }
              title={collapsed ? link.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-neutral-900" : ""
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{link.label}</span>
                      {link.badge && (
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                            isActive
                              ? "bg-neutral-900 text-[#CAEA3C]"
                              : "bg-[#CAEA3C]/20 text-[#CAEA3C]"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Admin shortcut if user is admin */}
          {currentUser?.role === "admin" && (
            <div className="pt-2">
              <div
                className={`text-[10px] font-semibold text-white/40 uppercase tracking-widest px-3 mb-1.5 ${
                  collapsed ? "hidden" : "block"
                }`}
              >
                Management
              </div>
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-amber-400 text-neutral-950 font-semibold"
                      : "text-amber-300/80 hover:text-amber-200 hover:bg-amber-400/10 border border-amber-400/20"
                  } ${collapsed ? "justify-center px-2" : ""}`
                }
                title={collapsed ? "Admin Panel" : undefined}
              >
                <Shield className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Admin Panel</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200">
                      Admin
                    </span>
                  </div>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Sidebar Footer — User Profile & Sign Out */}
        <div className="border-t border-white/10 p-3 space-y-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {currentUser?.fullName || "Active User"}
                </span>
                <span className="text-[11px] text-white/50 truncate">
                  {currentUser?.emailAddress || "user@parcelio.com"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div
                className="w-9 h-9 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs shadow-xs"
                title={currentUser?.fullName || "Active User"}
              >
                {userInitial}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors w-full ${
                collapsed ? "justify-center px-2" : ""
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Collapse Toggle — Desktop only */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Sticky Top Header Bar */}
        <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left section: mobile hamburger & portal badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#CAEA3C]/20 text-[#3d5a00] border border-[#CAEA3C]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a00]"></span>
                Customer Portal
              </span>
            </div>
          </div>

          {/* Right section: Quick actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Back to main website link */}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
            </Link>

            {/* Admin Panel Link (if user is admin) */}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Avatar badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
                {userInitial}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-neutral-900 truncate max-w-30">
                  {currentUser?.fullName || "Active User"}
                </span>
                <span className="text-[10px] text-neutral-500">Sender</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboardLayout
