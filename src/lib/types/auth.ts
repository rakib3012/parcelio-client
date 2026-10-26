export interface User {
  id: string
  fullName: string
  emailAddress: string
  role: "user" | "operator" | "rider" | "admin"
}

export interface AuthenticationState {
  isAuthenticated: boolean
  currentUser: User | null
  login: (user: User) => void
  logout: () => void
}
