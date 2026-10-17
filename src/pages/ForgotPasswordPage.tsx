import { useState } from "react"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForgotPassword } from "@/lib/hooks/api/auth/forgotPassword"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Zod Validation Schema
// ---------------------------------------------------------------------------
const forgotPasswordSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please provide a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: "",
    },
  })

  const {
    mutate: forgotPasswordMutate,
    isPending,
    error: mutationError,
  } = useForgotPassword()

  const onFormSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutate(
      { emailAddress: values.emailAddress },
      {
        onSuccess: () => {
          setSubmittedEmail(values.emailAddress)
        },
      }
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">
        {/* Left Side: Content */}
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

            {submittedEmail ? (
              /* Success State */
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#caea4d]/20 text-neutral-900 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#7ca320]" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Check your email
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                    We have sent password reset instructions to{" "}
                    <span className="font-semibold text-neutral-900">{submittedEmail}</span>.
                    Please check your inbox and follow the link to reset your password.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    type="button"
                    onClick={() => setSubmittedEmail(null)}
                    variant="outline"
                    className="w-full h-10 rounded-lg text-xs sm:text-sm font-semibold border-neutral-200 hover:bg-neutral-50 cursor-pointer"
                  >
                    Didn't receive email? Try another address
                  </Button>

                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#caea4d] hover:bg-[#bde03a] text-neutral-900 text-sm font-bold transition-all shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Login</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1.5 leading-relaxed">
                    No worries! Enter your registered email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {/* API Error Alert */}
                {mutationError && (
                  <div
                    role="alert"
                    className="mb-5 p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700"
                  >
                    {mutationError.message}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-1">
                    <Label htmlFor="forgotEmail">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="forgotEmail"
                        type="email"
                        placeholder="name@example.com"
                        {...register("emailAddress")}
                        className={cn(
                          "h-10 text-sm pl-10 focus-visible:border-[#caea4d] focus-visible:ring-[#caea4d]/40",
                          errors.emailAddress && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                        )}
                        disabled={isPending}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                    {errors.emailAddress && (
                      <p className="text-xs text-red-600 mt-1">{errors.emailAddress.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-10 mt-2 rounded-lg bg-[#caea4d] hover:bg-[#bde03a] active:scale-[0.99] text-neutral-900 text-sm font-bold transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="text-xs text-neutral-400 text-center mt-6">
            Need help? Contact our support team anytime.
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

export default ForgotPasswordPage
