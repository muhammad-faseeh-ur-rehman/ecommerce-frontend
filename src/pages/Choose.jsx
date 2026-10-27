
import { useNavigate } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";

export default function Choose() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Welcome to DigiMart
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Where would you like to go?
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <button
            onClick={() => navigate("/store")}
            className="rounded-2xl border border-gray-200 p-8 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            <ShoppingBag size={36} className="text-indigo-600" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Visit Store
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Browse products, search items, and manage your shopping cart.
            </p>

            <span className="mt-5 inline-block font-semibold text-indigo-600">
              Open Store →
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl border border-gray-200 p-8 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            <LayoutDashboard size={36} className="text-indigo-600" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              My Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Open your personal dashboard.
            </p>

            <span className="mt-5 inline-block font-semibold text-indigo-600">
              Open Dashboard →
            </span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mx-auto mt-8 flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </main>
  );
}
