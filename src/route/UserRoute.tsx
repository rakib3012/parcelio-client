import { RoleBasedRoute } from "@/route/RoleBasedRoute";

// Shudhu Customer/User role-er jonno protected route
export const UserRoute = () => {
  return (
    <RoleBasedRoute
      allowedRoles={["user"]}
      loadingMessage="Loading Customer Portal..."
    />
  );
};
