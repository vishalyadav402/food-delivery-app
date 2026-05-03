"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const page = () => {
  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About Us
        </h1>

        {/* Introduction */}
        <p className="text-gray-700 mb-6">
          Welcome to <strong>kirananeeds</strong>! At kirananeeds, we are revolutionizing the way you shop for groceries and daily essentials. Our mission is to provide fast, reliable, and convenient delivery services, ensuring that you get what you need, when you need it.
        </p>

        {/* Our Story */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Story
          </h2>
          <p className="text-gray-700">
            Founded in <strong>2025</strong>, kirananeeds was born out of a simple idea: to make grocery shopping effortless and time-efficient. We understand the challenges of busy lifestyles, and we’re here to simplify your life by bringing the store to your doorstep.
          </p>
        </div>

        {/* Our Mission */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700">
            To deliver high-quality products with unmatched speed and exceptional customer service. We aim to become your trusted partner for all your daily needs.
          </p>
        </div>

        {/* Our Values */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Values
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
            <li><strong>Speed and Efficiency:</strong> We deliver within almost 60-90 minutes.</li>
            <li><strong>Quality Assurance:</strong> Only the best products make it to your cart.</li>
            <li><strong>Sustainability:</strong> We are committed to eco-friendly practices.</li>
          </ul>
        </div>

        {/* Why Choose Us? */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Fast and reliable delivery.</li>
            <li>Wide range of products.</li>
            <li>Easy-to-use web portal.</li>
            <li>Dedicated customer support.</li>
          </ul>
        </div>

        {/* Join Us on Our Journey */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join Us on Our Journey
          </h2>
          <p className="text-gray-700">
            We are constantly evolving to serve you better. Thank you for choosing <strong>kirananeeds</strong> – your partner in convenience and quality.
          </p>
        </div>
      </div>
    </ClientLayout>
  );
};

export default page;


// seo dynamic meta
// export const metadata = {
//   title: "Quick Delivery of Daily Essentials | Groceries, Personal Care & More | VegaCart",
//   other: {
//     title: [
//       "VegaCart – Daily Essentials Delivered Fast | Groceries, Home & Personal Products"
//     ]
//   },
//   description:
//     "Get your daily essentials delivered quickly with VegaCart. Shop groceries, home care, personal care, and more with instant delivery in your city. Reliable service across multiple pincodes in Jaunpur City",
//   keywords: [
//     "Daily essentials delivery",
//     "Quick grocery delivery",
//     "Personal care products online",
//     "Instant delivery service",
//     "VegaCart delivery",
//     "Home essentials fast delivery",
//     "Grocery delivery in Jaunpur",
//     "Online convenience store",
//     "Fastest delivery app",
//     "Daily needs at your doorstep"
//   ],
// };

