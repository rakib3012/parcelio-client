import { useState, useEffect, type FormEvent } from "react"
import { useNavigate, useLocation, Link } from "react-router"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useLogin } from "@/lib/hooks/api/auth/login"
import Cookies from "js-cookie"

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
)

const LoginPage = () => {
  const [emailAddress, setEmailAddress] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUser = useAuthStore((state) => state.currentUser)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  interface LocationStateWithRedirect {
    redirectedFromLocation?: {
      pathname: string
    }
  }

  const locationState = location.state as LocationStateWithRedirect | null
  const defaultDestination =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "rider"
      ? "/rider"
      : "/dashboard"
  const targetDestination =
    locationState?.redirectedFromLocation?.pathname || defaultDestination

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(targetDestination, { replace: true })
    }
  }, [isAuthenticated, currentUser, navigate, targetDestination])

  const {
    mutate: loginMutate,
    isPending,
    error: mutationError,
  } = useLogin()

  const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!emailAddress.trim() || !userPassword.trim()) {
      return
    }

    loginMutate(
      {
        emailAddress: emailAddress.trim(),
        password: userPassword.trim(),
      },
      {
        onSuccess: (data) => {
          // Save token to cookie using js-cookie
          Cookies.set("accessToken", data.data.token, { expires: 7, path: "/", sameSite: "lax" })
          localStorage.setItem("accessToken", data.data.token)

          // Update Zustand auth store
          login(data.data.userProfile)

          // Navigate to role-specific destination or original target
          const userRole = data.data.userProfile.role
          const roleDestination =
            userRole === "admin"
              ? "/admin"
              : userRole === "rider"
              ? "/rider"
              : "/dashboard"
          const destination =
            locationState?.redirectedFromLocation?.pathname || roleDestination
          navigate(destination, { replace: true })
        },
      }
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">
        {/* Left Side: Form Content */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <img
                src="/assets/logo.png"
                alt="Parcelio Logo"
                className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                Parcelio
              </span>
            </Link>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1.5">
                Login with Parcelio
              </p>
            </div>

            {/* Error Message */}
            {mutationError && (
              <div
                role="alert"
                className="mb-5 p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700"
              >
                {mutationError.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmission} className="space-y-4">
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#caea4d] focus:border-transparent transition-all"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="loginPassword"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#caea4d] focus:border-transparent transition-all"
                  required
                  disabled={isPending}
                />
                <div className="mt-1.5 text-left">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline-offset-2 hover:underline transition-colors"
                  >
                    Forget Password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 px-4 rounded-lg bg-[#caea4d] hover:bg-[#bde03a] active:scale-[0.99] text-neutral-900 text-sm font-bold transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Don't have account */}
            <div className="text-center mt-3.5 text-xs text-neutral-600">
              Don't have any account?{" "}
              <Link
                to="/signup"
                className="text-[#7ca320] font-semibold hover:underline"
              >
                Register
              </Link>
            </div>

            {/* Divider */}
            <div className="text-center my-3 text-xs text-neutral-400 font-medium">
              Or
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-lg bg-[#eef2f6] hover:bg-[#e2e8f0] text-neutral-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 border border-transparent cursor-pointer"
            >
              <GoogleIcon />
              <span>Login with google</span>
            </button>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="bg-[#f8faf2] hidden lg:flex items-center justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-neutral-100">
          <img
            src="/assets/authImage.png"
            alt="Parcelio Delivery Illustration"
            className="w-full max-w-sm xl:max-w-md object-contain select-none pointer-events-none drop-shadow-xs"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
