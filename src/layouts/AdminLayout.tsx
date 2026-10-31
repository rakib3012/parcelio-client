import { useState } from "react"
import { Outlet, NavLink, useNavigate, Link } from "react-router"
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
  ArrowLeft,
  // Headset,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import Cookies from "js-cookie"
import { ModeToggle } from "@/components/mode-toggle"

const sidebarLinks = [
  {
    to: "/admin",
    end: true,
    icon: LayoutDashboard,
    label: "Overview",
  },
  // {
  //   to: "/admin/operators",
  //   end: false,
  //   icon: Headset,
  //   label: "Operators",
  // },
  {
    to: "/admin/users",
    end: false,
    icon: Users,
    label: "User Management",
  },
  {
    to: "/admin/bookings",
    end: false,
    icon: Package,
    label: "Bookings",
  },
]

const AdminLayout = () => {
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

  return (
    <div className="h-screen w-full bg-neutral-50 dark:bg-[#0f1419] flex overflow-hidden font-sans text-neutral-900 dark:text-white antialiased transition-colors">
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 bg-white dark:bg-[#151a23] text-neutral-800 dark:text-white flex flex-col shrink-0
          transition-all duration-300 ease-in-out border-r border-neutral-200 dark:border-white/5
          ${collapsed ? "w-18" : "w-65"}
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center h-16 px-4 border-b border-neutral-200 dark:border-white/5 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                  Parcelio
                </span>
                <span className="text-[10px] font-semibold text-neutral-400 dark:text-white/40 uppercase tracking-widest">
                  Admin Panel
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#CAEA3C] flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-neutral-900" />
            </div>
          )}

          {/* Close on mobile */}
          <button
            type="button"
            className="lg:hidden p-1 text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-[#CAEA3C] text-neutral-900 shadow-md shadow-[#CAEA3C]/20 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                } ${collapsed ? "justify-center px-2" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-neutral-900" : ""
                    }`}
                  />
                  {!collapsed && <span>{link.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer — User Info + Collapse */}
        <div className="border-t border-neutral-200 dark:border-white/5 p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-full bg-[#CAEA3C] text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                {currentUser?.fullName
                  ? currentUser.fullName.charAt(0).toUpperCase()
                  : "A"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {currentUser?.fullName || "Admin"}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-white/40 truncate">
                  {currentUser?.emailAddress || "admin@parcelio.com"}
                </span>
              </div>
            </div>
          )}

          <div className={`flex ${collapsed ? "flex-col items-center" : ""} gap-1`}>
            <button
              type="button"
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300 transition-colors w-full cursor-pointer ${
                collapsed ? "justify-center" : ""
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-white/30 dark:hover:text-white/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex-shrink-0 bg-white/95 dark:bg-[#151a23]/95 backdrop-blur-md border-b border-neutral-200 dark:border-white/5 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-lime-100 text-lime-800 border border-lime-300/80 dark:bg-[#CAEA3C]/20 dark:text-[#CAEA3C] dark:border-[#CAEA3C]/20">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 dark:text-white/50 dark:hover:text-white dark:border-white/10 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
            </Link>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-neutral-50 dark:bg-[#0f1419] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
