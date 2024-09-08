// Context Import
import { useAuth } from "@/AuthContext";

// React Router DOM Import
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { authToken } = useAuth();

  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}
