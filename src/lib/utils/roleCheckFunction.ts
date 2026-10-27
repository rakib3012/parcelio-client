
//  getRoleDestination User-er role onujayi tar dashboard-er path return korbe
export const getRoleDestination = (role?: string): string => {
    if (role === "admin") return "/admin";
    if (role === "rider") return "/rider";
    return "/user_dashboard";
};  