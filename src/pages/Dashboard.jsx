
import productsData from "../data/products";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialProducts = [
  {
    id: 1,
    name: "ForcePro Smartwatch",
    category: "Electronics",
    price: 89.99,
    stock: 24,
    status: "Active",
    image: "https://placehold.co/100x100/e0e7ff/3730a3?text=Watch",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 59.99,
    stock: 18,
    status: "Active",
    image: "https://placehold.co/100x100/f3e8ff/7e22ce?text=Audio",
  },
  {
    id: 3,
    name: "Classic Backpack",
    category: "Fashion",
    price: 39.99,
    stock: 7,
    status: "Active",
    image: "https://placehold.co/100x100/dcfce7/166534?text=Bag",
  },
  {
    id: 4,
    name: "Running Sneakers",
    category: "Fashion",
    price: 74.99,
    stock: 0,
    status: "Out of Stock",
    image: "https://placehold.co/100x100/ffedd5/9a3412?text=Shoes",
  },
  {
    id: 5,
    name: "Desk Lamp",
    category: "Home",
    price: 29.99,
    stock: 32,
    status: "Active",
    image: "https://placehold.co/100x100/fef3c7/92400e?text=Lamp",
  },
];

const initialOrders = [
  { id: "#DM1001", customer: "Ali Ahmed", total: 120, status: "Delivered" },
  { id: "#DM1002", customer: "Sara Khan", total: 85.5, status: "Pending" },
  { id: "#DM1003", customer: "Usman Ali", total: 210, status: "Processing" },
  { id: "#DM1004", customer: "Ayesha Noor", total: 49.99, status: "Pending" },
];

const navigation = [
  { label: "Overview", icon: "▦" },
  { label: "Products", icon: "□" },
  { label: "Orders", icon: "▤" },
  { label: "Customers", icon: "♙" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Overview");
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, search]);

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
    });
    setMessage("");
    setShowForm(true);
  }

  function handleSaveProduct(event) {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      stock < 0
    ) {
      setMessage("Enter a valid product name, price, and stock.");
      return;
    }

    const product = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      price,
      stock,
      status: stock > 0 ? "Active" : "Out of Stock",
      image:
        form.image.trim() ||
        "https://placehold.co/100x100/e2e8f0/334155?text=Product",
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((item) => (item.id === editingId ? product : item))
      );
      setMessage("Product updated successfully.");
    } else {
      setProducts((current) => [product, ...current]);
      setMessage("Product added successfully.");
    }

    setShowForm(false);
  }

  function deleteProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      setProducts((current) => current.filter((item) => item.id !== id));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("digimartDemoAdmin");
    navigate("/admin-login", { replace: true });
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: money(12450),
      detail: "Demo sales data",
      icon: "$",
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      detail: "Sample orders",
      icon: "▤",
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      detail: `${totalStock} items in stock`,
      icon: "□",
    },
    {
      title: "Customers",
      value: "186",
      detail: "Demo customer data",
      icon: "♙",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col bg-slate-950 p-5 text-white">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-extrabold">
              Digi<span className="text-indigo-400">Mart</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              E-commerce administration
            </p>
          </div>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.label);
                  setSearch("");
                  setMessage("");
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  activePage === item.label
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-xl bg-slate-900 p-4">
            <p className="font-semibold">DigiMart Admin</p>
            <p className="mt-1 break-all text-xs text-slate-400">
              admin@digimart.com
            </p>
            <button
              onClick={logout}
              className="mt-4 w-full rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-5 sm:p-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                DigiMart / {activePage}
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                {activePage === "Overview"
                  ? "Dashboard Overview"
                  : activePage}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Welcome back! Here's your store at a glance.
              </p>
            </div>

            <button
              onClick={() => navigate("/store")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50"
            >
              View Store ↗
            </button>
          </header>

          {/* Overview */}
          {activePage === "Overview" && (
            <>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                        {stat.icon}
                      </span>
                    </div>
                    <p className="mt-4 text-2xl font-bold">{stat.value}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </section>

              <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Sales Overview</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Illustrative weekly sales, not live data
                      </p>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                      This week
                    </span>
                  </div>

                  <div className="mt-8 flex h-48 items-end justify-around gap-3 border-b border-slate-200 px-2">
                    {[38, 62, 48, 85, 56, 95, 72].map((height, index) => (
                      <div
                        key={index}
                        className="flex h-full flex-1 flex-col justify-end"
                      >
                        <div
                          style={{ height: `${height}%` }}
                          className="w-full rounded-t-lg bg-indigo-500 transition hover:bg-indigo-700"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-around text-xs text-slate-500">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <span key={day}>{day}</span>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-bold">Quick Actions</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage your store
                  </p>

                  <button
                    onClick={() => {
                      setActivePage("Products");
                      openAddForm();
                    }}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    + Add New Product
                  </button>

                  <button
                    onClick={() => setActivePage("Orders")}
                    className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50"
                  >
                    View Orders
                  </button>

                  <button
                    onClick={() => setActivePage("Products")}
                    className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50"
                  >
                    Manage Products
                  </button>
                </div>
              </section>

              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Recent Orders</h3>
                  <button
                    onClick={() => setActivePage("Orders")}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View all
                  </button>
                </div>
                <OrdersTable orders={orders.slice(0, 3)} />
              </section>
            </>
          )}

          {/* Products */}
          {activePage === "Products" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">All Products</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {products.length} products in your demo catalog
                  </p>
                </div>
                <button
                  onClick={openAddForm}
                  className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  + Add Product
                </button>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or category..."
                className="mb-6 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 sm:max-w-md"
              />

              {message && (
                <p className="mb-4 text-sm text-emerald-700">{message}</p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg bg-slate-100 object-cover"
                            />
                            <span className="font-semibold">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">{product.category}</td>
                        <td className="px-4 py-4 font-semibold">
                          {money(product.price)}
                        </td>
                        <td className="px-4 py-4">{product.stock}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.stock > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.stock > 0 ? "Active" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditForm(product)}
                              className="font-semibold text-indigo-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="font-semibold text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <p className="py-10 text-center text-slate-500">
                    No products found.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Orders */}
          {activePage === "Orders" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="mb-6 text-lg font-bold">Order Management</h3>
              <OrdersTable orders={orders} />
            </section>
          )}

          {/* Customers */}
          {activePage === "Customers" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold">Customers</h3>
              <p className="mt-2 text-sm text-slate-500">
                This demo shows summary information only. Customer records
                will appear here after connecting your backend.
              </p>
              <div className="mt-6 rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Sample customers</p>
                <p className="mt-2 text-3xl font-bold">186</p>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Add / Edit product form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <form
            onSubmit={handleSaveProduct}
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingId !== null ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <label className="mb-2 block text-sm font-semibold">
              Product Name
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              placeholder="Enter product name"
              className="mb-4 w-full rounded-lg border border-slate-300 p-3"
            />

            <label className="mb-2 block text-sm font-semibold">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="mb-4 w-full rounded-lg border border-slate-300 p-3"
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 p-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 p-3"
                />
              </div>
            </div>

            <label className="mb-2 mt-4 block text-sm font-semibold">
              Product Image URL (optional)
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-slate-300 p-3"
            />

            {message && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                {editingId !== null ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[550px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Order ID</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-4 font-semibold">{order.id}</td>
              <td className="px-4 py-4">{order.customer}</td>
              <td className="px-4 py-4 font-semibold">
                {money(order.total)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-700"
                      : order.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
