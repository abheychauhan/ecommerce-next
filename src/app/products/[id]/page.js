"use client";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CartContext } from "@/app/context/CartContext";
import { AuthContext } from "@/app/context/AuthContext";
import Loading from "@/app/components/Loading";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, msg, setMsg } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/product/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(true);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <Loading />;

  if (error || !product)
    return (
      <p className="p-20 text-xl text-gray-500 text-center">
        Product not found.
        <button
          onClick={fetchProduct}
          className="ml-4 bg-white border border-gray-300 px-4 py-2 rounded-xl hover:text-white hover:bg-blue-500 transition duration-500"
        >
          Retry
        </button>
      </p>
    );

  return (
    <div className="pt-20 flex flex-col max-w-7xl mx-auto">
      <h1 className="p-5" onClick={() => router.back()}><i className="text-2xl  hover:cursor-pointer text-blue-500 ri-arrow-left-line"></i></h1>


    <div className="px-8 relative grid md:grid-cols-3 gap-6 text-gray-600 transition duration-500">
      <div className="flex justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="md:w-80 w-40 object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-xl font-semibold mt-4">${product.price}</p>

        <button
          onClick={() => {
            addToCart(product);
            setMsgLoading(true);
            setTimeout(() => setMsgLoading(false), 4000);
          }}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded active:scale-95 active:bg-green-700 transition-transform"
        >
          Add to Cart
        </button>
      </div>

      {/* Message Popup */}
      <div
        className={`absolute ${
          msgLoading ? "block" : "hidden"
        } z-[99] bottom-4 right-4 md:text-xl border border-green-700 rounded-xl p-4 shadow-2xl text-green-500`}
      >
        {msg}
      </div>
    </div>
    </div>
  );
}
