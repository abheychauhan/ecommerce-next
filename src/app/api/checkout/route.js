import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Get user from JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Get cart from cookies
    const cart = cookieStore.get("cart")?.value;
    const items = cart ? JSON.parse(cart) : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 3. Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 4. Save order to MongoDB
    const order = await Order.create({
      userId,
      items,
      total,
    });

    // 5. Clear cart
    const res = NextResponse.json({ message: "Order placed successfully", order });
    res.cookies.set("cart", JSON.stringify([]), { path: "/" });
    return res;
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
