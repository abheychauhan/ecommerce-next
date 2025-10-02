"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Loading from "../components/Loading";
import { useSearchParams, useRouter } from "next/navigation";

function ProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  const params = useSearchParams();
  const category = params.get("category");

  // fetch products
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = ["all", ...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // filter by query param
  useEffect(() => {
    if (category) {
      let temp = [...products];
      temp = temp.filter((p) => p.category === category);
      setSelectedCategory(category);
      setFilteredProducts(temp);
    }
  }, [category, products]);

  const applyFilters = () => {
    let temp = [...products];

    if (selectedCategory !== "all") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }
    if (minPrice !== "") {
      temp = temp.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== "") {
      temp = temp.filter((p) => p.price <= Number(maxPrice));
    }

    setFilteredProducts(temp);
  };

  if (loading) return <Loading />;

  return products.length > 0 ? (
    <div className="p-8 pt-20 max-w-7xl mx-auto text-gray-600">
      <h1 onClick={() => router.back()}>
        <i className="text-2xl hover:cursor-pointer text-blue-500 ri-arrow-left-line"></i>
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div>
          <label className="mr-2 font-semibold">Category: </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded p-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <label className="mr-2 font-semibold">Min Price: </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="border rounded p-2 w-24"
          />
        </div>

        <div>
          <label className="mr-2 font-semibold">Max Price: </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            className="border rounded p-2 w-24"
          />
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        {filteredProducts.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="border rounded-lg md:p-4 p-2 shadow hover:shadow-xl bg-white border-gray-200 hover:scale-105 transition-all duration-500"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-contain mb-3"
            />
            <h2 className="font-semibold text-xs md:text-lg">{product.title}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <p className="p-20 text-xl text-gray-500 text-center">
      No products found.{" "}
      <button
        onClick={() => window.location.reload()}
        className="bg-white border border-gray-200 px-4 py-2 rounded-xl hover:text-white hover:bg-blue-500 transition duration-500"
      >
        retry
      </button>
    </p>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsPageContent />
    </Suspense>
  );
}
