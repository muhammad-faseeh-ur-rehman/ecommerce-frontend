
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === "admin@digimart.com" &&
      password === "DigiMart@123"
    ) {
      localStorage.setItem("token", "demo-admin-session");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "DigiMart Admin",
          email: "admin@digimart.com",
          role: "admin",
        })
      );

      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid admin email or password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Digi<span className="text-indigo-600">Mart</span>
          </h1>
          <p className="mt-2 text-slate-500">
            Administrator Portal
          </p>
        </div>

        <label className="mb-2 block text-sm font-semibold">
          Admin Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@digimart.com"
          required
          className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
        />

        <label className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign In to Dashboard
        </button>

        <p className="mt-5 text-center text-xs text-slate-400">
          Local demonstration mode
        </p>
      </form>
    </div>
  );
}
