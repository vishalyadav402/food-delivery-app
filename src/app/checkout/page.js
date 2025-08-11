"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function formatOrderDate(date) {
    const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    return `${date.toLocaleDateString("en-US", optionsDate)}, ${date.toLocaleTimeString("en-US", optionsTime)}`;
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
      <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-center text-yellow-400 tracking-wide">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-yellow-400 flex items-center justify-between">
                Your Order
                <span className="text-sm text-gray-400 font-normal">
                  {cart.length} items
                </span>
              </h2>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-700 pb-3"
                  >
                    <span className="text-lg">
                      {item.name}{" "}
                      <span className="text-yellow-400 font-medium">× {item.qty}</span>
                    </span>
                    <span className="font-semibold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right text-2xl font-bold text-yellow-400">
                Total: ₹{cart.reduce((sum, i) => sum + i.price * i.qty, 0)}
              </div>
            </section>

            {/* Delivery Form */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-yellow-400">
                Delivery Details
              </h2>

              <label htmlFor="name" className="block mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 mb-5 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <label htmlFor="address" className="block mb-2 font-medium">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="123 Main Street, City, State, ZIP"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 mb-5 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />

              <label htmlFor="phone" className="block mb-2 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mb-7 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <button
                onClick={handleOrder}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded-full shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
              >
                Confirm Order
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-8 rounded-2xl max-w-sm w-full text-center shadow-lg border border-yellow-500 animate-fadeIn">
            <div className="text-yellow-400 text-5xl mb-4">✔</div>
            <h2 className="text-3xl font-bold mb-3 text-yellow-400">
              Order Confirmed!
            </h2>
            <p className="mb-6 text-gray-300">
              Thank you for ordering with us, <span className="uppercase">{formData.name}</span>.
            </p>
            <button
              onClick={closeModal}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
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
