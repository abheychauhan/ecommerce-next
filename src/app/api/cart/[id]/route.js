// src/app/api/cart/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params; 
    console.log("Deleting item with id:", id);
    await connectDB();

    const result = await Cart.updateOne(
      { "items.productId": id },
      { $pull: { items: { productId: id } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Delete from cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
