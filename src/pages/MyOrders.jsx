
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const { data } = await api.get("/orders/my-orders");

      const customerOrders = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
          ? data.orders
          : [];

      setOrders(customerOrders);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);

    // Check for admin status updates every 15 seconds.
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  function formatDate(date) {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Orders
            </h1>
            <p className="mt-2 text-gray-500">
              Track your purchases and check their delivery status.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={loading}
            className="rounded-lg border border-indigo-600 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        {lastUpdated && (
          <p className="mt-3 text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString("en-PK")}
            {" · "}Automatically refreshes every 15 seconds
          </p>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
            <button
              onClick={() => fetchOrders(true)}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-2 text-gray-500">
              Your purchases will appear here after you place an order.
            </p>
            <Link
              to="/store"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50 p-5">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="mt-1 break-all font-semibold text-gray-900">
                      {order._id}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-gray-500">
                      Order Status
                    </p>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <h3 className="font-bold text-gray-900">
                    Ordered Products
                  </h3>

                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${item.productId || item.name}-${index}`}
                      className="flex flex-wrap items-center gap-4"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg border object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No Image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        Rs.{" "}
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString("en-PK")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 border-t p-5 sm:grid-cols-2">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Delivery Information
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.city}
                      {order.shippingAddress?.postalCode
                        ? ` - ${order.shippingAddress.postalCode}`
                        : ""}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500">
                      Payment Method
                    </p>
                    <p className="mt-1 font-semibold">
                      {order.paymentMethod || "Cash on Delivery"}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      Payment Status
                    </p>
                    <p className="mt-1 font-semibold">
                      {order.paymentStatus || "Pending"}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      Order Total
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-indigo-600">
                      Rs.{" "}
                      {Number(order.totalAmount || 0).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
