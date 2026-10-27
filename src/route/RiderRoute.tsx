import { RoleBasedRoute } from "@/route/RoleBasedRoute";

// Shudhu Rider role-er jonno protected route
export const RiderRoute = () => {
  return (
    <RoleBasedRoute
      allowedRoles={["rider"]}
      loadingMessage="Verifying Rider Access..."
    />
  );
};
