import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate, Link } from "react-router"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useRegister } from "@/lib/hooks/api/auth/register"

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

const SignupPage = () => {
  const [fullName, setFullName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const {
    mutate: registerMutate,
    isPending,
    error: mutationError,
  } = useRegister()

  const handleAvatarSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!fullName.trim() || !emailAddress.trim() || !userPassword.trim()) {
      return
    }

    const registerData = {
      fullName: fullName.trim(),
      emailAddress: emailAddress.trim(),
      password: userPassword.trim(),
    }

    registerMutate(registerData, {
      onSuccess: (data) => {
        // Save token to localStorage
        localStorage.setItem("accessToken", data.data.token)

        // Update Zustand auth store
        login(data.data.userProfile)

        // Navigate to dashboard
        navigate("/dashboard", { replace: true })
      },
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[660px]">
        {/* Left Side: Form Content */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
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
            <div className="mb-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Create an Account
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1.5">
                Register with Parcelio
              </p>
            </div>

            {/* Avatar Upload Icon as shown in screenshot */}
            <div className="mb-4">
              <label
                htmlFor="avatarUploadInput"
                className="inline-block cursor-pointer group"
                title="Upload Profile Picture"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200/80 flex items-center justify-center transition-all group-hover:opacity-85 shadow-xs">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/assets/image-upload-icon.png"
                      alt="Upload Profile Picture"
                      className="w-full h-full object-cover p-0.5"
                    />
                  )}
                </div>
                <input
                  id="avatarUploadInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelection}
                  className="hidden"
                  disabled={isPending}
                />
              </label>
            </div>

            {/* Error Message */}
            {mutationError && (
              <div
                role="alert"
                className="mb-4 p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700"
              >
                {mutationError.message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmission} className="space-y-3.5">
              <div>
                <label
                  htmlFor="registerName"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="registerName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#caea4d] focus:border-transparent transition-all"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="registerEmail"
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
                  htmlFor="registerPassword"
                  className="block text-xs font-semibold text-neutral-800 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#caea4d] focus:border-transparent transition-all"
                  required
                  minLength={6}
                  disabled={isPending}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 px-4 rounded-lg bg-[#caea4d] hover:bg-[#bde03a] active:scale-[0.99] text-neutral-900 text-sm font-bold transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>
            </form>

            {/* Already have account */}
            <div className="text-center mt-3.5 text-xs text-neutral-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#7ca320] font-semibold hover:underline"
              >
                Login
              </Link>
            </div>

            {/* Divider */}
            <div className="text-center my-3 text-xs text-neutral-400 font-medium">
              Or
            </div>

            {/* Google Register Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-lg bg-[#eef2f6] hover:bg-[#e2e8f0] text-neutral-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 border border-transparent cursor-pointer"
            >
              <GoogleIcon />
              <span>Register with google</span>
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

export default SignupPage