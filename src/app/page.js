"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data.slice(0, 6)); // show only 6 on homepage
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }
    fetchProducts();
  }, [user ,loading , router]);

  if (loading) return <p className="text-center p-8">Loading...</p>;



  if (!user) {
   return (
    <div className="bg-gradient-to-r from-gray-300 to-white text-gray-600 h-fit pt-20">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to MyShop
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-xl">
          Discover amazing products at unbeatable prices. Your next favorite
          item is just a click away!
        </p>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-6">
        <h2 className="text-xl font-bold text-center mb-5">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2  md:grid-cols-4 gap-6 max-w-6xl mx-auto">
{[
  { name: "Electronics", img: "electronics.jpg" },
  { name: "Jewelery", img: "jewelery.jpg" },
  { name: "Men's Clothing", img: "men's clothing.jpg" },
  { name: "Women's Clothing", img: "women's clothing.jpg" },
].map((cat) => (
  <Link
    key={cat.name}
    href={`/products?category=${cat.name.toLowerCase()}`}
    className="bg-gray-100 rounded-lg shadow hover:shadow-lg p-6 flex flex-col justify-center items-center transition"
  >
    <Image
      src={`/images/${cat.img}`}
      alt={cat.name}
      width={100}
      height={100}
      className="h-full w-full object-center mb-4"
    />
    <p className="font-semibold text-lg">{cat.name}</p>
  </Link>
))}

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 ">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Shop With Us
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p>Get your orders delivered to your doorstep quickly and safely.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p>We offer competitive pricing on all products for everyone.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p>Our support team is available anytime to help you with your needs.</p>
          </div>
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section className="py-16 px-6 text-gray-500 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6 max-w-lg mx-auto">
          Subscribe to our newsletter to get the latest deals and updates
          straight to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-xl outline-none border border-gray-400 text-gray-500 w-full sm:flex-1"
          />
          <button className="px-6 py-2 bg-white text-blue-500 rounded hover:bg-gray-50 hover:shadow-xl transition font-semibold">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}

  return (
    products.length === 0 ? <Loading/>  :
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center bg-gray-200 pt-20">
        <h1 className="md:text-4xl text-xl font-bold mb-4">
          Welcome back, {user.name || user.email} 👋
        </h1>
        <p className="text-lg mb-6">Shop the best products at MyShop</p>
        <Link
          href="/products"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Start Shopping
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="py-12 px-6 bg-gray-200 text-gray-500">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Featured Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["electronics", "jewelery", "men's clothing", "women's clothing"].map(
            (cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="capitalize font-semibold">{cat}</p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-6 bg-gray-50 text-gray-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            href="/products"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
                href={`/products/${product.id}`}
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow hover:shadow-xl hover:scale-105 transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3"
              />
              <h3 className="font-semibold text-xs md:text-lg">{product.title}</h3>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="text-sm md:text-lg  font-bold mt-2">${product.price}</p>

            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
