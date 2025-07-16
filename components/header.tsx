"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            TechStore
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Início
            </Link>
            <Link href="/contato" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Contato
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/carrinho" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-cyan-400 text-black">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
                  <DropdownMenuItem className="text-gray-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="text-gray-300">
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Administração</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-gray-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-500 hover:to-blue-600">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
