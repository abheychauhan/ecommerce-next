import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {connectDB} from "@/lib/db";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cart = await Cart.findOne({ userId });
    return NextResponse.json({ cart: cart || { items: [] } });
  } catch (err) {
    console.error("Get cart error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
