import { useState, type FormEvent } from "react"
import { useNavigate, useLocation, Link } from "react-router"
import { LogIn, ArrowLeft } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"

const LoginPage = () => {
  const [emailAddress, setEmailAddress] = useState("alexander@zapshift.com")
  const [userPassword, setUserPassword] = useState("password123")
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  interface LocationStateWithRedirect {
    redirectedFromLocation?: {
      pathname: string
    }
  }

  const locationState = location.state as LocationStateWithRedirect | null
  const targetDestination =
    locationState?.redirectedFromLocation?.pathname || "/dashboard"

  const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionError(null)

    if (!emailAddress.trim() || !userPassword.trim()) {
      setSubmissionError("Please provide both email address and password.")
      return
    }

    login({
      identifier: "user-101",
      fullName: "Alexander Vance",
      emailAddress: emailAddress.trim(),
      role: "user",
    })

    navigate(targetDestination, { replace: true })
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <img
              src="/assets/logo.png"
              alt="ZapShift"
              className="h-8 w-auto object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-neutral-900">
              ZapShift
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
          <p className="text-sm text-neutral-600">
            Sign in to access your parcel deliveries and dashboard.
          </p>
        </div>

        {submissionError && (
          <div
            role="alert"
            className="p-3 text-sm rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            {submissionError}
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="space-y-4">
          <div>
            <label
              htmlFor="emailAddressInput"
              className="block text-xs font-semibold text-neutral-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="emailAddressInput"
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="passwordInput"
              className="block text-xs font-semibold text-neutral-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              value={userPassword}
              onChange={(event) => setUserPassword(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#1C1D20] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        <div className="pt-2 text-center border-t border-neutral-100">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
