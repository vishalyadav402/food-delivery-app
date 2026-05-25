"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // 👈 global drawer state

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const v = product.variant || "Default";
    setCart((prev) => {
      const exists = prev.find(
        (item) => item.name === product.name && (item.variant || "Default") === v
      );
      if (exists) {
        return prev.map((item) =>
          item.name === product.name && (item.variant || "Default") === v
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, variant: v, qty: 1 }];
    });
  };

  const updateQty = (name, variant, qty) => {
    const v = variant || "Default";
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.name === name && (item.variant || "Default") === v) {
            if (qty <= 0) return null;
            return { ...item, qty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeItem, total, showCart, setShowCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}