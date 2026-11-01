
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (adminOnly) {
    if (!token || !user || user.role !== "admin") {
      return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
  }

  // Public store access
  return <Outlet />;
}
