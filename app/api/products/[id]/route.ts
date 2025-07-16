import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { Product } from "@/types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const product = await db.products.findUnique(id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const productData: Partial<Product> = await request.json()
    const updatedProduct = await db.products.update(id, productData)

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const deletedProduct = await db.products.delete(id)

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
  }
}
