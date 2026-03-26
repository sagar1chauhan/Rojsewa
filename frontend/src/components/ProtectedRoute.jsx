import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) {
    if (role === "admin") return <Navigate to="/admin/login" replace />;
    if (role === "provider") return <Navigate to="/provider/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    if (role === "admin") return <Navigate to="/admin/login" replace />;
    if (role === "provider") return <Navigate to="/provider/login" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
