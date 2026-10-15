import { useState } from "react"
import { Outlet, NavLink, useNavigate, Link } from "react-router"
import {
  LayoutDashboard,
  Package,
  Wallet,
  Bike,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Shield,
  CircleDot,
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

const riderSidebarLinks: SidebarItem[] = [
  {
    to: "/rider",
    end: true,
    icon: LayoutDashboard,
    label: "Rider Overview",
  },
  {
    to: "/rider/deliveries",
    end: false,
    icon: Package,
    label: "Assigned Deliveries",
    badge: "Active",
  },
  {
    to: "/rider/earnings",
    end: false,
    icon: Wallet,
    label: "Earnings & Payouts",
  },
]

const RiderLayout = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isOnDuty, setIsOnDuty] = useState(true)

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("token")
    logout()
    navigate("/")
  }

  const userInitial = currentUser?.fullName
    ? currentUser.fullName.charAt(0).toUpperCase()
    : "R"

  return (
    <div className="h-screen w-full bg-[#F5F5F7] flex overflow-hidden font-sans text-neutral-900 antialiased selection:bg-[#CAEA3C] selection:text-neutral-900">
      {/* Mobile Drawer Backdrop */}
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
          fixed top-0 left-0 h-screen z-40 bg-[#1C1D20] text-white flex flex-col flex-shrink-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[260px]"}
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
              <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Bike className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-white leading-tight">
                  Parcelio
                </span>
                <span className="text-[10px] font-semibold text-[#CAEA3C] uppercase tracking-wider">
                  Rider Portal
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/" title="Parcelio Home">
              <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                <Bike className="w-4 h-4 text-neutral-900" />
              </div>
            </Link>
          )}

          {/* Close button on mobile */}
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duty Status Card */}
        {!collapsed && (
          <div className="mx-3 mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`relative flex h-2.5 w-2.5`}
              >
                {isOnDuty && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CAEA3C] opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isOnDuty ? "bg-[#CAEA3C]" : "bg-neutral-500"
                  }`}
                ></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">
                  {isOnDuty ? "On Duty (Online)" : "Off Duty (Offline)"}
                </span>
                <span className="text-[10px] text-white/50">
                  {isOnDuty ? "Ready for orders" : "Not accepting tasks"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                isOnDuty
                  ? "bg-[#CAEA3C]/20 text-[#CAEA3C] hover:bg-[#CAEA3C]/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {isOnDuty ? "Go Offline" : "Go Online"}
            </button>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {riderSidebarLinks.map((link) => (
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
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
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

          {/* Admin shortcut if rider is also admin */}
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
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 border border-amber-400/20"
                title={collapsed ? "Admin Panel" : undefined}
              >
                <Shield className="w-5 h-5 flex-shrink-0" />
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

        {/* Sidebar Footer — Rider Profile & Sign Out */}
        <div className="border-t border-white/10 p-3 space-y-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {currentUser?.fullName || "Courier Rider"}
                </span>
                <span className="text-[11px] text-[#CAEA3C] truncate font-medium">
                  Verified Rider
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div
                className="w-9 h-9 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs shadow-xs"
                title={currentUser?.fullName || "Courier Rider"}
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
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Desktop Collapse Toggle */}
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
        <header className="h-16 flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left section: mobile hamburger & rider portal badge */}
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
                <Bike className="w-3.5 h-3.5 text-[#3d5a00]" />
                Rider Portal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                <CircleDot
                  className={`w-2.5 h-2.5 ${
                    isOnDuty ? "text-emerald-500" : "text-neutral-400"
                  }`}
                />
                {isOnDuty ? "Active Shift" : "Offline"}
              </span>
            </div>
          </div>

          {/* Right section: Links & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
            </Link>

            {/* User Avatar badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
                {userInitial}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-neutral-900 truncate max-w-[120px]">
                  {currentUser?.fullName || "Courier Rider"}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Rider
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default RiderLayout
