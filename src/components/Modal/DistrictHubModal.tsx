import { Link } from "react-router";
import { X, CheckCircle2, ExternalLink } from "lucide-react";
import type { WarehouseLocation } from "@/pages/CoveragePage";

interface DistrictHubModalProps {
  location: WarehouseLocation | null;
  onClose: () => void;
  timelineText: string;
  bookingLink: string;
}

export function DistrictHubModal({
  location,
  onClose,
  timelineText,
  bookingLink,
}: DistrictHubModalProps) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#151a23] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-white/10 space-y-6 relative max-h-[90vh] overflow-y-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {location.region} Division
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1.5">
              {location.district} District Hub
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Operating City Center: {location.city}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-100 dark:border-white/10">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Delivery SLA
            </span>
            <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
              {timelineText}
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-100 dark:border-white/10">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Hub Status
            </span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active & Dispatching
            </p>
          </div>
        </div>

        {/* List of Covered Upazilas */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Full Upazila / Thana Coverage ({location.covered_area?.length || 0}):
          </h4>
          <div className="flex flex-wrap gap-1.5 p-3.5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-white/10 max-h-48 overflow-y-auto">
            {location.covered_area && location.covered_area.length > 0 ? (
              location.covered_area.map((area, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-medium"
                >
                  {area}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                Covers all municipal, thana, and union addresses in{" "}
                {location.district}.
              </span>
            )}
          </div>
        </div>

        {/* Hub Features */}
        <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Door-to-door residential and commercial delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Cash on Delivery (COD) collection & automated merchant payout
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Daily scheduled reverse logistics for e-commerce returns
            </span>
          </div>
        </div>

        {/* Location coordinates & external map */}
        {location.latitude && location.longitude && (
          <div className="pt-2 border-t border-neutral-100 dark:border-white/10 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>
              GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#03332D] dark:text-[#CAEA3C] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <Link
            to={bookingLink}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-[#CAEA3C] text-neutral-950 font-bold text-center text-xs hover:bg-[#b8d82d] transition-all shadow-xs"
          >
            Book Parcel to {location.district}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
