
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/admin-login", {
        email,
        password,
      });

      // Verify admin role
      if (data.user?.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      // Save real JWT authentication
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect to admin dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">

          <Link
            to="/store"
            className="text-3xl font-extrabold text-slate-900"
          >
            Digi<span className="text-indigo-600">Mart</span>
          </Link>

          <p className="mt-2 text-slate-500">
            Administrator Portal
          </p>

          <span className="mt-4 inline-block rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600">
            Secure Admin Access
          </span>

        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Authenticating..."
              : "Sign In to Dashboard"}
          </button>

        </form>

        <div className="mt-6 border-t pt-5 text-center">

          <Link
            to="/store"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back to DigiMart Store
          </Link>

          <p className="mt-4 text-xs text-slate-400">
            Authorized administrators only.
          </p>

        </div>

      </div>
    </main>
  );
}
