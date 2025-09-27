"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

export default function CheckoutPage() {
  const { cart, loading, clearCart } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  if (loading || authLoading) return <Loading />;
  if (!cart.length) return <p className="p-8 text-center text-gray-500">Your cart is empty</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter your shipping address");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await fetch("/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cart,
          total,
          address,
        }),
      });

      if (res.ok) {
        clearCart();
        alert("✅ Order placed successfully!");
        router.push("/orders");
      } else {
        alert("❌ Failed to place order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong!");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-600">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <p>
              {item.title} × {item.quantity}
            </p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <h3 className="text-lg font-bold mt-4">Total: ${total.toFixed(2)}</h3>
      </div>

      {/* Shipping Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full shipping address"
          className="w-full border rounded p-3 text-gray-600"
          rows={4}
        />
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className={`w-full py-3 rounded font-semibold text-white ${
          placingOrder ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
