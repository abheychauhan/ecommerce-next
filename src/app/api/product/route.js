// src/app/api/products/route.js
import { NextResponse } from "next/server";

// GET /api/products -> fetch all products
export async function GET() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    console.log(products)
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
