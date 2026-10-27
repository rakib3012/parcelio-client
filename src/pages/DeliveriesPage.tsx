import { useState } from "react"
import { Link } from "react-router"
import { Search, ChevronLeft, ChevronRight, PackageCheck } from "lucide-react"

interface DeliveryRecord {
  trackingCode: string
  recipientName: string
  destinationCity: string
  deliveryStatus: "In Transit" | "Delivered" | "Pending"
  createdDate: string
  chargeAmount: number
}

const mockDeliveryRecords: DeliveryRecord[] = [
  {
    trackingCode: "ZP-88219",
    recipientName: "Fatima Rahman",
    destinationCity: "Dhaka North",
    deliveryStatus: "In Transit",
    createdDate: "2026-09-22",
    chargeAmount: 140,
  },
  {
    trackingCode: "ZP-88218",
    recipientName: "Kazi Mahmud",
    destinationCity: "Chittagong",
    deliveryStatus: "Delivered",
    createdDate: "2026-09-21",
    chargeAmount: 220,
  },
  {
    trackingCode: "ZP-88217",
    recipientName: "Tanvir Ahmed",
    destinationCity: "Sylhet",
    deliveryStatus: "Delivered",
    createdDate: "2026-09-20",
    chargeAmount: 190,
  },
  {
    trackingCode: "ZP-88216",
    recipientName: "Nusrat Jahan",
    destinationCity: "Rajshahi",
    deliveryStatus: "Pending",
    createdDate: "2026-09-19",
    chargeAmount: 160,
  },
  {
    trackingCode: "ZP-88215",
    recipientName: "Imran Hossain",
    destinationCity: "Dhaka South",
    deliveryStatus: "Delivered",
    createdDate: "2026-09-18",
    chargeAmount: 120,
  },
  {
    trackingCode: "ZP-88214",
    recipientName: "Sadia Islam",
    destinationCity: "Khulna",
    deliveryStatus: "In Transit",
    createdDate: "2026-09-17",
    chargeAmount: 180,
  },
  {
    trackingCode: "ZP-88213",
    recipientName: "Arif Chowdhury",
    destinationCity: "Barisal",
    deliveryStatus: "Delivered",
    createdDate: "2026-09-16",
    chargeAmount: 210,
  },
  {
    trackingCode: "ZP-88212",
    recipientName: "Farhana Akter",
    destinationCity: "Mymensingh",
    deliveryStatus: "Delivered",
    createdDate: "2026-09-15",
    chargeAmount: 150,
  },
]

const DeliveriesPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDeliveries = mockDeliveryRecords.filter((record) => {
    const query = searchKeyword.toLowerCase()
    return (
      record.trackingCode.toLowerCase().includes(query) ||
      record.recipientName.toLowerCase().includes(query) ||
      record.destinationCity.toLowerCase().includes(query)
    )
  })

  const totalRecords = filteredDeliveries.length
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1
  const startIndex = (currentPage - 1) * rowsPerPage
  const visibleDeliveries = filteredDeliveries.slice(
    startIndex,
    startIndex + rowsPerPage
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
    setCurrentPage(1)
  }

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previousPage) => previousPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previousPage) => previousPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            My Deliveries
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Track and inspect your sent parcels, courier status, and invoices.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151a23] rounded-3xl p-6 border border-neutral-200/80 dark:border-white/10 shadow-xs space-y-5 transition-colors">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="Search by code, recipient, city..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#10141d] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#caea4d] transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Total: {totalRecords}
            </span>

            <div className="flex items-center gap-2">
              <label
                htmlFor="rowsPerPageSelect"
                className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap"
              >
                Rows per page:
              </label>
              <select
                id="rowsPerPageSelect"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#10141d] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#caea4d]"
              >
                <option value={3} className="dark:bg-[#151a23]">3</option>
                <option value={5} className="dark:bg-[#151a23]">5</option>
                <option value={10} className="dark:bg-[#151a23]">10</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table with Horizontal Scroll */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-neutral-50 dark:bg-[#10141d] text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-white/10">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Tracking Code
                </th>
                <th scope="col" className="px-4 py-3">
                  Recipient
                </th>
                <th scope="col" className="px-4 py-3">
                  Destination
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
              {visibleDeliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-neutral-500 dark:text-neutral-400 text-sm"
                  >
                    <PackageCheck className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                    No delivery records found matching your search.
                  </td>
                </tr>
              ) : (
                visibleDeliveries.map((delivery) => (
                  <tr
                    key={delivery.trackingCode}
                    className="hover:bg-neutral-50/70 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      <Link
                        to={`/user_dashboard/tracking?id=${delivery.trackingCode}`}
                        className="font-mono text-[#5e7724] dark:text-[#CAEA3C] hover:underline"
                      >
                        {delivery.trackingCode}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                      {delivery.recipientName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                      {delivery.destinationCity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          delivery.deliveryStatus === "Delivered"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                            : delivery.deliveryStatus === "In Transit"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                            : "bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10"
                        }`}
                      >
                        {delivery.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">
                      {delivery.createdDate}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white">
                      ৳ {delivery.chargeAmount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Showing {totalRecords === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + rowsPerPage, totalRecords)} of {totalRecords}{" "}
            records
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold px-2 text-neutral-800 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveriesPage
