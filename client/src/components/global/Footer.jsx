// src/components/Footer.jsx
import { Footer } from "flowbite-react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function MainFooter() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="w-full max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand / About */}
          <div>
            <h2 className="text-xl font-bold mb-2">Pine Stores</h2>
            <p className="text-gray-400 text-sm">
              Your trusted marketplace for buying and selling online. Shop with
              ease, sell with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/marketplace" className="hover:text-white">Shop</a></li>
              <li><a href="/features" className="hover:text-white">Sell</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-400"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* Bottom bar */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Pine Stores. All rights reserved.
        </div>
      </div>
    </div>
  );
}
