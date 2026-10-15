import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import UserDashboardLayout from "@/layouts/UserDashboardLayout";
import RiderLayout from "@/layouts/RiderLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { UserRoute } from "@/route/UserRoute";
import { RiderRoute } from "@/route/RiderRoute";
import { AdminRoute } from "@/route/AdminRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DeliveriesPage from "@/pages/DeliveriesPage";
import BeARiderPage from "@/pages/BeARiderPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SingupPage from "@/pages/SingupPage";

import AboutPage from "@/pages/AboutPage";
import BookingPage from "@/pages/BookingPage";
import ServicesPage from "@/pages/ServicesPage";
import CoveragePage from "@/pages/CoveragePage";

// User Pages
import UserDashboardPage from "@/pages/UserDashboardPage";

// Rider Pages
import RiderDashboardPage from "@/pages/rider/RiderDashboardPage";
import RiderDeliveriesPage from "@/pages/rider/RiderDeliveriesPage";
import RiderEarningsPage from "@/pages/rider/RiderEarningsPage";

// Admin Pages
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage";

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
        element: <ServicesPage />,
      },
      {
        path: "coverage",
        element: <CoveragePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      // {
      //   path: "booking",
      //   element: <BookingPage />,
      // },
      // {
      //   path: "tracking",
      //   element: (
      //     <PlaceholderPage
      //       pageTitle="Tracking"
      //       pageDescription="Track your delivery with Parcelio"
      //     />
      //   ),
      // },
      // {
      //   path: "pricing",
      //   element: (
      //     <PlaceholderPage
      //       pageTitle="Transparent Pricing"
      //       pageDescription="Affordable and clear rates tailored for individual senders and enterprise merchants."
      //     />
      //   ),
      // },
      {
        path: "be-a-rider",
        element: <BeARiderPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SingupPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },

  // Customer / User Protected Routes (Guarded by UserRoute and styled in UserDashboardLayout)
  {
    path: "/user_dashboard",
    element: <UserRoute />,
    children: [
      {
        element: <UserDashboardLayout />,
        children: [
          {
            index: true,
            element: <UserDashboardPage />,
          },
          {
            path:"booking",
            element: <BookingPage />,
          },
          {
            path: "deliveries",
            element: <DeliveriesPage />,
          },
          {
            path: "tracking",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },

  // Rider Protected Routes (Guarded by RiderRoute and styled in RiderLayout)
  {
    path: "/rider",
    element: <RiderRoute />,
    children: [
      {
        element: <RiderLayout />,
        children: [
          {
            index: true,
            element: <RiderDashboardPage />,
          },
          {
            path: "deliveries",
            element: <RiderDeliveriesPage />,
          },
          {
            path: "earnings",
            element: <RiderEarningsPage />,
          },
        ],
      },
    ],
  },

  // Admin Routes (Guarded by AdminRoute — requires admin role)
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminOverviewPage />,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
          },
          {
            path: "bookings",
            element: <AdminBookingsPage />,
          },
        ],
      },
    ],
  },
]);

