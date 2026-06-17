"use client";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import { useCart } from "./context/CartContext";
import { useLocation } from "./context/LocationContext";

export default function Home() {
  const { cart, setShowCart } = useCart();
  const { location, setShowLocationModal } = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        location={location}
        openLocationModal={() => setShowLocationModal(true)}
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
      />

      <main className="max-w-full md:px-4 p-2 pb-4 mt-28">
        <Menu onCartClick={() => setShowCart(true)} />
      </main>

      <Footer />
      {/* ❌ no LocationModal here — it's global, rendered once in layout.jsx */}
    </div>
  );
}