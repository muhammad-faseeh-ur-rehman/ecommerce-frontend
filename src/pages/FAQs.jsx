
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "How do I place an order?",
    answer: "Browse the products, select Add to Cart, and review your cart. A complete order and checkout flow still needs to be implemented.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "Payment methods have not been configured in this frontend demo. You can add suitable payment options when implementing checkout.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery times depend on your delivery locations and shipping arrangements. Publish your actual shipping policy here before launching.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Return and exchange rules depend on your store policy. Add your eligibility requirements, deadlines and process here.",
  },
  {
    question: "How can I contact customer support?",
    answer: "Visit our Contact Us page and fill in the form. In this demo, the form does not send messages until a backend or email service is connected.",
  },
  {
    question: "Can I change or cancel an order?",
    answer: "Order changes and cancellations are not implemented yet. You can add this feature with order management on the backend.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-50 to-white px-6 py-16 text-center">
        <p className="font-semibold text-indigo-600">HELP CENTER</p>
        <h1 className="mt-3 text-4xl font-extrabold text-gray-950">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
          Find answers to common questions about shopping with DigiMart.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {item.question}
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180 text-indigo-600" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 leading-7 text-gray-600">
                    {item.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-indigo-50 p-7 text-center">
          <h2 className="text-xl font-bold text-gray-950">Still need help?</h2>
          <p className="mt-2 text-gray-600">Send us your question through our contact page.</p>
          <Link to="/contact" className="mt-5 inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
