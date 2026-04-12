"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

const router = useRouter();

  // Load cart
  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) setCart(JSON.parse(data));
  }, []);

  // Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );


  // Place Order
  const handleOrder = async () => {
  if (!form.name || !form.phone || !form.address) {
    alert("Please fill all fields");
    return;
  }

  // ✅ DEFINE FIRST
  const orderId = "ORD" + Date.now().toString().slice(-6);

  // ✅ Build items text
  const itemsText = cart
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.variant}) - ₹${item.price} x ${item.qty}`
    )
    .join("\n");

  // ✅ Now safe to use
  const message = `🛒 *New Order - KiranaNeeds*

Order ID: ${orderId}

Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}

Items:
${itemsText}

Total: ₹${total}`;

  // ✅ Save to Supabase
  const { error } = await supabase.from("orders").insert([
    {
      order_id: orderId,
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: cart,
      total: total,
    },
  ]);

  if (error) {
    console.error(error);
    alert("Error saving order");
    return;
  }

  // ✅ WhatsApp
  window.open(
    `https://wa.me/919506280968?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  localStorage.removeItem("cart");

  // ✅ Redirect
  router.push(`/order-success?id=${orderId}`);
};

  return (
    <>
    <Header/>
    <div className="max-w-2xl min-h-[79vh] mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mt-15 mb-4">Checkout</h1>

      {/* Form */}
      <div className="space-y-3">
        <input
          placeholder="Your Name"
          className="w-full p-2 border"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone Number"
          className="w-full p-2 border"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <textarea
          placeholder="Address"
          className="w-full p-2 border"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
      </div>

      {/* Order Summary */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          Order Summary
        </h2>

        {cart.map((item, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>
              {item.name} ({item.variant}) x {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleOrder}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded"
      >
        Place Order on WhatsApp
      </button>
    </div>
    <Footer/>
    </>
  );
}