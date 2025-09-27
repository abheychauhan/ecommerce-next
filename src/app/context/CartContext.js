"use client";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Load cart from backend (cookies) on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart/get");
        const data = await res.json();
        setCart(data.cart?.items || []);
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [msg]);

  // Add item to cart
// CartContext.js addToCart
const addToCart = async (product) => {
  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id, // ✅ must match schema
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    });
    const data = await res.json();
    console.log("cart",data)
    setCart(data);
    setMsg(data.message)
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};


  // Remove item
  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      const data = await res.json();
      setMsg(data);
      setCart(data.cart?.items || []);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // Increase item quantity
  const increaseQuantity = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}/increase`, { method: "POST" });
      const data = await res.json();
      console.log("datainc",data)
      setCart(data.items || []);
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  // Decrease item quantity
  const decreaseQuantity = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}/decrease`, { method: "POST" });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      await res.json();
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        msg,
        setMsg,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
