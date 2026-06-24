"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showFooter, setShowFooter] = useState(false);

  return (
    <>

      {/* Main Footer */}
      <footer className="pb-5 md:pb-0 lg:px-[8rem] px-4 text-gray-800 bg-white border-t border-gray-200">

        {/* Toggle bar — visible on mobile only */}
        <div
          onClick={() => setShowFooter((prev) => !prev)}
          className="md:hidden flex items-center justify-between px-2 py-3 cursor-pointer"
        >
          <span className="text-sm text-gray-600">
            Rural India's trusted app for daily essentials — Kirananeeds
          </span>
          <span className="text-xl font-bold text-gray-600">
            {showFooter ? "−" : "+"}
          </span>
        </div>

        {/* Footer content — always visible on desktop, toggled on mobile */}
        <div className={`${showFooter ? "block" : "hidden"} md:block`}>
          <div className="container mx-auto py-8 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-lg md:text-left">

              {/* All categories */}
              <div className="flex flex-col items-start space-y-4">
                <span className="text-lg font-semibold">All categories</span>
                <ul className="space-y-2 text-sm">
                  <li><a href="/baby-care" className="font-medium">Baby Care</a></li>
                  <li><a href="/cleaning-essentials" className="font-medium">Cleaning Needs</a></li>
                  <li><a href="/personal-care" className="font-medium">Personal Care</a></li>
                </ul>
              </div>

              {/* Popular categories */}
              <div className="flex flex-col items-start space-y-4">
                <span className="text-lg font-semibold">Popular categories</span>
                <ul className="space-y-2 text-sm">
                  <li><a href="/cleaning-essentials/floor-and-surface-cleaners" className="font-medium">Floor & Surface Cleaners</a></li>
                  <li><a href="/personal-care/feminine-care" className="font-medium">Feminine Care</a></li>
                  <li><a href="/personal-care/mens-grooming" className="font-medium">Men's Grooming</a></li>
                  <li><a href="/personal-care/bathing-soaps" className="font-medium">Bathing Soaps</a></li>
                  <li><a href="/personal-care/facial-care" className="font-medium">Facial Care</a></li>
                  <li><a href="/personal-care/womens-grooming" className="font-medium">Women's Grooming</a></li>
                </ul>
              </div>

              {/* Customer Account */}
              <div className="flex flex-col items-start space-y-4">
                <span className="text-lg font-semibold">Customer Account</span>
                <ul className="space-y-2 text-sm">
                  <li><a href="/account/profile" className="font-medium">My Profile</a></li>
                  <li><a href="/account/order" className="font-medium">My Order</a></li>
                  <li><a href="/account/addresses" className="font-medium">My Addresses</a></li>
                </ul>
              </div>

              {/* Help & Support */}
              <div className="flex flex-col items-start space-y-4">
                <span className="text-lg font-semibold">Help & Support</span>
                <ul className="space-y-2 text-sm">
                  <li><a href="/policies/faq" className="font-medium">FAQs</a></li>
                  <li><a href="/policies/privacypolicy" className="font-medium">Privacy Policy</a></li>
                  <li><a href="/policies/return" className="font-medium">Pricing, Delivery, Return and Refund Policy</a></li>
                  <li><a href="/policies/terms" className="font-medium">Terms and Conditions</a></li>
                  <li><a href="/policies/disclaimer" className="font-medium">Disclaimer</a></li>
                  <li><a href="/policies/about" className="font-medium">About Us</a></li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="flex flex-col items-start space-y-4">
                <span className="text-lg font-semibold">Contact Us</span>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://wa.link/qsk9fu" className="font-medium">WhatsApp us: 9506280968</a></li>
                  <li><a href="tel:+919506280968" className="font-medium">Call us: 9506280968</a></li>
                  <li><span className="font-medium">8:00 AM to 8:00 PM, 365 days</span></li>
                  <li className="mt-4 font-medium text-sm">You may encounter any bugs, glitches, lack of functionality, delayed deliveries, billing errors or other problems on the website.</li>
                </ul>
              </div>
            </div>

            {/* Copyright — div not p, avoids hydration error */}
            <div className="flex items-center text-sm text-gray-600 py-4 mt-4 gap-4 border-t border-gray-400">
              <a href="/" className="flex items-center">
                <Image src="/icon.png" height={50} width={50} className="text-gray-700" alt="logo" />
              </a>
              <span>© {currentYear} All rights reserved. KiranaNeeds Ltd.</span>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;