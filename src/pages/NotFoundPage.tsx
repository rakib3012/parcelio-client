import { Link } from "react-router"
import { ArrowLeft, AlertCircle } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 shadow-xs max-w-lg mx-auto my-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-sm text-neutral-600">
        The requested address does not exist or has been moved.
      </p>

      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1C1D20] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
