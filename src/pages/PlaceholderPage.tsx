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
    <div className="bg-white dark:bg-[#151a23] rounded-3xl p-8 sm:p-12 border border-neutral-200/80 dark:border-white/10 shadow-xs max-w-3xl mx-auto my-6 text-center space-y-4 transition-colors">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
        <span className="w-2 h-2 rounded-full bg-[#CAEA3C]"></span>
        Public Route
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
        {pageTitle}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
        {pageDescription}
      </p>

      <div className="pt-4">
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

export default PlaceholderPage
