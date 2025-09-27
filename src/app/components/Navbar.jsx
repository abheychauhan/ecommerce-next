"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      alert("Logout failed");
    }
    setMenuOpen(false); // close menu on logout
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full bg-white text-gray-700 shadow-sm fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold" onClick={closeMenu}>
            MyShop
          </Link>
           {user && (
            <>
              <Link href="/products" className="text-sm hover:text-blue-600 transition">
                Products
              </Link>
              <Link href="/cart" className="text-sm hover:text-blue-600 transition">
                Cart
              </Link>
            </>
          )}
        </div>


        {/* Right section */}
        <div className="hidden md:flex items-center space-x-3">
          {loading ? (
            <span className="text-sm">Checking...</span>
          ) : user ? (
            <>
              <span className="text-sm">Hi, <strong>{user.name}</strong></span>
              <Link href="/orders" className="text-sm hover:text-blue-600 transition">Orders</Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition">
                Login
              </Link>
              <Link href="/auth/register" className="px-3 py-1 rounded border text-sm hover:bg-gray-100 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <i className="text-xl ri-close-line"></i> : <i className="text-xl ri-menu-4-line"></i>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg h-screen text-xl">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {loading ? (
              <span className="text-sm">Checking...</span>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <span className="text-xl text-green-500">Hi, <strong>{user.name}</strong></span>
                <Link href="/products" className="text-gray-700 hover:text-blue-600 transition" onClick={closeMenu}>Products</Link>
                <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition" onClick={closeMenu}>Cart</Link>
                <Link href="/orders" className="text-gray-700 hover:text-blue-600 transition" onClick={closeMenu}>Orders</Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition" onClick={closeMenu}>Login</Link>
                <Link href="/auth/register" className="px-3 py-1 rounded border text-sm hover:bg-gray-100 transition" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
