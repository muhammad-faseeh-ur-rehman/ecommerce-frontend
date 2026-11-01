
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  // Protect admin dashboard
  if (adminOnly) {
    if (!token || !user) {
      return (
        <Navigate
          to="/admin-login"
          replace
          state={{ from: location }}
        />
      );
    }

    if (user.role !== "admin") {
      return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
  }

  // Protect normal customer routes if needed
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
