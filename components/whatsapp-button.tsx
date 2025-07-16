"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href="https://wa.me/5511999999999" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>
    </motion.div>
  )
}
