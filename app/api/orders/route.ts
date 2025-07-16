import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Order, CartItem } from "@/types"

export async function GET() {
  try {
    const orders = await db.orders.findMany()
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { products, total, paymentMethod, installments, address, couponCode, user } = await request.json()

    if (!user || !user.id) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
    }

    if (!products || products.length === 0 || !total || !paymentMethod || !address) {
      return NextResponse.json({ message: "Missing required order details" }, { status: 400 })
    }

    const orderProducts = products.map((item: CartItem) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const newOrder: Omit<Order, "id" | "createdAt"> = {
      userId: user.id,
      products: orderProducts,
      total,
      status: "pending", // Initial status
      paymentMethod,
      installments: paymentMethod === "credit" ? installments : undefined,
      address,
      couponCode,
    }

    const createdOrder = await db.orders.create(newOrder)

    // Optionally, update product stock here
    for (const item of products) {
      const product = await db.products.findUnique(item.id)
      if (product) {
        await db.products.update(product.id, { stock: product.stock - item.quantity })
      }
    }

    // Optionally, trigger webhooks for 'order.created' event
    const webhooks = await db.webhooks.findMany()
    const orderCreatedWebhooks = webhooks.filter((w) => w.event === "order.created" && w.isActive)
    for (const webhook of orderCreatedWebhooks) {
      try {
        await fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "order.created", order: createdOrder }),
        })
      } catch (webhookError) {
        console.error(`Error sending webhook to ${webhook.url}:`, webhookError)
      }
    }

    return NextResponse.json(createdOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}
