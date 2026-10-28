
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export default function Navbar({
  search,
  setSearch,
  cartCount,
  onOpenCart,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const links = [
  { name: "Home", path: "/store" },
  { name: "About Us", path: "/store/about" },
  { name: "Contact Us", path: "/store/contact" },
  { name: "FAQs", path: "/store/faqs" },
];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAccountOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link
          to="/"
          className="shrink-0 text-2xl font-extrabold text-indigo-600"
        >
          DigiMart<span className="text-gray-900">.</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={navLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center rounded-full bg-gray-100 px-3 py-2 sm:flex">
            <Search size={18} className="shrink-0 text-gray-500" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-32 bg-transparent px-2 text-sm outline-none md:w-44"
            />
          </div>

          <button
            onClick={onOpenCart}
            aria-label="Open shopping cart"
            className="relative rounded-full p-2 hover:bg-gray-100"
          >
            <ShoppingCart size={22} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
              {cartCount}
            </span>
          </button>
          {token ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 hover:bg-gray-50"
              >
                <UserRound size={19} className="text-indigo-600" />
                <span className="max-w-28 truncate text-sm font-medium text-gray-700">
                  {user?.name || "My Account"}
                </span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <Link
                    to="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t bg-white p-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mt-3 flex items-center rounded-lg border px-3 py-2">
            <Search size={18} className="shrink-0 text-gray-500" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 outline-none"
            />
          </div>
          {token ? (
            <div className="mt-3 space-y-2 border-t pt-3">
              <p className="px-3 text-sm text-gray-500">
                Signed in as {user?.name || user?.email || "Customer"}
              </p>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <LayoutDashboard size={19} />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-indigo-600 px-4 py-3 text-center font-semibold text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
