
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      // Registration successful
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully! Please log in to continue shopping.",
        },
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <Link
          to="/store"
          className="mb-6 block text-center text-2xl font-extrabold text-indigo-600"
        >
          DigiMart.
        </Link>

        <h1 className="text-center text-3xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Join DigiMart and start shopping
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-600"
            />

            <p className="mt-1 text-xs text-gray-400">
              Password must contain at least 8 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600"
          >
            Log In
          </Link>
        </p>

        <p className="mt-4 text-center text-sm">
          <Link
            to="/store"
            className="text-gray-500 hover:text-indigo-600"
          >
            Continue Shopping
          </Link>
        </p>

      </div>
    </main>
  );
}
