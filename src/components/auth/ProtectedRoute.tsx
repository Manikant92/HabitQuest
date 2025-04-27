
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    // Save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
