
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";

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

  // Search and category filtering
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

  // Total number of items in the cart
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Add a product to the cart
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

  // Increase or decrease product quantity
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

  // Remove a product from the cart
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
        {/* Home page */}
        <Route
          path="/"
          element={
            <Home
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              category={category}
              setCategory={setCategory}
            />
          }
        />

        {/* About Us page */}
        <Route path="/about" element={<About />} />

        {/* Contact Us page */}
        <Route path="/contact" element={<Contact />} />

        {/* Frequently Asked Questions page */}
        <Route path="/faqs" element={<FAQs />} />

        {/* 404 page */}
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
                Sorry, the page you are looking for does not exist.
              </p>

              <Link
                to="/"
                className="mt-6 rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Return to Home
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />

      {/* Shopping cart drawer */}
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
      <StoreLayout />
    </BrowserRouter>
  );
}
