import React from 'react'
import { Link } from 'react-router-dom';

export default function FeaturesHero() {
  return (
    <section className="relative text-black py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left content */}
        <div className="flex-1 text-center h-full md:text-left my-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Start Your Online Store in Minutes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Create your store, add products, and start selling — no coding or tech skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="start-selling">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition">
              Start Free Trial
            </button>
            </Link>
            <button className="border border-black px-6 py-3 rounded-2xl hover:bg-white hover:text-black transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right content (process steps) */}
        <div className="flex-1 bg-gray-300 bg-opacity-10 rounded-2xl p-6 py-10 shadow-xl backdrop-blur-lg h-72">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">1</span>
              <p>Create your account and set up your store.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">2</span>
              <p>Add products with images, descriptions, and pricing.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">3</span>
              <p>Launch your store and start selling to customers worldwide.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

