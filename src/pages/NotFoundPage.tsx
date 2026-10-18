import { Link } from "react-router"
import { ArrowLeft, AlertCircle } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="bg-white dark:bg-[#151a23] rounded-3xl p-12 border border-neutral-200/80 dark:border-white/10 shadow-xs max-w-lg mx-auto my-12 text-center space-y-4 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        The requested address does not exist or has been moved.
      </p>

      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1C1D20] dark:bg-lime-400 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-lime-500 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
