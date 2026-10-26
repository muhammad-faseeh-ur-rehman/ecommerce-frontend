
import { Link } from "react-router-dom";
import { Heart, Target, Users, ShieldCheck } from "lucide-react";

const values = [
  { icon: Heart, title: "Customer First", text: "We design our shopping experience around customer needs." },
  { icon: ShieldCheck, title: "Trust & Clarity", text: "We aim to make product details and policies easy to understand." },
  { icon: Target, title: "Quality Focus", text: "We want to help shoppers discover useful, thoughtfully selected products." },
  { icon: Users, title: "Better Experience", text: "We continuously look for ways to make browsing easier." },
];

export default function About() {
  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-50 to-white px-6 py-20 text-center">
        <p className="font-semibold text-indigo-600">ABOUT DIGIMART</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold text-gray-950 sm:text-5xl">
          Shopping should feel simple.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
          DigiMart is an online shopping project built around discovering
          everyday products through a clean, convenient shopping experience.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85"
          alt="Customer shopping online"
          className="h-80 w-full rounded-3xl object-cover"
        />
        <div>
          <p className="font-semibold text-indigo-600">Our Story</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950">A convenient place to discover more</h2>
          <p className="mt-5 leading-7 text-gray-600">
            Our goal is to bring product categories together in one easy-to-use
            store. From browsing collections to adding items to a cart, every
            part of DigiMart is designed to feel straightforward.
          </p>
          <p className="mt-4 leading-7 text-gray-600">
            As the project grows, our focus is on useful features, responsive
            design, clear product information and reliable customer support.
          </p>
          <Link to="/" className="mt-7 inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Explore Our Store
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-950">What We Stand For</h2>
            <p className="mt-3 text-gray-500">The principles behind our shopping experience.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                <Icon size={32} className="text-indigo-600" />
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-2 leading-6 text-gray-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-950">Have a question?</h2>
        <p className="mt-3 text-gray-600">We'd be happy to hear from you.</p>
        <Link to="/contact" className="mt-6 inline-block rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700">
          Contact Us
        </Link>
      </section>
    </main>
  );
}
