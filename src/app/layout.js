import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "MyShop - Ecommerce",
  description: "A modern ecommerce site built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-200">
        <CartProvider>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow bg-gray-100">{children}</main>
          <Footer />
        </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
