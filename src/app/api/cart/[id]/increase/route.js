import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

export async function POST(req, { params: { id } }) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new mongoose.Types.ObjectId(decoded.id);

    const userCart = await Cart.findOne({ userId });
    if (!userCart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = userCart.items.find((item) => item.productId.toString() === id);
    if (!item) return NextResponse.json({ error: "Item not in cart" }, { status: 404 });

    item.quantity += 1;
    await userCart.save();

    return NextResponse.json({ items: userCart.items });
  } catch (err) {
    console.error("Increase quantity error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
