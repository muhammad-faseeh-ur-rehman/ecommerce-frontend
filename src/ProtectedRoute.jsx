
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false }) {
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

  return <Outlet />;
}
