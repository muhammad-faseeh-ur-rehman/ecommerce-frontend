export default function Hero() {
  return (
    <section className="bg-gray-900 px-5 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-semibold uppercase tracking-widest text-orange-400">
          Welcome to DigiMart
        </p>
        <h1 className="max-w-2xl text-4xl font-black sm:text-6xl">
          Find Your Next Favorite Thing.
        </h1>
        <p className="mt-5 max-w-xl text-gray-300">
          Discover fashion, electronics and everyday essentials
          at great prices.
        </p>
        <a
          href="#products"
          className="mt-7 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-600"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
