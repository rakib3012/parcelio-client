import { useState, useMemo } from "react";
import {
  Truck,
  Package,
  Search,
  CheckSquare,
  Square,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  MapPin,
} from "lucide-react";
import Cookies from "js-cookie";
import { Link } from "react-router";
import {
  useAdminBookings,
  type AdminBooking,
} from "@/lib/hooks/api/admin/getAllBookings";
import { useRiderFleet } from "@/lib/hooks/api/operator/getRiderFleet";
import { useBulkAssignBookings } from "@/lib/hooks/api/operator/bulkAssignBookings";

const OperatorBulkAssignPage = () => {
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [dispatchNote, setDispatchNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = Cookies.get("accessToken") || "";

  // Fetch pending parcels that require rider assignment
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    refetch: refetchBookings,
  } = useAdminBookings({
    status: "pending",
    limit: 100,
    token,
  });

  // Fetch registered riders in fleet using authorized operator fleet endpoint
  const { data: ridersData, isLoading: isLoadingRiders } = useRiderFleet({
    limit: 50,
    token,
  });

  const bulkAssignMutation = useBulkAssignBookings();

  const allPendingParcels = useMemo(() => {
    return bookingsData?.data?.bookings ?? [];
  }, [bookingsData]);

  const riders = useMemo(() => {
    return ridersData?.data?.users ?? [];
  }, [ridersData]);

  // Unique list of receiver districts for filtering
  const districtOptions = useMemo(() => {
    const districts = new Set<string>();
    allPendingParcels.forEach((parcel) => {
      if (parcel.receiverDistrict) {
        districts.add(parcel.receiverDistrict);
      }
    });
    return Array.from(districts).sort();
  }, [allPendingParcels]);

  // Filtered parcels based on search and district
  const filteredParcels = useMemo(() => {
    return allPendingParcels.filter((parcel) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        parcel.trackingId?.toLowerCase().includes(query) ||
        parcel.senderName?.toLowerCase().includes(query) ||
        parcel.receiverName?.toLowerCase().includes(query) ||
        parcel.receiverAddress?.toLowerCase().includes(query) ||
        parcel.parcelName?.toLowerCase().includes(query);

      const matchesDistrict =
        !selectedDistrict || parcel.receiverDistrict === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });
  }, [allPendingParcels, searchQuery, selectedDistrict]);

  const isAllFilteredSelected =
    filteredParcels.length > 0 &&
    filteredParcels.every((p) =>
      selectedBookingIds.includes(p._id || p.identifier)
    );

  const handleToggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(
        filteredParcels.map((p) => p._id || p.identifier)
      );
      setSelectedBookingIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredParcels.map((p) => p._id || p.identifier);
      setSelectedBookingIds((prev) =>
        Array.from(new Set([...prev, ...filteredIds]))
      );
    }
  };

  const handleToggleParcel = (id: string) => {
    setSelectedBookingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected parcels objects for metrics calculation
  const selectedParcels = useMemo(() => {
    const idSet = new Set(selectedBookingIds);
    return allPendingParcels.filter((p) => idSet.has(p._id || p.identifier));
  }, [allPendingParcels, selectedBookingIds]);

  const totalCodAmount = useMemo(() => {
    return selectedParcels.reduce(
      (sum, p) => sum + (Number(p.deliveryCharge) || 0),
      0
    );
  }, [selectedParcels]);

  const totalParcelWeight = useMemo(() => {
    return selectedParcels.reduce(
      (sum, p) => sum + (Number(p.parcelWeight) || 0),
      0
    );
  }, [selectedParcels]);

  const handleBulkAssignSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (selectedBookingIds.length === 0) {
      setFormError("Please select at least one pending parcel to assign.");
      return;
    }

    if (!selectedRiderId) {
      setFormError("Please choose a rider from the available fleet.");
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
        onSuccess: (response) => {
          const count = response.data?.assignedCount || selectedBookingIds.length;
          setSuccessMessage(
            `Successfully assigned ${count} parcel(s) to rider for dispatch!`
          );
          setSelectedBookingIds([]);
          setDispatchNote("");
          refetchBookings();
        },
        onError: (error) => {
          setFormError(
            error.message || "Failed to bulk assign parcels. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#CAEA3C]/20 text-[#7ca320] dark:text-[#CAEA3C] border border-[#CAEA3C]/30 uppercase tracking-wider">
              Dispatch Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
            Bulk Parcel Assignment
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Select multiple pending parcels and assign them directly to an active rider.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => refetchBookings()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#151a23] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
          <Link
            to="/operator/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white/10 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            All Bookings
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {successMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Parcels Queue & Filters (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking, receiver, route..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 dark:bg-[#10141d] border border-neutral-200 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 transition-all"
              />
            </div>

            {/* District Filter Dropdown */}
            {districtOptions.length > 0 && (
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs bg-neutral-50 dark:bg-[#10141d] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 cursor-pointer"
              >
                <option value="">All Destinations ({districtOptions.length})</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            )}

            {/* Select All Button */}
            {filteredParcels.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAllFiltered}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#10141d] hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              >
                {isAllFilteredSelected ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-[#7ca320] dark:text-[#CAEA3C]" />
                    <span>Select All ({filteredParcels.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Parcels Table / Card List */}
          <div className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 shadow-xs overflow-hidden">
            {isLoadingBookings ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-7 h-7 text-[#7ca320] dark:text-[#CAEA3C] animate-spin" />
                <p className="text-xs text-neutral-400">Loading pending dispatch queue...</p>
              </div>
            ) : isErrorBookings ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Failed to load pending parcels
                </p>
                <button
                  type="button"
                  onClick={() => refetchBookings()}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-white/10 rounded-lg hover:bg-neutral-200"
                >
                  Retry
                </button>
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  {searchQuery || selectedDistrict
                    ? "No pending parcels match your filter criteria."
                    : "No pending parcels in queue! All bookings have been assigned."}
                </p>
                <div className="flex gap-2 mt-2">
                  {(searchQuery || selectedDistrict) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDistrict("");
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-white/10 rounded-lg hover:bg-neutral-200"
                    >
                      Clear Filters
                    </button>
                  )}
                  <Link
                    to="/operator/booking"
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#CAEA3C] text-neutral-900 rounded-lg hover:opacity-90"
                  >
                    Create New Booking
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200/70 dark:divide-white/5">
                {filteredParcels.map((parcel: AdminBooking) => {
                  const bookingId = parcel._id || parcel.identifier;
                  const isChecked = selectedBookingIds.includes(bookingId);

                  return (
                    <div
                      key={bookingId}
                      onClick={() => handleToggleParcel(bookingId)}
                      className={`p-4 flex items-start sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-[#CAEA3C]/10 dark:bg-[#CAEA3C]/5"
                          : "hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        {/* Checkbox */}
                        <div className="pt-0.5 sm:pt-0 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#7ca320] dark:text-[#CAEA3C]" />
                          ) : (
                            <Square className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>

                        {/* Parcel Details */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded">
                              {parcel.trackingId}
                            </span>
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                              {parcel.parcelName}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              ({parcel.parcelWeight} kg · {parcel.parcelType})
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {parcel.senderDistrict} →{" "}
                              <strong className="text-neutral-700 dark:text-neutral-300">
                                {parcel.receiverDistrict}
                              </strong>
                            </span>
                            <span>Receiver: {parcel.receiverName}</span>
                          </div>
                        </div>
                      </div>

                      {/* COD Amount */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-neutral-900 dark:text-white font-mono block">
                          ৳ {parcel.deliveryCharge || 0}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                          Pending
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dispatch Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          <form
            onSubmit={handleBulkAssignSubmit}
            className="bg-white dark:bg-[#151a23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-5 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#7ca320] dark:text-[#CAEA3C]" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Assign to Fleet Rider
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                {selectedBookingIds.length} Selected
              </span>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Selected Parcels Metrics */}
            <div className="bg-neutral-50 dark:bg-[#10141d] rounded-xl p-3 space-y-2 border border-neutral-200/60 dark:border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Parcels Count:
                </span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {selectedBookingIds.length} parcels
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Total Weight:
                </span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {totalParcelWeight.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200 dark:border-white/5">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Total COD Value:
                </span>
                <span className="font-extrabold text-[#7ca320] dark:text-[#CAEA3C] font-mono text-sm">
                  ৳ {totalCodAmount}
                </span>
              </div>
            </div>

            {/* Rider Selection Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="rider-select"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                Select On-Duty Rider
              </label>

              {isLoadingRiders ? (
                <div className="flex items-center gap-2 text-xs text-neutral-400 py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading rider fleet...
                </div>
              ) : riders.length === 0 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  No active riders found in system. Register a rider first.
                </p>
              ) : (
                <select
                  id="rider-select"
                  value={selectedRiderId}
                  onChange={(e) => {
                    setSelectedRiderId(e.target.value);
                    setFormError("");
                  }}
                  className="w-full text-xs bg-neutral-50 dark:bg-[#10141d] border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 cursor-pointer"
                >
                  <option value="">-- Choose Rider --</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.fullName} ({rider.phone || rider.emailAddress})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Dispatch Note (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="dispatch-note"
                className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Dispatch Note / Instructions (Optional)
              </label>
              <textarea
                id="dispatch-note"
                rows={2}
                value={dispatchNote}
                onChange={(e) => setDispatchNote(e.target.value)}
                placeholder="e.g. Priority delivery for Dhanmondi route before 4 PM"
                className="w-full text-xs bg-neutral-50 dark:bg-[#10141d] border border-neutral-200 dark:border-white/10 rounded-xl p-3 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C]/50 resize-none"
              />
            </div>

            {/* Submit Dispatch Button */}
            <button
              type="submit"
              disabled={
                selectedBookingIds.length === 0 ||
                !selectedRiderId ||
                bulkAssignMutation.isPending
              }
              className="w-full py-3 px-4 rounded-xl bg-[#CAEA3C] text-neutral-900 font-extrabold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {bulkAssignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Assigning Parcels...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Confirm Dispatch ({selectedBookingIds.length})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OperatorBulkAssignPage;
