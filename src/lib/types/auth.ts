export interface UserProfile {
  identifier: string
  fullName: string
  emailAddress: string
  role: "user" | "rider" | "admin"
}

export interface AuthenticationState {
  isAuthenticated: boolean
  currentUser: UserProfile | null
  login: (userProfile: UserProfile) => void
  logout: () => void
}
