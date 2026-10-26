import ProductCard from "./ProductCard";
export default function ProductList({
  products,
  onAddToCart,
  category,
  setCategory,
}) {
  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Accessories",
  ];
  return (
    <section id="products" className="mx-auto max-w-7xl px-5 py-12">
      <h2 className="text-3xl font-bold">Our Products</h2>
      <p className="mt-2 text-gray-500">
        Find the right products for you.
      </p>
      <div className="my-6 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full border px-5 py-2 ${
              category === item
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-gray-500">
          No products found. Try another search.
        </p>
      )}
    </section>
  );
}
