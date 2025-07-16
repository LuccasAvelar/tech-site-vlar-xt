import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Product } from "@/types"

export async function GET() {
  try {
    const products = await db.products.findMany()
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const productData: Omit<Product, "id"> = await request.json()
    const newProduct = await db.products.create(productData)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}
