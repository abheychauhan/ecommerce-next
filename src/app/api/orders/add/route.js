import {connectDB} from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const order = new Order(body);
    await order.save();
    return new Response(JSON.stringify(order), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
