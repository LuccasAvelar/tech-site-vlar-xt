import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechStore",
  description: "Os melhores produtos de tecnologia para você",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
