import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Checkout({ cart, onOrderPlaced }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!localStorage.getItem("token")) {
      navigate("/login", {
        state: { from: "/store/checkout" },
      });
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderItems = cart.map((item) => ({
        productId: String(item.id),
        name: item.name,
        image: item.image || "",
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      const { data } = await api.post("/orders", {
        items: orderItems,
        shippingAddress: form,
      });

      setSuccessOrder(data.order);
      onOrderPlaced();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (successOrder) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for shopping with DigiMart. Your order has been received.
          </p>

          <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
            Order ID: <strong>{successOrder._id}</strong>
          </p>

          <p className="mt-2 font-semibold">
            Total: Rs.{" "}
            {Number(successOrder.totalAmount).toLocaleString("en-PK")}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Payment method: Cash on Delivery
          </p>

          <button
            onClick={() => navigate("/store")}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <button
          onClick={() => navigate("/store")}
          className="mt-5 rounded-lg bg-indigo-600 px-6 py-3 text-white"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold">Delivery Information</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the details where you want your order delivered.
          </p>

          {error && (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {[
              { name: "fullName", label: "Full Name", placeholder: "Your name" },
              { name: "phone", label: "Phone Number", placeholder: "03XXXXXXXXX" },
              { name: "address", label: "Full Delivery Address", placeholder: "House, street, area" },
              { name: "city", label: "City", placeholder: "Your city" },
              { name: "postalCode", label: "Postal Code (optional)", placeholder: "Postal code" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name !== "postalCode"}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
                />
              </div>
            ))}

            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="font-semibold text-gray-800">
                Payment Method
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Cash on Delivery (COD)
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Pay when your order arrives.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>

        <section className="h-fit rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  Rs.{" "}
                  {(item.price * item.quantity).toLocaleString("en-PK")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-PK")}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Delivery charges are not included yet.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}