import { Outlet } from "react-router"
import Navbar from "@/components/Navbar/Navbar"

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans text-neutral-900 antialiased">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout