import { useState } from "react";
import { X, Plus, Minus, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart({
  cart,
  isOpen,
  onClose,
  onChangeQuantity,
  onRemove,
}) {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token && user);
  const isAdmin = user?.role === "admin";

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  function handleCheckout() {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (isAdmin) {
      setShowLoginPopup(false);
      return;
    }

    onClose();
    navigate("/store/checkout");
  }

  function handleLogin() {
    setShowLoginPopup(false);
    onClose();

    navigate("/login", {
      state: {
        message: "Please log in to continue with checkout.",
        from: "/store/checkout",
      },
    });
  }

  function handleSignup() {
    setShowLoginPopup(false);
    onClose();

    navigate("/signup", {
      state: {
        from: "/store/checkout",
      },
    });
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
        <aside className="flex h-full w-full max-w-md flex-col bg-white p-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {cart.length} product(s)
              </p>
            </div>

            <button onClick={onClose} aria-label="Close cart">
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                Your cart is empty.
              </p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 border-b py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{item.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Rs. {Number(item.price).toLocaleString("en-PK")}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => onChangeQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => onChangeQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-red-500"
                        aria-label="Remove product"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <div className="mb-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-PK")}</span>
            </div>
            {isAdmin && (
              <p className="mb-3 text-sm text-red-600">
                Admin accounts cannot place customer orders. Please use a
                customer account.
              </p>
            )}
            <button
              disabled={cart.length === 0 || isAdmin}
              onClick={handleCheckout}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              <Lock size={12} className="mr-1 inline" />
              Secure checkout
            </p>
          </div>
        </aside>
      </div>
      {showLoginPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <Lock size={25} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Login Required</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Please log in or create an account before proceeding to checkout.
              Your cart will be saved.
            </p>
            <button
              onClick={handleLogin}
              className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Login to Continue
            </button>
            <button
              onClick={handleSignup}
              className="mt-3 w-full rounded-lg border border-indigo-600 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Create Account
            </button>
            <button
              onClick={() => setShowLoginPopup(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}