export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-300 to-white text-gray-600 py-6 text-center">
      <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
      <p className="text-sm mt-1">
        Built with <span className="text-blue-400">Next.js</span> & ❤️
      </p>
    </footer>
  );
}
