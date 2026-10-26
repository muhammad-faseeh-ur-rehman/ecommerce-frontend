
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck, ShieldCheck, Headphones, RefreshCw, ArrowRight, Star,
  Shirt, Watch, ShoppingBag
} from "lucide-react";
import ProductList from "../components/ProductList";

const categories = [
  { name: "Fashion", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { name: "Electronics", icon: Watch, color: "bg-blue-100 text-blue-600" },
  { name: "Accessories", icon: ShoppingBag, color: "bg-amber-100 text-amber-600" },
];

const benefits = [
  { icon: Truck, title: "Fast Delivery", text: "Convenient delivery for your orders." },
  { icon: ShieldCheck, title: "Secure Shopping", text: "Shop with confidence and care." },
  { icon: RefreshCw, title: "Easy Returns", text: "Clear and simple return policies." },
  { icon: Headphones, title: "Customer Support", text: "We're here to help with questions." },
];

const reviews = [
  { name: "Ayesha K.", text: "A clean and easy shopping experience.", rating: 5 },
  { name: "Ali R.", text: "Good selection and a simple checkout layout.", rating: 5 },
  { name: "Sara M.", text: "I like how easy it is to browse categories.", rating: 4 },
];

export default function Home({
  products,
  onAddToCart,
  category,
  setCategory,
}) {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  function handleNewsletter(e) {
    e.preventDefault();
    setNewsletterMessage(
      "Thanks for subscribing! Connect an email service to receive real subscriptions."
    );
    setEmail("");
  }

  return (
    <main>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              Welcome to DigiMart
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Discover products you'll{" "}
              <span className="text-indigo-600">love.</span>
            </h1>
            <p className="mt-5 max-w-lg leading-7 text-gray-600">
              Explore fashion, electronics and everyday accessories in one
              place. Find something that fits your style and your needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Shop Products <ArrowRight className="ml-2 inline" size={18} />
              </a>
              <Link
                to="/about"
                className="rounded-full border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-800 hover:bg-gray-50"
              >
                Our Story
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-600">
              <span>✓ Curated products</span>
              <span>✓ Easy browsing</span>
              <span>✓ Customer-focused</span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
              alt="Modern retail store"
              className="h-80 w-full rounded-3xl object-cover shadow-xl md:h-[440px]"
            />
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white p-4 shadow-lg sm:left-4">
              <p className="font-bold text-gray-900">Your next favorite find</p>
              <p className="mt-1 text-sm text-gray-500">Start exploring today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-indigo-600">Browse collections</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-950">Shop by Category</h2>
          </div>
          <a href="#products" className="font-semibold text-indigo-600">
            View products →
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {categories.map(({ name, icon: Icon, color }) => (
            <button
              key={name}
              onClick={() => {
                setCategory(name);
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={`rounded-2xl p-4 ${color}`}>
                <Icon size={30} />
              </span>
              <span>
                <span className="block text-lg font-bold text-gray-900">{name}</span>
                <span className="mt-1 block text-sm text-gray-500">Explore collection</span>
              </span>
              <ArrowRight className="ml-auto text-gray-400 transition group-hover:text-indigo-600" />
            </button>
          ))}
        </div>
      </section>

      {/* Promotional banner */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gray-950 p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-indigo-300">YOUR NEXT DISCOVERY</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Great finds start here.
            </h2>
            <p className="mt-3 max-w-xl text-gray-300">
              Browse our latest collection and discover products for everyday life.
            </p>
          </div>
          <a href="#products" className="shrink-0 rounded-full bg-white px-7 py-3 font-bold text-gray-950 hover:bg-indigo-100">
            Explore Now
          </a>
        </div>
      </section>

      {/* Existing products */}
      <section id="products" className="scroll-mt-24">
        <ProductList
          products={products}
          onAddToCart={onAddToCart}
          category={category}
          setCategory={setCategory}
        />
      </section>

      {/* Store benefits */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="font-semibold text-indigo-600">The DigiMart difference</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-950">
              Shopping made simpler
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <Icon size={32} className="mx-auto text-indigo-600" />
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer feedback sample */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 text-center">
          <p className="font-semibold text-indigo-600">Customer feedback</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-950">What shoppers value</h2>
          <p className="mt-3 text-sm text-gray-500">
            Sample reviews for layout demonstration. Replace with genuine customer reviews.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="my-4 leading-7 text-gray-600">"{review.text}"</p>
              <p className="font-bold text-gray-900">{review.name}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-indigo-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold">Stay in the loop</h2>
          <p className="mt-3 text-indigo-100">
            Subscribe for updates about new products and special offers.
          </p>
          <form onSubmit={handleNewsletter} className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-gray-900 outline-none"
            />
            <button className="rounded-full bg-gray-950 px-7 py-3 font-semibold hover:bg-gray-800">
              Subscribe
            </button>
          </form>
          {newsletterMessage && <p role="status" className="mt-4 text-sm">{newsletterMessage}</p>}
        </div>
      </section>
    </main>
  );
}
