import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useLogin } from "@/lib/hooks/api/auth/login";
 
import Cookies from "js-cookie";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
 

// ---------------------------------------------------------------------------
// Zod Validation Schema
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Helper to get destination by role (defined outside so it has stable reference)
// ---------------------------------------------------------------------------
const getRoleDestination = (role?: string) => {
  if (role === "admin") return "/admin";
  if (role === "rider") return "/rider";
  return "/user_dashboard";
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(getRoleDestination(currentUser.role), { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Check token from cookie if not already authenticated
  const token =
    Cookies.get("accessToken") ;
  // const shouldFetchUser= !isAuthenticated && !!token;
  // const { data: userData } = useGetUser(
  //   shouldFetchUser? token : undefined,
  // );

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const { mutate: loginMutate, isPending, error: mutationError } = useLogin();

  const onFormSubmit = (values: LoginFormValues) => {
    loginMutate(
      {
        emailAddress: values.emailAddress.trim(),
        password: values.password.trim(),
      },
      {
        onSuccess: (data) => {
          // Save token to cookies and storage
          Cookies.set("accessToken", data.data.token, {
            expires: 7,
            path: "/",
          });
          localStorage.setItem("accessToken", data.data.token);

          // Update Zustand store
          login(data.data.user);

          // Direct redirect by role: admin -> /admin, rider -> /rider, user -> /user_dashboard
          navigate(getRoleDestination(data.data.user.role), {
            replace: true,
          });
        },
      },
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-6 bg-white dark:bg-[#151a23] rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-155">
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
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Parcelio
              </span>
            </Link>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1.5">
                Login with Parcelio
              </p>
            </div>

            {/* Error Message */}
            {mutationError && (
              <div
                role="alert"
                className="mb-5 p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
              >
                {mutationError.message}
              </div>
            )}

            {/* Form with React Hook Form + Zod */}
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1">
                <Label
                  htmlFor="loginEmail"
                  className="text-neutral-700 dark:text-neutral-200"
                >
                  Email
                </Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="name@example.com"
                  {...register("emailAddress")}
                  className={cn(
                    "h-10 text-sm dark:bg-[#10141d] dark:border-white/10 dark:text-white focus-visible:border-[#caea4d] focus-visible:ring-[#caea4d]/40",
                    errors.emailAddress &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                  )}
                  disabled={isPending}
                />
                {errors.emailAddress && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.emailAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="loginPassword"
                  className="text-neutral-700 dark:text-neutral-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    className={cn(
                      "h-10 text-sm pr-10 dark:bg-[#10141d] dark:border-white/10 dark:text-white focus-visible:border-[#caea4d] focus-visible:ring-[#caea4d]/40",
                      errors.password &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                    )}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <div className="mt-1.5 text-left">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline-offset-2 hover:underline transition-colors"
                  >
                    Forget Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 mt-2 rounded-lg bg-[#caea4d] hover:bg-[#bde03a] active:scale-[0.99] text-neutral-900 text-sm font-bold transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </form>

            {/* Don't have account */}
            <div className="text-center mt-3.5 text-xs text-neutral-600 dark:text-neutral-400">
              Don't have any account?{" "}
              <Link
                to="/signup"
                className="text-[#7ca320] dark:text-lime-400 font-semibold hover:underline"
              >
                Register
              </Link>
            </div>

            {/* Divider */}
            <div className="text-center my-3 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
              Or
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-lg bg-[#eef2f6] dark:bg-[#10141d] dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:bg-[#e2e8f0] dark:hover:bg-white/5 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 border-transparent cursor-pointer"
            >
              <GoogleIcon />
              <span>Login with google</span>
            </Button>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="bg-[#f8faf2] dark:bg-[#10141d] hidden lg:flex items-center justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-white/10">
          <img
            src="/assets/authImage.png"
            alt="Parcelio Delivery Illustration"
            className="w-full max-w-sm xl:max-w-md object-contain select-none pointer-events-none drop-shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
