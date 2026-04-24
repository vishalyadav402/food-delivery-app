"use client";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { calculateDelivery, DELIVERY_RULES } from "./utils/deliveryConfig";
import LocationModal from "./components/LocationModal";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("");

  const router = useRouter();

  // ✅ Load location
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");

    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setLocation(savedLocation);
    }
  }, []);

  // ✅ Reverse geocode
  const getAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      return (
        data.address?.suburb ||
        data.address?.village ||
        data.address?.town ||
        data.address?.city ||
        "Your Area"
      );
    } catch {
      return "Your Area";
    }
  };

  // ✅ Auto detect location
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const address = await getAddress(lat, lng);

        setLocation(address);
        localStorage.setItem("userLocation", address);
        setShowLocationModal(false);
      },
      () => alert("Location permission denied")
    );
  };

  // ✅ Save manual location
  const handleSaveLocation = () => {
    if (!location) return alert("Enter location");

    localStorage.setItem("userLocation", location);
    setShowLocationModal(false);
  };

  // 🛒 Load cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🛒 Add
  const addToCart = (product) => {
    const v = product.variant || "Default";

    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.name === product.name &&
          (item.variant || "Default") === v
      );

      if (exists) {
        return prev.map((item) =>
          item.name === product.name &&
          (item.variant || "Default") === v
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, variant: v, qty: 1 }];
    });
  };

  // ➕➖ Update
  const updateQty = (name, variant, qty) => {
    const v = variant || "Default";

    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.name === name &&
            (item.variant || "Default") === v
          ) {
            if (qty <= 0) return null;
            return { ...item, qty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // ❌ Remove
  const removeItem = (name, variant) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.name === name &&
            (item.variant || "Default") === (variant || "Default")
          )
      )
    );
  };

  const goToCheckout = () => {
    if (!cart.length) return alert("Cart empty");
    router.push("/checkout");
  };

  // ✅ DELIVERY CALCULATION
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const delivery = calculateDelivery(cartTotal);
  const finalTotal = cartTotal + (delivery.charge || 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <Header
        location={location}
        openLocationModal={() => setShowLocationModal(true)}
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
      />
      {/* HERO */}
      <div className="px-4 pt-4">
        <Image
          src="/images/gif_banner.gif"
          alt="Banner"
          width={2000}
          height={1000}
          className="rounded-xl"
        />
      </div>

      {/* MENU */}
      <main className="max-w-full px-4 pb-4">
        <Menu
          cart={cart}
          addToCart={addToCart}
          updateQty={updateQty}
          removeItem={removeItem}
          cartCount={cart.length}
          onCartClick={() => setShowCart(true)}
        />
      </main>
      {/* CART DRAWER */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
          <div className="bg-green-900 w-full md:max-w-md p-4 flex flex-col">
        <div className="flex justify-between">
          <p className="text-white text-xl font-bold my-2">My Cart</p>
  
            <button
              onClick={() => setShowCart(false)}
              className="text-white text-xl self-end mb-2"
            >
              ✖
            </button>
        </div>

            <Cart
              cart={cart}
              updateQty={updateQty}
              removeItem={removeItem}
              setShowCart={setShowCart}
            />
<div className="sticky bottom-2 bg-green-400/10 backdrop-blur-sm p-3 rounded-md">
            {/* DELIVERY SECTION */}
            <div className="mt-2 bg-white/10 p-3 rounded text-white text-sm">

              {!delivery.allowed ? (
                <p className="text-red-300">{delivery.message}</p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {delivery.charge === 0
                        ? "FREE 🎉"
                        : `₹${delivery.charge}`}
                    </span>
                  </div>

                  {delivery.charge > 0 && (
                    <p className="text-yellow-300 text-xs mt-1">
                      Add ₹
                      {DELIVERY_RULES.freeDeliveryAbove - cartTotal} more for FREE delivery
                    </p>
                  )}

                  <hr className="my-2 border-white/20" />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </>
              )}
            </div>

            {/* CHECKOUT */}
            <button
              onClick={goToCheckout}
              disabled={!delivery.allowed}
              className={`mt-4 w-full py-2 rounded ${
                delivery.allowed
                  ? "bg-green-600"
                  : "bg-gray-50 cursor-not-allowed"
              }`}
            >
              {delivery.allowed
                ? "Proceed to Checkout"
                : "Minimum Order Required"}
            </button>
            </div>
          </div>
        </div>
      )}

     <LocationModal
  showLocationModal={showLocationModal}
  setShowLocationModal={setShowLocationModal}
  location={location}
  setLocation={setLocation}
  handleSaveLocation={handleSaveLocation}
/>
      <Footer />
    </div>
  );
}