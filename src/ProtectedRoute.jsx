import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  adminOnly = false,
  customerOnly = false,
}) {
  const location = useLocation();

  if (adminOnly) {
    const adminToken = localStorage.getItem("adminToken");

    let adminUser = null;

    try {
      adminUser = JSON.parse(
        localStorage.getItem("adminUser") || "null"
      );
    } catch {
      adminUser = null;
    }

    if (
      !adminToken ||
      !adminUser ||
      adminUser.role !== "admin"
    ) {
      return <Navigate to="/admin-login" replace />;
    }
  }

  if (customerOnly) {
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
          state={{ from: location.pathname }}
        />
      );
    }

    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}