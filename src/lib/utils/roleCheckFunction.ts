// getRoleDestination User-er role onujayi tar dashboard-er path return korbe
export const getRoleDestination = (role?: string): string => {
  if (role === "admin") return "/admin";
  if (role === "rider") return "/rider";
  if (role === "operator") return "/operator";
  return "/user_dashboard";
};
