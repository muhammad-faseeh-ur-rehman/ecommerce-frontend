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
import MyOrders from "./pages/MyOrders";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import api from "./api";

const CART_KEY = "digimart_cart";

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item) =>
        item &&
        item.id !== undefined &&
        typeof item.name === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
    );
  } catch {
    return [];
  }
}

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

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [reloadProducts, setReloadProducts] = useState(0);

  const [cart, setCart] = useState(getSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from MongoDB through the backend API
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setProductsLoading(true);
        setProductsError("");

        const { data } = await api.get("/products");

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response from server.");
        }

        if (isMounted) {
          const formattedProducts = data.map((product) => ({
            ...product,
            id: product._id,
          }));

          setProducts(formattedProducts);
        }
      } catch (error) {
        if (isMounted) {
          setProductsError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load products. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadProducts]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleAddToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        return currentCart.map((item) =>
          String(item.id) === String(product.id)
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
          String(item.id) === String(id)
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  }

  function handleOrderPlaced() {
    setCart([]);
    localStorage.removeItem(CART_KEY);
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
              productsLoading={productsLoading}
              productsError={productsError}
              onRetryProducts={() =>
                setReloadProducts((previous) => previous + 1)
              }
            />
          }
        />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faqs" element={<FAQs />} />

        <Route
          path="checkout"
          element={
            <Checkout
              cart={cart}
              onOrderPlaced={handleOrderPlaced}
            />
          }
        />

        <Route
          path="*"
          element={
            <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
              <h1 className="text-6xl font-extrabold text-indigo-600">
                404
              </h1>

              <h2 className="mt-4 text-2xl font-bold">
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
        <Route
          path="/"
          element={<Navigate to="/store" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/store/*" element={<StoreLayout />} />

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/store" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}