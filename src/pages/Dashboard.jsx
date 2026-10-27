
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">
          My E-Commerce
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Dashboard
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Welcome{user?.name ? `, ${user.name}` : "!"}
          </h2>

          <p className="mt-3 text-gray-600">
            You are logged in successfully.
          </p>

          {user?.email && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Your email</p>
              <p className="mt-1 font-medium text-gray-900">{user.email}</p>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">My Profile</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your account information.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your order section can be added next.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
