import { X, Plus, Minus, Trash2 } from "lucide-react";

export default function Cart({
  cart,
  isOpen,
  onClose,
  onChangeQuantity,
  onRemove,
}) {
  if (!isOpen) return null;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
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
              <div key={item.id} className="flex gap-3 border-b py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Rs. {item.price.toLocaleString("en-PK")}
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

          <button
            disabled={cart.length === 0}
            onClick={() =>
              alert("Demo checkout only. No order has been placed.")
            }
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white disabled:opacity-50"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
