import { ShoppingCart } from "lucide-react";
export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.category}
        </p>
        <h3 className="mt-1 text-lg font-semibold">
          {product.name}
        </h3>
        <p className="mt-2 text-amber-500">
          ★ {product.rating}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-bold">
            Rs. {product.price.toLocaleString("en-PK")}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-orange-500"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
