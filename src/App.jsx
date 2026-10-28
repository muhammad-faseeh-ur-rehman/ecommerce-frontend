
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import productsData from "./data/products";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function StoreLayout() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleAddToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  }

  function handleChangeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  return (
    <>
      <ScrollToTop />

      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Routes>
        <Route
          index
          element={
            <Home
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              category={category}
              setCategory={setCategory}
            />
          }
        />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faqs" element={<FAQs />} />

        <Route
          path="*"
          element={
            <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
              <h1 className="text-6xl font-extrabold text-indigo-600">
                404
              </h1>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Page Not Found
              </h2>
              <p className="mt-3 text-gray-600">
                Sorry, this page does not exist.
              </p>
              <Link
                to="/store"
                className="mt-6 rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white"
              >
                Return to Store
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onChangeQuantity={handleChangeQuantity}
        onRemove={handleRemoveFromCart}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/store/*" element={<StoreLayout />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
