
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, RefreshCw, Search, AlertCircle } from "lucide-react";
import api from "../api";

const currency = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusClass = (status) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

export default function Customers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/orders/admin/all");

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Convert customer orders into unique customer records.
  const customers = useMemo(() => {
    const customerMap = new Map();

    // API orders are sorted newest first.
    orders.forEach((order) => {
      const user = order.user;

      if (!user?._id) return;

      const customerId = user._id;

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name:
            order.shippingAddress?.fullName ||
            user.name ||
            "Unknown Customer",
          email: user.email || "N/A",
          phone: order.shippingAddress?.phone || "N/A",
          address: [
            order.shippingAddress?.address,
            order.shippingAddress?.city,
            order.shippingAddress?.postalCode,
          ]
            .filter(Boolean)
            .join(", "),
          totalOrders: 0,
          totalSpent: 0,
          latestOrderDate: order.createdAt,
          latestStatus: order.status,
        });
      }

      const customer = customerMap.get(customerId);

      customer.totalOrders += 1;

      if (order.status !== "Cancelled") {
        customer.totalSpent += Number(order.totalAmount) || 0;
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [customers, search]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">Customers Who Ordered</h3>
          <p className="mt-1 text-sm text-gray-500">
            View customers who have purchased from your store.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Customer Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Customers</p>
            <Users className="text-blue-600" size={22} />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {loading ? "..." : customers.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Unique customers with orders
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Customer Orders</p>
          <p className="mt-3 text-3xl font-bold">
            {loading ? "..." : orders.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            All orders received
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Address</th>
              <th className="px-5 py-4">Orders</th>
              <th className="px-5 py-4">Total Spent</th>
              <th className="px-5 py-4">Latest Status</th>
              <th className="px-5 py-4">Joined Orders</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-gray-500"
                >
                  {customers.length === 0
                    ? "No customers have placed orders yet."
                    : "No customers match your search."}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {customer.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {customer.phone}
                  </td>

                  <td className="max-w-56 px-5 py-4 text-gray-600">
                    {customer.address || "N/A"}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {customer.totalOrders}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {currency(customer.totalSpent)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        customer.latestStatus
                      )}`}
                    >
                      {customer.latestStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(customer.latestOrderDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
