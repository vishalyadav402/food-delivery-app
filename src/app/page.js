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

const updateQty = (name, variant, qty) => {
  const v = variant || "Default";
  const newQty = Number(qty); // ✅ ensure number

  setCart((prev) => {
    return prev
      .map((item) => {
        const itemVariant = item.variant || "Default";

        if (item.name === name && itemVariant === v) {
          if (newQty <= 0) return null; // remove later
          return { ...item, qty: newQty };
        }

        return item;
      })
      .filter(Boolean); // ✅ remove null items
  });
};


  const removeItem = (name, variant) => {
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
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  router.push("/checkout");
};

  return (
    <div className="font-sans min-h-screen bg-white flex flex-col">
       <Header
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
      />
      {/* Hero Section */}
      <div className="w-full rounded-md max-w-6xl mx-auto px-4 py-4">
        <section className="rounded-md">
          <h2 className="text-4xl text-gray-700 font-bold mb-4">Order Daily Essentials Now</h2>
          <p className="text-lg text-gray-700 mb-6">Fresh items delivered to you within minutes!</p>
          
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
      <main className="w-full md:max-w-6xl mx-auto px-4 py-4">
       <Menu
        cart={cart}
        addToCart={addToCart}
        updateQty={updateQty}
        removeItem={removeItem}
        cartCount={cart.length}
        onCartClick={() => setShowCart(true)}
      />

      {/* Optional: show cart modal here in page */}
      {showCart && (
        <div className="fixed top-0 right-0 inset-0 bg-black/70 flex items-center  justify-end z-50">
          <div className="bg-green-900/90 p-6 h-['100vh'] w-full md:max-w-md relative">
           <div className="flex md:mt-0 mt-5 justify-between items-center">
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
