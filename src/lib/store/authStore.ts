import { create } from "zustand"
import type { AuthenticationState, UserProfile } from "@/lib/types/auth"

export const useAuthStore = create<AuthenticationState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  login: (userProfile: UserProfile) => {
    set({
      isAuthenticated: true,
      currentUser: userProfile,
    })
  },
  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
    })
  },
}))
