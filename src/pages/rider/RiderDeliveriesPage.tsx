import { useState } from "react"
import { Search, CheckCircle2, Phone, MapPin } from "lucide-react"

interface DeliveryItem {
  id: string
  trackingCode: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  district: string
  packageType: string
  codAmount: number
  deliveryStatus: "Pending Pickup" | "In Transit" | "Delivered" | "Returned"
  assignedTime: string
}

const mockRiderDeliveries: DeliveryItem[] = [
  {
    id: "del-1",
    trackingCode: "ZP-88219",
    customerName: "Fatima Rahman",
    customerPhone: "+880 1712-345678",
    deliveryAddress: "House 42, Road 11, Banani",
    district: "Dhaka North",
    packageType: "Electronics (Fragile)",
    codAmount: 1400,
    deliveryStatus: "In Transit",
    assignedTime: "Today, 09:30 AM",
  },
  {
    id: "del-2",
    trackingCode: "ZP-88216",
    customerName: "Nusrat Jahan",
    customerPhone: "+880 1819-987654",
    deliveryAddress: "Flat B3, Green Valley, Dhanmondi 27",
    district: "Dhaka South",
    packageType: "Apparel & Fashion",
    codAmount: 850,
    deliveryStatus: "Pending Pickup",
    assignedTime: "Today, 10:15 AM",
  },
  {
    id: "del-3",
    trackingCode: "ZP-88214",
    customerName: "Sadia Islam",
    customerPhone: "+880 1611-456123",
    deliveryAddress: "Holding 12, Sector 4, Uttara",
    district: "Dhaka North",
    packageType: "Cosmetics & Skincare",
    codAmount: 2100,
    deliveryStatus: "Pending Pickup",
    assignedTime: "Today, 11:00 AM",
  },
  {
    id: "del-4",
    trackingCode: "ZP-88218",
    customerName: "Kazi Mahmud",
    customerPhone: "+880 1912-778899",
    deliveryAddress: "Lane 5, Nasirabad Housing Society",
    district: "Chittagong",
    packageType: "Document Parcel",
    codAmount: 0,
    deliveryStatus: "Delivered",
    assignedTime: "Yesterday, 04:20 PM",
  },
  {
    id: "del-5",
    trackingCode: "ZP-88215",
    customerName: "Imran Hossain",
    customerPhone: "+880 1515-334455",
    deliveryAddress: "Avenue 3, Mirpur DOHS",
    district: "Dhaka North",
    packageType: "Home Appliance",
    codAmount: 3200,
    deliveryStatus: "Delivered",
    assignedTime: "Yesterday, 02:45 PM",
  },
]

const RiderDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(mockRiderDeliveries)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<string>("All")

  const filteredDeliveries = deliveries.filter((item) => {
    const matchesSearch =
      item.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "All") return matchesSearch
    return matchesSearch && item.deliveryStatus === activeTab
  })

  const handleUpdateStatus = (
    id: string,
    newStatus: DeliveryItem["deliveryStatus"]
  ) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, deliveryStatus: newStatus } : d))
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Assigned Deliveries
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your daily route parcels, verify COD collections, and mark completions.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["All", "Pending Pickup", "In Transit", "Delivered"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#1C1D20] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tracking, customer or area..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#CAEA3C] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Deliveries Table / Cards */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {filteredDeliveries.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-500">
              No deliveries match the filter criteria.
            </div>
          ) : (
            filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-5 sm:p-6 hover:bg-neutral-50/50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg">
                      {delivery.trackingCode}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        delivery.deliveryStatus === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : delivery.deliveryStatus === "In Transit"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {delivery.deliveryStatus}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Assigned: {delivery.assignedTime}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-500">Customer: </span>
                      <span className="font-semibold text-neutral-900">
                        {delivery.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{delivery.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Type: </span>
                      <span className="text-neutral-800">{delivery.packageType}</span>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-1.5 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span>
                        {delivery.deliveryAddress}, {delivery.district}
                      </span>
                    </div>
                  </div>
                </div>

                {/* COD & Action Buttons */}
                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      COD Collection
                    </span>
                    <span className="text-base font-extrabold text-neutral-900 font-mono">
                      {delivery.codAmount > 0
                        ? `৳ ${delivery.codAmount}`
                        : "Paid Online"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {delivery.deliveryStatus === "Pending Pickup" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(delivery.id, "In Transit")
                        }
                        className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl transition-colors shadow-xs"
                      >
                        Start Delivery
                      </button>
                    )}
                    {delivery.deliveryStatus === "In Transit" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(delivery.id, "Delivered")
                        }
                        className="px-3.5 py-2 text-xs font-semibold bg-[#CAEA3C] text-neutral-900 hover:bg-[#b8d82d] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                    {delivery.deliveryStatus === "Delivered" && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RiderDeliveriesPage
