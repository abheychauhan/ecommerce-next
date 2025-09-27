// src/app/api/products/[id]/route.js
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = await context.params; // ✅ await here
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
