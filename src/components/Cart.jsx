
import { useState } from "react";
import { X, Plus, Minus, Trash2, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart({
  cart,
  isOpen,
  onClose,
  onChangeQuantity,
  onRemove,
}) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleCheckout() {
    if (!token || !user || user.role !== "user") {
      setShowLoginPopup(true);
      return;
    }

    alert("Demo checkout only. No order has been placed.");
  }

  function goToLogin(path) {
    setShowLoginPopup(false);
    onClose();

    navigate(path, {
      state: { from: "/store" },
    });
  }

  return (
    <>
      {/* Shopping Cart */}
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50">

        <aside className="flex h-full w-full max-w-md flex-col bg-white p-5">

          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>

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
                <div
                  key={item.id}
                  className="flex gap-3 border-b py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Rs. {item.price.toLocaleString("en-PK")}
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      <button
                        onClick={() =>
                          onChangeQuantity(item.id, -1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          onChangeQuantity(item.id, 1)
                        }
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

              <span>
                Rs. {total.toLocaleString("en-PK")}
              </span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              Proceed to Checkout
            </button>

          </div>
        </aside>
      </div>

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

          <div className="relative w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">

            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              aria-label="Close login popup"
            >
              <X size={22} />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <LockKeyhole
                size={30}
                className="text-orange-500"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Login Required
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Please log in or create an account before proceeding
              with your purchase.
            </p>

            <button
              onClick={() => goToLogin("/login")}
              className="mt-7 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Login to Continue
            </button>

            <button
              onClick={() => goToLogin("/signup")}
              className="mt-3 w-full rounded-lg border border-indigo-600 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Create New Account
            </button>

            <button
              onClick={() => setShowLoginPopup(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-900"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      )}
    </>
  );
}
