"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/get");
        const data = await res.json();
        console.log(data)
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="p-8 text-gray-600">Loading orders...</p>;
  if (!orders.length) return <p className="p-8 text-gray-600">No orders yet</p>;

  return (
    <div className="p-8 text-gray-600 pt-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"><span onClick={() => router.push("/")}><i className="text-2xl  hover:cursor-pointer text-blue-500 ri-arrow-left-line"></i></span>Your Orders</h1>
      {orders.map((order) => (
        <Link key={order._id}  href={`/orders/${order._id}`}>
          <div className="border border-gray-200 bg-white p-4 rounded mb-4 hover:shadow-lg transition">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <ul className="mt-2">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.title} × {item.quantity} = ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p className="font-bold mt-2">Total: ${order.total}</p>
        </div>
        </Link >
      ))}
    </div>
  );
}
