import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find order
    const order = await Order.findOne({ _id: id, userId: decoded.id });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Only allow cancel if order is not already canceled
    if (order.status === "Canceled") {
      return NextResponse.json({ error: "Order already canceled" }, { status: 400 });
    }

    order.status = "Canceled";
    await order.save();

    return NextResponse.json({ message: "Order canceled successfully" });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
