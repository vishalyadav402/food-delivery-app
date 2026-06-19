"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import { useLocation } from "../context/LocationContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { calculateDelivery } from "../utils/deliveryConfig";
import { MapPin, User, Phone, Banknote } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { location } = useLocation();

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

  // 📍 Prefill address from LocationContext if available
  useEffect(() => {
    if (location && !form.address) {
      setForm((prev) => ({ ...prev, address: location }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // 💰 Total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🚚 Delivery
  const delivery = calculateDelivery(total);
  const finalTotal = total + (delivery.allowed ? delivery.charge : 0);

  // 📍 Detect location (auto fill address, more precise than saved location)
  const detectLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
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
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&countrycodes=in`
          );
          const data = await res.json();
          const address = data.display_name || "Your Location";
          setForm((prev) => ({ ...prev, address }));
        } catch {
          toast.error("Failed to fetch address");
        }

        setLoadingLocation(false);
      },
      () => {
        toast.error("Permission denied");
        setLoadingLocation(false);
      }
    );
  };

  // 🧾 Place Order
  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all fields");
      return;
    }

    if (!delivery.allowed) {
      toast.error(delivery.message);
      return;
    }

    setLoading(true);

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

Total: ₹${finalTotal.toFixed(2)}`;

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
      toast.error("Error saving order");
      setLoading(false);
      return;
    }

    window.open(
      `https://wa.me/919506280968?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    localStorage.removeItem("cart");
    setLoading(false);
    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <>
      <Header />

      <div className="max-w-2xl mt-20 min-h-[79vh] mx-auto p-4 pb-28">
        <h1 className="text-2xl font-bold mt-5 md:mt-10 mb-4 text-gray-900">
          Checkout
        </h1>

        {/* CONTACT DETAILS CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-1">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Contact details</p>
          </div>

          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Your name"
              className="w-full text-sm text-gray-700 capitalize pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Phone number"
              className="w-full text-sm text-gray-700 pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              value={form.phone}
              type="number"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* ADDRESS CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Delivery address</p>
            </div>
            <button
              onClick={detectLocation}
              className="text-[13px] font-semibold text-purple-600 flex items-center gap-1 flex-shrink-0"
            >
              {loadingLocation ? "Detecting..." : (
                <>
                  <MapPin size={13} />
                  Use current
                </>
              )}
            </button>
          </div>

          <textarea
            placeholder="Enter full address"
            className="w-full h-20 p-3 leading-5 border border-gray-200 text-sm text-gray-700 rounded-lg resize-none focus:outline-none focus:border-purple-400"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* PAY USING CARD */}
        <div className="bg-white rounded-xl border-2 border-purple-200 px-4 py-3 mt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Banknote size={18} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-gray-900">Cash on delivery</p>
            <p className="text-[12px] text-gray-500">Pay with cash at delivery time</p>
          </div>
        </div>
      </div>

      {/* STICKY PLACE ORDER BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] z-40">
        <div className="max-w-2xl mx-auto p-4">
          <button
            onClick={handleOrder}
            disabled={!delivery.allowed || loading}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-lg transition ${
              delivery.allowed
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <div className="text-left">
              <p className={`text-[10px] leading-tight ${delivery.allowed ? "text-white/60" : "text-gray-400"}`}>
                Total
              </p>
              <p className={`text-base font-semibold leading-tight ${delivery.allowed ? "text-white" : "text-gray-400"}`}>
                ₹{finalTotal.toFixed(2)}
              </p>
            </div>
            <span className={`text-[15px] font-semibold ${delivery.allowed ? "text-white" : "text-gray-400"}`}>
              {loading ? "Placing order..." : delivery.allowed ? "Place order on WhatsApp" : "Minimum order required"}
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
