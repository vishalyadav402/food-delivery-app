import React from 'react';
import { Home, Search, Receipt } from "@mui/icons-material";
import GridViewIcon from '@mui/icons-material/GridView';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cart from './Cart';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  return (
    <>
    {/* Mobile Footer (Only visible on mobile screens) */}
    <footer className="block md:hidden fixed z-50 bottom-0 left-0 right-0 py-3 bg-purple-dark text-beige-light">
      <div className="flex justify-around items-center">
        {/* Home */}
        <button onClick={() => router.push("/")} className="flex flex-col items-center">
          <Home fontSize="medium" />
          <span className="text-xs">Home</span>
        </button>

        {/* Categories */}
        <button onClick={() => router.push("/categories")} className="flex flex-col items-center">
          <GridViewIcon fontSize="medium" />
          <span className="text-xs">Categories</span>
        </button>

        {/* Search */}
        <button onClick={() => router.push("/search")} className="flex flex-col items-center">
          <Search fontSize="medium" />
          <span className="text-xs">Search</span>
        </button>

        {/* Orders */}
        {/* <button onClick={() => router.push("/account/order")} className="flex flex-col items-center">
          <Receipt fontSize="medium" />
          <span className="text-xs">Orders</span>
        </button> */}

        {/* cart */}
        <Cart/>
        
      </div>
    </footer>

    {/* Main Footer (Hidden on mobile, visible on larger screens) */}
    <footer className="pb-20 md:pb-0 lg:px-[8rem] px-4 text-gray-800 bg-white">
    <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-lg md:text-left">

          {/* all categories */}
          <div className="flex flex-col items-start md:items-start space-y-4">
            <p className='text-lg font-semibold'>All categories</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/baby-care" className="text-md font-medium">Baby Care</a></li>
              <li><a href="/cleaning-essentials" className="text-md font-medium">Cleaning Needs</a></li>
              <li><a href="/personal-care" className="text-md font-medium">Personal Care</a></li>
            </ul>
          </div>

          {/* popular categories */}
          <div className="flex flex-col items-start md:items-start space-y-4">
            <p className='text-lg font-semibold'>Popular categories</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/cleaning-essentials/floor-and-surface-cleaners" className="text-md font-medium">Floor & Surface Cleaners</a></li>
              <li><a href="/personal-care/feminine-care" className="text-md font-medium">Feminine Care</a></li>
              <li><a href="/personal-care/mens-grooming" className="text-md font-medium">Men's Grooming</a></li>
              <li><a href="/personal-care/bathing-soaps" className="text-md font-medium">Bathing Soaps</a></li>
              <li><a href="/personal-care/facial-care" className="text-md font-medium">Facial Care</a></li>
              <li><a href="/personal-care/womens-grooming" className="text-md font-medium">Woomen's Grooming</a></li>
            </ul>
          </div>

          {/* Customer Account */}
          <div className="flex flex-col items-start md:items-start space-y-4">
            <p className='text-lg font-semibold'>Customer Account</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/account/profile" className="text-md font-medium">My Profile</a></li>
              <li><a href="/account/order" className="text-md font-medium">My Order</a></li>
              <li><a href="/account/addresses" className="text-md font-medium">My Addresses</a></li>
            </ul>
          </div>

          {/* help and support */}
          <div className="flex flex-col items-start md:items-start space-y-4">
            <p className='text-lg font-semibold'>Help & Support</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/policies/faq" className="text-md font-medium">FAQs</a></li>
                <li><a href="/policies/privacypolicy" className="text-md font-medium">Privacy Policy</a></li>
                <li><a href="/policies/return" className="text-md font-medium">Pricing, Delivery, Return and Refund Policy</a></li>
                <li><a href="/policies/terms" className="text-md font-medium">Terms and Conditions</a></li>
                <li><a href="/policies/disclaimer" className="text-md font-medium">Disclaimer</a></li>
                <li><a href="/policies/about" className="text-md font-medium">About Us</a></li>
              </ul>
          </div>
          {/* contact us */}
          <div className="flex flex-col items-start md:items-start space-y-4">
          <p className='text-lg font-semibold'>Contact Us</p>
            <ul className="space-y-2 text-sm">
              <li><a href="https://wa.link/qsk9fu" className="text-md font-medium">WhatsApp us: 9506280968</a></li>
              <li><a href="tel:+919506280968" className="text-md font-medium">Call us: 9506280968</a></li>
              <li><span className='text-md font-medium'>8:00 AM to 8:00 PM, 365 days</span></li>
              <li className='mt-4 text-md font-medium'><span>You may encounter any bugs, glitches, lack of functionality, delayed deliveries, billing errors or other problems on the website.</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center flex self-center text-sm text-gray-600 py-4 px-0 mt-4 gap-4 border-t border-gray-400">
          <a href="/" className="flex items-center text-2xl font-bold">
                <Image src="/icon.png" height={50} width={50} className="text-gray-700" alt="logo"></Image>
            </a>
            <span className='self-center'>© {currentYear} All rights reserved. KiranaNeeds Ltd.</span>
        </p>
    </div>
    </footer>
  </>
  );
}

export default Footer;
