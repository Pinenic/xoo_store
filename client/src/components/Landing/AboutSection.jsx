// src/components/AboutSection.jsx
import { Button } from "flowbite-react";
import { ShoppingBag, Store } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          About Us
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We’re making it simple to shop and sell online. Whether you’re here to
          find the best products or to grow your business, we’ve got you covered.
        </p>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buyer Feature */}
          <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Buy with Ease
            </h3>
            <p className="text-gray-600 mb-6">
              Browse thousands of products, compare deals, and check out in just
              a few clicks. Shopping made stress-free and secure.
            </p>
            <Button color="gray" size="sm" outline>
              Learn More
            </Button>
          </div>

          {/* Seller Feature */}
          <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Store className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sell with the Best Experience
            </h3>
            <p className="text-gray-600 mb-6">
              Open your storefront, manage your products, and reach more buyers
              with tools designed to grow your business.
            </p>
            <Button color="gray" size="sm" outline>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
