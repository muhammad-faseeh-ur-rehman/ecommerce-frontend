import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Search,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Menu,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import api from "../api";
const initialProduct = {
  name: "",
  category: "Fashion",
  price: "",
  image: "",
  stock: 10,
  rating: 0,
};
const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
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
const getAdminName = () => {
  try {
    const admin = JSON.parse(localStorage.getItem("adminUser") || "null");
    return admin?.name || "Admin";
  } catch {
    return "Admin";
  }
};
export default function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(initialProduct);
  const [savingProduct, setSavingProduct] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const adminName = getAdminName();
  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingBag },
    { name: "Customers", icon: Users },
  ];
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");
    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setProductsError(
        error.response?.data?.message || "Unable to load products."
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await api.get("/orders/admin/all");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setOrdersError(
        error.response?.data?.message || "Unable to load orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await api.get("/orders/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error(
        "Unable to load dashboard statistics:",
        error.response?.data?.message || error.message
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);
  useEffect(() => {
    if (activePage === "Orders" || activePage === "Customers") {
      fetchOrders();
    }
  }, [activePage, fetchOrders]);
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductDetails(initialProduct);
    setShowProductModal(true);
  };
  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductDetails({
      name: product.name || "",
      category: product.category || "Fashion",
      price: product.price ?? "",
      image: product.image || "",
      stock: product.stock ?? 10,
      rating: product.rating ?? 0,
    });
    setShowProductModal(true);
  };
  const saveProduct = async (event) => {
    event.preventDefault();
    if (
      !productDetails.name.trim() ||
      !productDetails.image.trim() ||
      productDetails.price === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const payload = {
      ...productDetails,
      name: productDetails.name.trim(),
      image: productDetails.image.trim(),
      price: Number(productDetails.price),
      stock: Number(productDetails.stock),
      rating: Number(productDetails.rating),
    };
    if (
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.stock) ||
      payload.stock < 0 ||
      !Number.isFinite(payload.rating) ||
      payload.rating < 0 ||
      payload.rating > 5
    ) {
      alert("Please enter valid price, stock and rating values.");
      return;
    }
    setSavingProduct(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductDetails(initialProduct);
      await fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to save the product."
      );
    } finally {
      setSavingProduct(false);
    }
  };
  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;
    try {
      await api.delete(`/products/${productId}`);
      await fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to delete the product."
      );
    }
  };
  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrder(orderId);
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status });
      await Promise.all([fetchOrders(), fetchStats()]);
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to update order status."
      );
    } finally {
      setUpdatingOrder("");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login", { replace: true });
  };
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName =
        order.shippingAddress?.fullName || order.user?.name || "";
      const orderId = order._id || "";
      return (
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        orderId.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [orders, search]);
  const customers = useMemo(() => {
    const customerMap = new Map();
    orders.forEach((order) => {
      const user = order.user;
      if (!user || typeof user !== "object" || !user._id) return;
      const customerId = user._id;
      const existing = customerMap.get(customerId);
      const shipping = order.shippingAddress || {};
      const orderTotal = Number(order.totalAmount) || 0;
      if (existing) {
        existing.totalOrders += 1;
        if (order.status !== "Cancelled") existing.totalSpent += orderTotal;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
          existing.lastOrderStatus = order.status || "Pending";
        }
        if (!existing.phone && shipping.phone) existing.phone = shipping.phone;
        if (!existing.address) {
          existing.address = [shipping.address, shipping.city, shipping.postalCode]
            .filter(Boolean)
            .join(", ");
        }
      } else {
        customerMap.set(customerId, {
          id: customerId,
          name: shipping.fullName || user.name || "Customer",
          email: user.email || "N/A",
          phone: shipping.phone || "N/A",
          address: [shipping.address, shipping.city, shipping.postalCode]
            .filter(Boolean)
            .join(", ") || "N/A",
          totalOrders: 1,
          totalSpent: order.status === "Cancelled" ? 0 : orderTotal,
          lastOrderDate: order.createdAt,
          lastOrderStatus: order.status || "Pending",
        });
      }
    });
    return Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    );
  }, [orders]);
  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.address]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [customers, search]);
  const statCards = [
    {
      title: "Total Revenue",
      value: currency(stats.totalRevenue),
      icon: DollarSign,
      description: "From non-cancelled orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingBag,
      description: "All customer orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders ?? 0,
      icon: Clock,
      description: "Awaiting processing",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders ?? 0,
      icon: CheckCircle,
      description: "Successfully delivered",
    },
  ];
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
  const pageTitle = {
    Overview: "Dashboard Overview",
    Products: "Manage Products",
    Orders: "Manage Orders",
    Customers: "Customers",
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-950 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6">
            <div>
              <h1 className="text-2xl font-bold">
                Digi<span className="text-blue-400">Mart</span>
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-5 py-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Main Menu
            </p>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActivePage(item.name);
                      setSearch("");
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                      activePage === item.name
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={19} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-gray-800 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-300 transition hover:bg-red-500/10"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  {pageTitle[activePage]}
                </h2>
                <p className="hidden text-xs text-gray-500 sm:block">
                  Welcome back, {adminName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-blue-800">
                Admin Active
              </span>
            </div>
          </header>

          <div className="p-4 sm:p-8">
            {activePage === "Overview" && (
              <section>
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Overview</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Here's what's happening in your store.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      fetchStats();
                      fetchProducts();
                    }}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.title}
                        className="rounded-xl border bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-500">
                            {card.title}
                          </p>
                          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <Icon size={21} />
                          </div>
                        </div>

                        <p className="mt-4 text-2xl font-bold">
                          {statsLoading ? "..." : card.value}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 grid gap-5 lg:grid-cols-2">
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-bold">Products</h3>
                    <p className="mt-2 text-3xl font-bold">
                      {productsLoading ? "..." : products.length}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Products currently in your store
                    </p>
                    <button
                      onClick={() => setActivePage("Products")}
                      className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Manage products →
                    </button>
                  </div>

                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-bold">Orders</h3>
                    <p className="mt-2 text-3xl font-bold">
                      {statsLoading ? "..." : stats.totalOrders ?? 0}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Customer orders received
                    </p>
                    <button
                      onClick={() => setActivePage("Orders")}
                      className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      View orders →
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activePage === "Products" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">All Products</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add, edit and delete store products.
                    </p>
                  </div>

                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>

                <div className="mb-5 flex flex-wrap gap-3">
                  <div className="relative max-w-md flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={fetchProducts}
                    className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <RefreshCw size={17} />
                  </button>
                </div>

                {productsError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} />
                    {productsError}
                  </div>
                )}

                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Price</th>
                        <th className="px-5 py-4">Stock</th>
                        <th className="px-5 py-4">Rating</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {productsLoading ? (
                        <tr>
                          <td colSpan="6" className="px-5 py-10 text-center">
                            Loading products...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-5 py-10 text-center text-gray-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                    <ImageIcon size={20} />
                                  </div>
                                )}
                                <span className="font-semibold">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">{product.category}</td>
                            <td className="px-5 py-4 font-medium">
                              {currency(product.price)}
                            </td>
                            <td className="px-5 py-4">{product.stock}</td>
                            <td className="px-5 py-4">
                              ⭐ {product.rating ?? 0}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditProduct(product)}
                                  className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                  aria-label="Edit product"
                                >
                                  <Pencil size={17} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product._id)}
                                  className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                  aria-label="Delete product"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activePage === "Orders" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Customer Orders</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      View orders and update their delivery status.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      fetchOrders();
                      fetchStats();
                    }}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    <RefreshCw size={17} />
                    Refresh
                  </button>
                </div>

                <div className="relative mb-5 max-w-md">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by customer or order ID..."
                    className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {ordersError && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {ordersError}
                  </div>
                )}

                {ordersLoading ? (
                  <div className="rounded-xl border bg-white p-10 text-center">
                    Loading orders...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="rounded-xl border bg-white p-10 text-center">
                    <ShoppingBag
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-semibold">No orders found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Customer orders will appear here after checkout.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredOrders.map((order) => (
                      <article
                        key={order._id}
                        className="overflow-hidden rounded-xl border bg-white shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50 p-5">
                          <div>
                            <p className="font-bold">
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>

                            <select
                              value={order.status}
                              disabled={updatingOrder === order._id}
                              onChange={(e) =>
                                updateOrderStatus(order._id, e.target.value)
                              }
                              className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-6 p-5 lg:grid-cols-2">
                          <div>
                            <h4 className="mb-3 font-bold">
                              Customer Information
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <strong className="text-gray-800">Name:</strong>{" "}
                                {order.shippingAddress?.fullName ||
                                  order.user?.name ||
                                  "N/A"}
                              </p>
                              <p>
                                <strong className="text-gray-800">Email:</strong>{" "}
                                {order.user?.email || "N/A"}
                              </p>
                              <p>
                                <strong className="text-gray-800">Phone:</strong>{" "}
                                {order.shippingAddress?.phone || "N/A"}
                              </p>
                              <p>
                                <strong className="text-gray-800">
                                  Address:
                                </strong>{" "}
                                {[
                                  order.shippingAddress?.address,
                                  order.shippingAddress?.city,
                                  order.shippingAddress?.postalCode,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="mb-3 font-bold">Order Summary</h4>
                            <div className="space-y-3">
                              {(order.items || []).map((item, index) => (
                                <div
                                  key={`${item.productId}-${index}`}
                                  className="flex items-center justify-between gap-3 text-sm"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-11 w-11 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                                        <Package size={18} />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="truncate font-medium">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="whitespace-nowrap font-medium">
                                    {currency(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-5">
                          <div className="text-sm text-gray-500">
                            <p>
                              Payment:{" "}
                              <strong className="text-gray-800">
                                {order.paymentMethod || "Cash on Delivery"}
                              </strong>
                            </p>
                            <p className="mt-1">
                              Payment status:{" "}
                              <strong className="text-gray-800">
                                {order.paymentStatus || "Pending"}
                              </strong>
                            </p>
                          </div>

                          <p className="text-lg font-bold">
                            Total: {currency(order.totalAmount)}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Customers */}
            {activePage === "Customers" && (
              <section>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Customers</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Customers who have placed orders on DigiMart.
                    </p>
                  </div>
                  <button
                    onClick={fetchOrders}
                    disabled={ordersLoading}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw size={17} className={ordersLoading ? "animate-spin" : ""} />
                    Refresh Customers
                  </button>
                </div>

                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Total Customers</p>
                      <span className="rounded-lg bg-blue-50 p-3 text-blue-600"><Users size={21} /></span>
                    </div>
                    <p className="mt-3 text-2xl font-bold">{ordersLoading ? "..." : customers.length}</p>
                    <p className="mt-1 text-xs text-gray-400">Unique registered customers with orders</p>
                  </div>
                  <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Orders From Customers</p>
                      <span className="rounded-lg bg-purple-50 p-3 text-purple-600"><ShoppingBag size={21} /></span>
                    </div>
                    <p className="mt-3 text-2xl font-bold">{ordersLoading ? "..." : orders.length}</p>
                    <p className="mt-1 text-xs text-gray-400">Total orders received</p>
                  </div>
                </div>

                <div className="relative mb-5 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers by name, email or phone..."
                    className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {ordersError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} /> {ordersError}
                  </div>
                )}

                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4">Address</th>
                        <th className="px-5 py-4">Orders</th>
                        <th className="px-5 py-4">Total Spent</th>
                        <th className="px-5 py-4">Last Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ordersLoading ? (
                        <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500">Loading customers...</td></tr>
                      ) : filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-5 py-12 text-center">
                            <Users size={35} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-semibold">No customers found</p>
                            <p className="mt-1 text-sm text-gray-500">
                              {customers.length === 0 ? "Customers will appear here after they place an order." : "Try a different search term."}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-gray-800">{customer.name}</p>
                              <p className="mt-1 text-xs text-gray-400">ID: {String(customer.id).slice(-8)}</p>
                            </td>
                            <td className="px-5 py-4">
                              <p>{customer.email}</p>
                              <p className="mt-1 text-xs text-gray-500">{customer.phone}</p>
                            </td>
                            <td className="max-w-xs whitespace-normal px-5 py-4 text-gray-600">{customer.address}</td>
                            <td className="px-5 py-4 font-semibold">{customer.totalOrders}</td>
                            <td className="px-5 py-4 font-semibold">{currency(customer.totalSpent)}</td>
                            <td className="px-5 py-4">
                              <p>{formatDate(customer.lastOrderDate)}</p>
                              <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(customer.lastOrderStatus)}`}>
                                {customer.lastOrderStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  This list is built from customer accounts linked to orders. Customers who have registered but never ordered are not included.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Product information is saved in MongoDB.
                </p>
              </div>

              <button
                onClick={() => setShowProductModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Product Name *
                </label>
                <input
                  required
                  value={productDetails.name}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category *
                </label>
                <select
                  value={productDetails.category}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Price (PKR) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={productDetails.price}
                    onChange={(e) =>
                      setProductDetails({
                        ...productDetails,
                        price: e.target.value,
                      })
                    }
                    placeholder="2500"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Stock *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={productDetails.stock}
                    onChange={(e) =>
                      setProductDetails({
                        ...productDetails,
                        stock: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Image URL *
                </label>
                <input
                  required
                  type="url"
                  value={productDetails.image}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Rating (0–5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={productDetails.rating}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      rating: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 rounded-lg border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingProduct
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
