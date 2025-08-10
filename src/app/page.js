"use client";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import { useRouter } from "next/navigation";


export default function Home() {
    const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
const router = useRouter();
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (name, qty) => {
    if (qty < 1) return removeItem(name);
    setCart((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, qty } : item
      )
    );
  };

  const removeItem = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="font-sans min-h-screen flex flex-col">
       <Header
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
      />
      {/* Hero Section */}
      <div className="flex-grow w-full rounded-md max-w-6xl mx-auto md:px-4 py-4">
        <section className="py-12 text-center rounded-md bg-[url('/images/banner.png')] bg-no-repeat bg-cover h-[20vh] md:h-[60vh] text-white">
          {/* <h2 className="text-4xl text-gray-700 font-bold mb-4">Order Your Favorite Food Now</h2>
          <p className="text-lg text-gray-700 mb-6">Delicious meals delivered fresh to your door</p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600">
            Order Now
          </button> */}
        </section>
      </div>

      {/* Menu Section */}
      <main className="flex-grow w-full md:max-w-6xl mx-auto md:px-4 py-4">
       <Menu
        cart={cart}
        addToCart={addToCart}
        updateQty={updateQty}
        removeItem={removeItem}
      />

      {/* Optional: show cart modal here in page */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              ✖
            </button>
            {/* pass cart props to Cart component */}
            <Cart
              cart={cart}
              goToCheckout={() => goToCheckout()}
              updateQty={updateQty}
              removeItem={removeItem}
            />
          </div>
        </div>
      )}

      </main>

      <Footer />
    </div>
  );
}
