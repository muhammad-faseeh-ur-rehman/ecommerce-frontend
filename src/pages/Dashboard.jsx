
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  Menu,
  Store,
  TrendingUp,
  IndianRupee,
} from "lucide-react";
import productsData from "../data/products";
const categories = ["Fashion", "Electronics", "Accessories"];
const money = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
function EmptyState({ title, message }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <Package className="mx-auto mb-4 text-gray-400" size={40} />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
}
export default function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Overview");
  const [products, setProducts] = useState(() =>
    productsData.map((product) => ({
      ...product,
      stock: product.stock ?? 10,
    }))
  );

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const emptyForm = {
    name: "",
    category: "Fashion",
    price: "",
    rating: "4.5",
    stock: "10",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }, [products, search]);

  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingCart },
    { name: "Customers", icon: Users },
  ];

  function openAddProduct() {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditProduct(product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating ?? 4.5),
      stock: String(product.stock ?? 0),
      image: product.image || "",
    });
    setShowModal(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function saveProduct(event) {
    event.preventDefault();

    const productDetails = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      rating: Number(form.rating),
      stock: Number(form.stock),
      image: form.image.trim(),
    };

    if (
      !productDetails.name ||
      !productDetails.image ||
      !Number.isFinite(productDetails.price) ||
      productDetails.price < 0 ||
      !Number.isFinite(productDetails.stock) ||
      productDetails.stock < 0 ||
      !Number.isFinite(productDetails.rating) ||
      productDetails.rating < 0 ||
      productDetails.rating > 5
    ) {
      alert("Please enter valid product details and an image URL.");
      return;
    }

    if (editingProduct) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productDetails }
            : product
        )
      );
    } else {
      setProducts((previous) => [
        ...previous,
        {
          id: `product-${Date.now()}`,
          ...productDetails,
        },
      ]);
    }

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  function deleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product from the current dashboard session?"
    );

    if (!confirmed) return;

    setProducts((previous) =>
      previous.filter((product) => product.id !== productId)
    );
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("digimartDemoAdmin");
    navigate("/admin-login", { replace: true });
  }

  function changePage(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="rounded-xl bg-indigo-600 p-2 text-slate-950">
            <Store size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">DigiMart</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = activePage === item.name;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => changePage(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  selected
                    ? "bg-indigo-600 font-semibold text-slate-950"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-lg bg-white/5 p-3">
            <p className="font-medium">DigiMart Admin</p>
            <p className="mt-1 text-xs text-gray-400">Administrator</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {activePage}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                DigiMart administration
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Admin session
          </div>
        </header>

        <div className="p-4 sm:p-8">
          {activePage === "Overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your dashboard is ready. Live business statistics will be
                  available when the backend is connected.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    title: "Total Revenue",
                    icon: IndianRupee,
                    message: "No sales data available yet",
                  },
                  {
                    title: "Total Orders",
                    icon: ShoppingCart,
                    message: "No order data available yet",
                  },
                  {
                    title: "Total Customers",
                    icon: Users,
                    message: "No customer data available yet",
                  },
                ].map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-600">
                          {card.title}
                        </p>
                        <div className="rounded-lg bg-indigo-200 p-3 text-indigo-600">
                          <Icon size={21} />
                        </div>
                      </div>
                      <p className="mt-5 text-sm text-gray-400">
                        {card.message}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-indigo-600" size={24} />
                  <div>
                    <h3 className="font-semibold">Sales Analytics</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A sales chart will appear when real order data is
                      available.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
                  No sales data available yet
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      changePage("Products");
                      openAddProduct();
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-200 px-4 py-3 font-semibold text-slate-950 hover:bg-indigo-600"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>

                  <button
                    type="button"
                    onClick={() => changePage("Products")}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-200 px-4 py-3 font-semibold text-slate-950 hover:bg-indigo-600"
                  >
                    <Package size={18} />
                    Manage Products
                  </button>

                  <button
                    type="button"
                    onClick={() => changePage("Orders")}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-200 px-4 py-3 font-semibold text-slate-950 hover:bg-indigo-600"
                  >
                    <ShoppingCart size={18} />
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePage === "Products" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold">Product Management</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage the products shown in your current dashboard session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddProduct}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-200 px-4 py-3 font-semibold text-slate-950 hover:bg-indigo-600"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <Search size={20} className="text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products or categories..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Product</th>
                        <th className="px-5 py-4 font-semibold">Category</th>
                        <th className="px-5 py-4 font-semibold">Price</th>
                        <th className="px-5 py-4 font-semibold">Rating</th>
                        <th className="px-5 py-4 font-semibold">Stock</th>
                        <th className="px-5 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                              />
                              <span className="font-semibold text-gray-800">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            {money(product.price)}
                          </td>
                          <td className="px-5 py-4 text-amber-500">
                            ★ {product.rating}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                product.stock > 0
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                title="Edit product"
                                onClick={() => openEditProduct(product)}
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                type="button"
                                title="Delete product"
                                onClick={() => deleteProduct(product.id)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-gray-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products.
                Changes are temporary and will reset when you refresh.
              </p>
            </div>
          )}

          {activePage === "Orders" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Order Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This section is ready for integration with your order API.
                </p>
              </div>
              <EmptyState
                title="No Orders Yet"
                message="No order records are connected yet. Customer orders will appear here after order storage and the backend API are implemented."
              />
            </div>
          )}

          {activePage === "Customers" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Customer Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This section is ready for integration with your customer API.
                </p>
              </div>
              <EmptyState
                title="No Customers Yet"
                message="No customer records are displayed. Registered customer data will appear here when the backend integration is implemented."
              />
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the product details below.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Product Name
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Price (Rs.)
                  </label>
                  <input
                    required
                    min="0"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Stock Quantity
                  </label>
                  <input
                    required
                    min="0"
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Rating (0 - 5)
                </label>
                <input
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Image URL
                </label>
                <input
                  required
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-200 hover:bg-indigo-600 px-4 py-3 font-semibold text-slate-950 "
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
