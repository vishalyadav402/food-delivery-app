"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "../components/Footer";
import Header from "../components/Header";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push("/"); // Redirect if cart empty
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function formatOrderDate(date) {
    const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    
    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    
    return `${formattedDate}, ${formattedTime}`;
  }

  const handleOrder = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all fields");
      return;
    }

    const newOrder = {
      items: cart,
      deliveryDetails: formData,
      orderDate: formatOrderDate(new Date()),
    };

    console.log("New Order:", newOrder);

    // Show confirmation modal instead of alert
    setOrderConfirmed(true);
  };

  const closeModal = () => {
    setOrderConfirmed(false);
    localStorage.removeItem("cart");
    router.push("/");
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-12 px-6 sm:px-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-yellow-600">
          Checkout
        </h1>

        {/* Order Summary */}
        <section className="bg-white/10 p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Your Order
          </h2>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-gray-600 py-3 text-lg"
            >
              <span>
                {item.name} <span className="text-yellow-400">× {item.qty}</span>
              </span>
              <span className="font-semibold">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="mt-6 text-right text-2xl font-bold text-yellow-500">
            Total: ₹{cart.reduce((sum, i) => sum + i.price * i.qty, 0)}
          </div>
        </section>

        {/* Delivery Form */}
        <section className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            Delivery Details
          </h2>

          <label htmlFor="name" className="block mb-1 font-medium text-yellow-500">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-5 rounded-md border border-yellow-500 bg-transparent text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <label htmlFor="address" className="block mb-1 font-medium text-yellow-500">
            Delivery Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="123 Main Street, City, State, ZIP"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 mb-5 rounded-md border border-yellow-500 bg-transparent text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          />

          <label htmlFor="phone" className="block mb-1 font-medium text-yellow-500">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 mb-7 rounded-md border border-yellow-500 bg-transparent text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            onClick={handleOrder}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          >
            Confirm Order
          </button>
        </section>
      </div>

      {/* Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-sm text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              Order Confirmed!
            </h2>
            <p className="mb-6 text-white">
              Thank you for placing order with us, {formData.name}.
            </p>
            <button
              onClick={closeModal}
              className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
