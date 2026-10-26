import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
export default function Navbar({
  search,
  setSearch,
  cartCount,
  onOpenCart,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQs", path: "/faqs" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600">
          DigiMart<span className="text-gray-900">.</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-full bg-gray-100 px-3 py-2 sm:flex">
            <Search size={18} className="text-gray-500" />
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
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
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
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full rounded-lg border p-3 outline-none focus:border-indigo-500"
          />
        </nav>
      )}
    </header>
  );
}
