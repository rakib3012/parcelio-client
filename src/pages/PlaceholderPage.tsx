import { Link } from "react-router"
import { ArrowLeft } from "lucide-react"

interface PlaceholderPageProps {
  pageTitle: string
  pageDescription: string
}

export const PlaceholderPage = ({
  pageTitle,
  pageDescription,
}: PlaceholderPageProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-xs max-w-3xl mx-auto my-6 text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-800 border border-neutral-200">
        <span className="w-2 h-2 rounded-full bg-[#CAEA3C]"></span>
        Public Route
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
        {pageTitle}
      </h1>
      <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
        {pageDescription}
      </p>

      <div className="pt-4">
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

export default PlaceholderPage
