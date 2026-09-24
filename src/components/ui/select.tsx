import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3.5 pr-10 py-2 text-sm text-neutral-900 transition-colors focus-visible:outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
