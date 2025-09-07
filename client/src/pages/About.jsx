// src/pages/AboutPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function About() {
  const { hash } = useLocation();
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate()

  // Handle scrolling to sections
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  // Show "Back to Top" after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-20">
      {/* Buying Section */}
      <section id="buying" className="scroll-mt-20">
        <h2 className="text-3xl font-bold mb-4">Buy with Ease</h2>
        <p className="text-gray-600 mb-6">
          Discover a wide range of products at your fingertips, with secure
          payment and fast delivery.
        </p>
        <button onClick={() => navigate("/marketplace")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start Shopping
        </button>
      </section>

      {/* Selling Section */}
      <section id="selling" className="scroll-mt-20">
        <h2 className="text-3xl font-bold mb-4">Sell with the Best Experience</h2>
        <p className="text-gray-600 mb-6">
          Open your store and reach thousands of buyers. Manage products and
          track sales with ease.
        </p>
        <button onClick={() => navigate("/features")}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Open Your Store
        </button>
      </section>

      {/* Back to Top button */}
      {showButton && (
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="fixed bottom-6 right-6 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition"
        >
          ↑
        </button>
      )}
    </div>
  );
}
