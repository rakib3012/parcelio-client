import { createBrowserRouter } from "react-router"
import RootLayout from "@/layouts/RootLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import { ProtectedRoute } from "@/route/ProtectedRoute"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import DeliveriesPage from "@/pages/DeliveriesPage"
import PlaceholderPage from "@/pages/PlaceholderPage"
import BeARiderPage from "@/pages/BeARiderPage"
import NotFoundPage from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  // Public Routes (Wrapped in RootLayout with ZapShift Navbar)
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "services",
        element: (
          <PlaceholderPage
            pageTitle="Our Services"
            pageDescription="End-to-end e-commerce logistics, express courier services, and warehouse fulfillment."
          />
        ),
      },
      {
        path: "coverage",
        element: (
          <PlaceholderPage
            pageTitle="Delivery Coverage"
            pageDescription="ZapShift delivers to 64 districts and 495+ upazilas with verified local hubs."
          />
        ),
      },
      {
        path: "about",
        element: (
          <PlaceholderPage
            pageTitle="About ZapShift"
            pageDescription="Learn how we are modernizing parcel delivery with real-time tracking and verified riders."
          />
        ),
      },
      {
        path: "pricing",
        element: (
          <PlaceholderPage
            pageTitle="Transparent Pricing"
            pageDescription="Affordable and clear rates tailored for individual senders and enterprise merchants."
          />
        ),
      },
      {
        path: "be-a-rider",
        element: <BeARiderPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },

  // Protected Routes (Guarded by ProtectedRoute and styled in DashboardLayout)
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "deliveries",
            element: <DeliveriesPage />,
          },
        ],
      },
    ],
  },
])