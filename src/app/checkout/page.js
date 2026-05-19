"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { calculateDelivery } from "../utils/deliveryConfig";
import toast from "react-hot-toast";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const router = useRouter();

  // 🛒 Load cart
  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) setCart(JSON.parse(data));
  }, []);

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🚚 Delivery
  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.charge || 0);

  // 📍 Detect location (auto fill address)
  const detectLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      toast.error("Geolocation not supported");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const address =
            data.display_name || "Your Location";

          setForm((prev) => ({
            ...prev,
            address,
          }));
        } catch {
          console.error("Failed to fetch address");
          toast.error("Failed to fetch address");
        }

        setLoadingLocation(false);
      },
      () => {
        console.error("Permission denied");
        toast.error("Permission denied")
        setLoadingLocation(false);
      }
    );
  };

  // 🧾 Place Order
  const handleOrder = async () => {
    setLoading(true);
    if (!form.name || !form.phone || !form.address) {
      console.error("Please fill all fields");
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    if (!delivery.allowed) {
      console.message(delivery.message);
      toast.success(delivery.message);
      return;
    }

    const orderId = "ORD" + Date.now().toString().slice(-6);

    const itemsText = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} (${item.variant}) - ₹${item.price} x ${item.qty}`
      )
      .join("\n");

    const message = `*New Order Received @KiranaNeeds.com*

Order ID: ${orderId}

Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}

Items:
${itemsText}

Total: ₹${finalTotal}`;

    const { error } = await supabase.from("orders").insert([
      {
        order_id: orderId,
        name: form.name,
        phone: form.phone,
        address: form.address,
        items: cart,
        total: finalTotal,
      },
    ]);

    if (error) {
      console.error(error);
      console.error("Error saving order");
      toast.error("Error saving order");
      return;
    }

    // WhatsApp
    window.open(
      `https://wa.me/919506280968?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    localStorage.removeItem("cart");

    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <>
      <Header />

      <div className="max-w-2xl mt-20 min-h-[79vh] mx-auto p-4 bg-white text-black">

        <h1 className="text-2xl font-bold mt-5 md:mt-10 mb-4">
          Checkout
        </h1>

        {/* 🧾 FORM */}
        <div className="space-y-3">

          <input
            placeholder="Your Name"
            className="w-full text-sm text-gray-500 capitalize p-2 border rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            className="w-full text-sm text-gray-500 p-2 border rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          {/* 📍 Address + Auto detect */}
          <div className="flex gap-2">
            <textarea
              placeholder="Enter full address"
              className="w-full h-20 p-2 leading-4 border text-sm text-gray-500 rounded"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <button
              onClick={detectLocation}
              className="bg-blue-500 text-white px-3 rounded text-sm"
            >
              {loadingLocation ? "Loading..." : <span className="flex flex-row">📍Detect Location..</span>}
            </button>
          </div>
        </div>

        {/* 🧾 ORDER SUMMARY */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Order Summary
          </h2>

          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-500 py-1">
              <span>
                {item.name} ({item.variant}) x {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-2 text-gray-300" />

          <div className="flex justify-between">
            <span>Items Total</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>
              {delivery.charge === 0
                ? <span className="text-green-600">FREE 🎉</span>
                : `₹${delivery.charge}`}
            </span>
          </div>

          {!delivery.allowed && (
            <p className="text-red-500 text-sm mt-1">
              {delivery.message}
            </p>
          )}

          <hr className="my-2 text-gray-300" />

          <div className="flex justify-between font-bold">
            <span>Total Payable</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>

        {/* 🚀 BUTTON */}
        <button
          onClick={handleOrder}
          disabled={!delivery.allowed}
          className={`w-full mt-6 py-3 rounded ${
            delivery.allowed
              ? "bg-green-600 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {delivery.allowed
            ? <span className="font-semibold text-xl">{loading? "Hold On..":"Place Order on WhatsApp"}</span>
            : "Minimum Order Required"}
        </button>
      </div>

      <Footer />
    </>
  );
}