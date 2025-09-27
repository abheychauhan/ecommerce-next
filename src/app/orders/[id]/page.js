"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetails() {
  const { id } = useParams(); // order ID from route
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        console.error(err);
        router.push("/orders"); // redirect if order not found
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, router]);

   const cancelOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);

      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Failed to cancel order");
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-600">Loading order...</p>;
  if (!order) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-700 pt-24">
      <h1 className="text-2xl font-bold mb-4"><span onClick={() => router.back()}><i className="text-2xl  hover:cursor-pointer text-blue-500 ri-arrow-left-line"></i></span>Order Details</h1>
      <p className="mb-2">Order ID: <span className="font-mono">{order._id}</span></p>
      <p className="mb-2">Status: <span className="font-semibold">{order.status || "Processing"}</span></p>
      <p className="mb-4">Shipping Address: {order.address}</p>

      <h2 className="text-xl font-bold mb-2">Items</h2>
      <div className="border rounded-lg overflow-hidden mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border-b last:border-b-0">
            <div className="flex flex-col">
              <span className="font-semibold">{item.title}</span>
              <span className="text-gray-500">Quantity: {item.quantity}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <h2 className="md:text-xl text-xs font-bold mb-4">Ordered on: {new Date(order.createdAt).toLocaleString()}</h2>
      <h2 className="text-xl font-bold mb-4">Total: ${order.total.toFixed(2)}</h2>
      {order.status !== "Cancelled" && (
      <button
        onClick={() => cancelOrder(order._id)}
        className="inline-block px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition mr-5"
      >
        Cancel Order
      </button>
      )}

      <Link
        href="/orders"
        className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Back to Orders
      </Link>
    </div>
  );
}
