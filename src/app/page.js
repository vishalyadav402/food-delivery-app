"use client";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import { useRouter } from "next/navigation";
import Image from "next/image";


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
      <div className="w-full rounded-md max-w-6xl mx-auto md:px-4 py-4">
        <section className="rounded-md bg-white shadow text-white">
          {/* <h2 className="text-4xl text-gray-700 font-bold mb-4">Order Daily Essentials Now</h2>
          <p className="text-lg text-gray-700 mb-6">Fresh items delivered to you within minutes!</p>
           */}
           <Image
              className="rounded-xl"
              src="/images/gif_banner.gif"
              alt="Banner Image"
              height={100}
              width={100}
              layout="responsive"
            />
        </section>
      </div>

      {/* Menu Section */}
      <main className="flex-grow w-full md:max-w-6xl mx-auto px-4 md:px-4 py-4">
       <Menu
        cart={cart}
        addToCart={addToCart}
        updateQty={updateQty}
        removeItem={removeItem}
      />

      {/* Optional: show cart modal here in page */}
      {showCart && (
        <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center  justify-end z-50">
          <div className="bg-green-900/90 p-6 h-[100vh] w-full md:max-w-md relative">
           <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-400">Order List</h2>
              <p className="text-gray-400 text-sm mb-4">(You have {cart.length} items to buy)</p>
            </div>
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-6 right-4 text-white text-xl"
            >
              ✖
            </button>
            </div>
            {/* pass cart props to Cart component */}
            <Cart
              cart={cart}
              goToCheckout={() => goToCheckout()}
              updateQty={updateQty}
              removeItem={removeItem}
              setShowCart={setShowCart}
            />
          </div>
        </div>
      )}

      </main>

      <Footer />
    </div>
  );
}
