import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AuthenticationState, UserProfile } from "@/lib/types/auth"
import Cookies from "js-cookie"

export const useAuthStore = create<AuthenticationState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      login: (userProfile: UserProfile) => {
        set({
          isAuthenticated: true,
          currentUser: userProfile,
        })
      },
      logout: () => {
        Cookies.remove("accessToken", { path: "/" })
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("token")
          localStorage.removeItem("parcelio-auth-storage")
        }
        set({
          isAuthenticated: false,
          currentUser: null,
        })
      },
    }),
    {
      name: "parcelio-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
