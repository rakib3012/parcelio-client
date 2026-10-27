import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { ArrowUpRight, Menu, X, LayoutDashboard, LogOut, Shield, Bike } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import Cookies from "js-cookie"
import { ModeToggle } from "@/components/mode-toggle"

interface NavigationItem {
  label: string
  destinationPath: string
}

const navigationItems: NavigationItem[] = [
  { label: "Services", destinationPath: "/services" },
  { label: "Coverage", destinationPath: "/coverage" },
  { label: "About Us", destinationPath: "/about" },
  // { label: "Booking", destinationPath: "/booking" },
  { label: "Tracking", destinationPath: "/tracking" },
  { label: "Be a Rider", destinationPath: "/be-a-rider" },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((previousState) => !previousState)
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleUserLogout = () => {
    Cookies.remove("accessToken", { path: "/" })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("token")
    logout()
    setIsMobileMenuOpen(false)
    navigate("/")
  }

  return (
    <header className="w-full bg-white/95 dark:bg-[#151a23]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/10 sticky top-0 z-50 shadow-xs transition-colors">
      <nav
        aria-label="Main Navigation"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all"
      >
        {/* Brand Logo & Name */}
        <Link
          to="/"
          onClick={handleCloseMobileMenu}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-200 rounded-lg"
        >
          <img
            src={"/assets/logo.png"}
            alt="Parcelio Logo"
            className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
           Parcelio
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-9 list-none m-0 p-0">
          {navigationItems.map((navigationItem) => (
            <li key={navigationItem.destinationPath}>
              <NavLink
                to={navigationItem.destinationPath}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-neutral-950 dark:text-white font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                  }`
                }
              >
                {navigationItem.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Right Action Area */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {currentUser?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-full transition-colors shadow-xs"
                >
                  <Shield className="w-4 h-4 text-[#caea4d]" />
                  <span>Admin</span>
                </Link>
              ) : currentUser?.role === "rider" ? (
                <Link
                  to="/rider"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-neutral-900 bg-[#CAEA3C] hover:bg-[#b8d82d] rounded-full transition-colors shadow-xs"
                >
                  <Bike className="w-4 h-4 text-neutral-900" />
                  <span>Rider Hub</span>
                </Link>
              ) : (
                <Link
                  to="/user_dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              <button
                type="button"
                onClick={handleUserLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                title={`Signed in as ${currentUser?.fullName || "User"}`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-xs"
              >
                Sign In
              </Link>

              <Link
                to="/be-a-rider"
                className="group flex items-center gap-1.5 focus-visible:outline-none"
              >
                <span className="px-5 py-2 text-sm font-bold text-neutral-950 bg-[#CAEA3C] rounded-full hover:bg-[#bddf2e] transition-colors shadow-xs">
                  Be a rider
                </span>
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full bg-[#1C1D20] text-white flex items-center justify-center group-hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Action & Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <button
            type="button"
            onClick={handleToggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151a23] px-4 sm:px-6 py-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 transition-colors">
          <ul className="flex flex-col gap-3 list-none m-0 p-0 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            {navigationItems.map((navigationItem) => (
              <li key={navigationItem.destinationPath}>
                <NavLink
                  to={navigationItem.destinationPath}
                  onClick={handleCloseMobileMenu}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-950 dark:hover:text-white"
                    }`
                  }
                >
                  {navigationItem.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                {currentUser?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={handleCloseMobileMenu}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#caea4d]" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                {currentUser?.role === "rider" ? (
                  <Link
                    to="/rider"
                    onClick={handleCloseMobileMenu}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-neutral-950 bg-[#CAEA3C] hover:bg-[#b8d82d] rounded-full transition-colors"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Rider Hub ({currentUser?.fullName})</span>
                  </Link>
                ) : (
                  <Link
                    to="/user_dashboard"
                    onClick={handleCloseMobileMenu}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard ({currentUser?.fullName})</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleUserLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleCloseMobileMenu}
                  className="w-full text-center py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/be-a-rider"
                  onClick={handleCloseMobileMenu}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-neutral-950 bg-[#CAEA3C] rounded-full hover:bg-[#bddf2e] transition-colors"
                >
                  <span>Be a rider</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar