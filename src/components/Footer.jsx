import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-2xl font-extrabold text-white">
            DigiMart<span className="text-indigo-400">.</span>
          </Link>
          <p className="mt-4 leading-7 text-gray-400">
            Discover quality products, everyday essentials, and great finds
            in one convenient place.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Quick Links</h3>
          <div className="flex flex-col gap-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/contact" className="hover:text-white">Contact Us</Link>
            <Link to="/faqs" className="hover:text-white">FAQs</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Customer Service</h3>
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="hover:text-white">Help Center</Link>
            <Link to="/faqs" className="hover:text-white">Shipping Questions</Link>
            <Link to="/faqs" className="hover:text-white">Returns & Refunds</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Get in Touch</h3>
          <p className="mb-4 flex items-center gap-3">
            <Mail size={18} className="text-indigo-400" />
            <span>Contact us through our form</span>
          </p>
          <p className="mb-4 flex items-center gap-3">
            <Phone size={18} className="text-indigo-400" />
            <span>Customer Support</span>
          </p>
          <Link
            to="/contact"
            className="inline-block rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white transition hover:bg-indigo-700"
          >
            Send a Message
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DigiMart. All rights reserved.
      </div>
    </footer>
  );
}
