import { RoleBasedRoute } from "@/route/RoleBasedRoute";

// Shudhu Admin role-er jonno protected route
export const AdminRoute = () => {
  return (
    <RoleBasedRoute
      allowedRoles={["admin"]}
      loadingMessage="Verifying Admin Access..."
    />
  );
};
