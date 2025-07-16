"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <Card className="bg-gray-800/50 border-gray-700 flex flex-col h-full">
      <div className="relative w-full h-48">
        <Image
          src={product.image || "/placeholder.png?height=200&width=200"}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-white text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-cyan-400 font-bold text-xl">{formatPrice(product.price)}</span>
          <span className="text-gray-500 text-sm">Estoque: {product.stock}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600"
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock > 0 ? "Adicionar ao Carrinho" : "Esgotado"}
        </Button>
      </CardFooter>
    </Card>
  )
}
