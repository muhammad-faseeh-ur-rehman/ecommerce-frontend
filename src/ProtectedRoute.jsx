
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

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/store" replace />;
  }

  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
