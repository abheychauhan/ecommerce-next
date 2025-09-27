import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function DELETE() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await Cart.findOneAndDelete({ userId });

    return NextResponse.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
