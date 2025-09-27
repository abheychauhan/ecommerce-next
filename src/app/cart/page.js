"use client";

import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

export default function CartPage() {
  const { cart, loading, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  console.log(cart);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  if (loading || authLoading) return <Loading/>;
  if (!cart.length) return <p className="p-20 text-xl text-center text-gray-500">Your cart is empty</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="pt-20 p-8 h-screen  text-gray-600 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"><span onClick={() => router.back()}><i className="text-2xl  hover:cursor-pointer text-blue-500 ri-arrow-left-line"></i></span>Your Cart</h1>
      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex items-center justify-between border-b py-2"
        >
          <div>
            <img src={item.image} alt={item.title} className="w-20 h-20 object-fit"/>
            <p className="font-semibold">{item.title}</p>
            <p>
              ${item.price} × {item.quantity} = $
              {(item.price * item.quantity).toFixed(2)}
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => decreaseQuantity(item.productId)}
                className="w-8 text-xl text-gray-600 bg-green-500 rounded"
              >
                -
              </button>
              <button
                onClick={() => increaseQuantity(item.productId)}
                className="w-8 text-xl text-gray-600 bg-green-500 rounded"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <h2 className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</h2>
      <button
        onClick={() => router.push("/checkout")}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Checkout
      </button>

    </div>
  );
}
