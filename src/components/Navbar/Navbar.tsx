import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { ArrowUpRight, Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"

interface NavigationItem {
  label: string
  destinationPath: string
}

const navigationItems: NavigationItem[] = [
  { label: "Services", destinationPath: "/services" },
  { label: "Coverage", destinationPath: "/coverage" },
  { label: "About Us", destinationPath: "/about" },
  { label: "Pricing", destinationPath: "/pricing" },
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
    logout()
    setIsMobileMenuOpen(false)
    navigate("/")
  }

  return (
    <header className="w-full bg-neutral-100 pt-4 px-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Main Navigation"
        className="max-w-7xl mx-auto bg-white rounded-2xl md:rounded-full px-5 md:px-7 py-3 shadow-xs border border-neutral-200/70 flex items-center justify-between transition-all"
      >
        {/* Brand Logo & Name */}
        <Link
          to="/"
          onClick={handleCloseMobileMenu}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 rounded-lg"
        >
          <img
            src={"/assets/logo.png"}
            alt="Parcelio Logo"
            className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-neutral-900">
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
                      ? "text-neutral-950 font-semibold"
                      : "text-neutral-600 hover:text-neutral-950"
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
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 hover:border-neutral-400 transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-neutral-700" />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={handleUserLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
                className="px-5 py-2 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 hover:border-neutral-400 transition-colors shadow-xs"
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={handleToggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 bg-white rounded-2xl p-5 shadow-md border border-neutral-200/80 animate-in fade-in slide-in-from-top-2 duration-150">
          <ul className="flex flex-col gap-3 list-none m-0 p-0 pb-4 border-b border-neutral-100">
            {navigationItems.map((navigationItem) => (
              <li key={navigationItem.destinationPath}>
                <NavLink
                  to={navigationItem.destinationPath}
                  onClick={handleCloseMobileMenu}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-950 font-semibold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
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
                <Link
                  to="/dashboard"
                  onClick={handleCloseMobileMenu}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard ({currentUser?.fullName})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleUserLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
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
                  className="w-full text-center py-2.5 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
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