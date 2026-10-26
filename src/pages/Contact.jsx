
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <main className="bg-gray-50">
      <section className="bg-gradient-to-br from-indigo-50 to-white px-6 py-16 text-center">
        <p className="font-semibold text-indigo-600">WE'RE HERE TO HELP</p>
        <h1 className="mt-3 text-4xl font-extrabold text-gray-950">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
          Have a question about a product or your shopping experience?
          Send us a message using the form below.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-3">
        <div className="space-y-5">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <Mail className="text-indigo-600" size={28} />
            <h2 className="mt-4 font-bold text-gray-900">Email</h2>
            <p className="mt-2 text-sm text-gray-600">
              Use your business email here once configured.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <Phone className="text-indigo-600" size={28} />
            <h2 className="mt-4 font-bold text-gray-900">Phone</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add your customer support phone number.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <MapPin className="text-indigo-600" size={28} />
            <h2 className="mt-4 font-bold text-gray-900">Location</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add your business address if you have one.
            </p>
          </article>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-9 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-950">Send Us a Message</h2>
          <p className="mt-2 text-gray-500">Fill out the form and we'll be ready to help.</p>

          {submitted && (
            <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">
              Form submitted in this demo. Connect a backend or email service to deliver your message.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-indigo-500"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Subject
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
                rows={5}
                placeholder="Write your message here..."
                className="mt-2 w-full resize-y rounded-xl border border-gray-200 p-3 outline-none focus:border-indigo-500"
              />
            </label>

            <button className="rounded-full bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700">
              Send Message <Send className="ml-2 inline" size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
