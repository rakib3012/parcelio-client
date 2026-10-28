import { useState } from "react";
import {
  X,
  Truck,
  Package,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRiderFleet } from "@/lib/hooks/api/operator/getRiderFleet";
import { useBulkAssignBookings } from "@/lib/hooks/api/operator/bulkAssignBookings";

interface BulkAssignModalProps {
  selectedBookingIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkAssignModal({
  selectedBookingIds,
  onClose,
  onSuccess,
}: BulkAssignModalProps) {
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [dispatchNote, setDispatchNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = Cookies.get("accessToken") || "";

  // Fetch available riders for assignment via operator-accessible fleet endpoint
  const { data: ridersData, isLoading: isLoadingRiders } = useRiderFleet({
    limit: 50,
    token,
  });

  const riders = ridersData?.data?.riders ?? ridersData?.data?.users ?? [];

  const bulkAssignMutation = useBulkAssignBookings();

  const handleAssignSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedRiderId) {
      setErrorMessage("Please select a rider from the fleet list.");
      return;
    }

    if (selectedBookingIds.length === 0) {
      setErrorMessage("No pending parcels selected for assignment.");
      return;
    }

    bulkAssignMutation.mutate(
      {
        bookingIds: selectedBookingIds,
        riderId: selectedRiderId,
        note: dispatchNote.trim() || undefined,
        token,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#151a23] border border-neutral-100 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CAEA3C]/20 text-neutral-900 dark:text-[#CAEA3C] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Bulk Assign to Rider
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Assigning {selectedBookingIds.length} pending parcel(s)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAssignSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parcel Selection Summary */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#10141d] border border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                Selected Parcels for Batch
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#CAEA3C] text-neutral-900">
              {selectedBookingIds.length} Parcels
            </span>
          </div>

          {/* Rider Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Select Fleet Rider *
            </label>

            {isLoadingRiders ? (
              <div className="flex items-center gap-2 p-3 text-sm text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading active riders...</span>
              </div>
            ) : riders.length === 0 ? (
              <p className="text-xs text-amber-600 dark:text-amber-400 p-2">
                No registered riders found. Please add riders first.
              </p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {riders.map((rider) => {
                  const isSelected = selectedRiderId === rider._id;
                  return (
                    <div
                      key={rider._id}
                      onClick={() => setSelectedRiderId(rider._id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#CAEA3C]/10 border-[#CAEA3C] dark:bg-[#CAEA3C]/15"
                          : "bg-white dark:bg-[#10141d] border-neutral-200 dark:border-white/10 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {rider.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {rider.fullName}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {rider.phone || rider.emailAddress}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-[#CAEA3C]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Optional Dispatch Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              Dispatch Note (Optional)
            </label>
            <input
              type="text"
              value={dispatchNote}
              onChange={(e) => setDispatchNote(e.target.value)}
              placeholder="e.g. Assigned for Morning Mirpur Hub delivery batch"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 focus:border-[#CAEA3C] transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bulkAssignMutation.isPending || !selectedRiderId}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#CAEA3C] hover:bg-[#bde028] text-neutral-900 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            >
              {bulkAssignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <span>Confirm & Dispatch</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

