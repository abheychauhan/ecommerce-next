// src/app/api/cart/add/route.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {connectDB} from "@/lib/db";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId, title, price,image, quantity = 1 } = await req.json();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // create new cart
      cart = new Cart({
        userId,
        items: [{ productId, title, price, quantity ,image}],
      });
    } else {
      // check if item exists
      const itemIndex = cart.items.findIndex((i) => i.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId , title, price, quantity , image });
      }
    }

    await cart.save();
   console.log("order",cart)
    
    return new Response(
      JSON.stringify({ message: "Item added to cart", cart }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Cart Add Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
