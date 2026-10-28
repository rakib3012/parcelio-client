import { RoleBasedRoute } from "@/route/RoleBasedRoute";

// Shudhu Operator role-er jonno protected route
export const OperatorRouter = () => {
  return (
    <RoleBasedRoute
      allowedRoles={["operator"]}
      loadingMessage="Verifying Operator Access..."
    />
  );
};
