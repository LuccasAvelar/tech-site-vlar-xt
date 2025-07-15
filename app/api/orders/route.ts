import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Criar pedido
    const orderResult = await sql`
      INSERT INTO orders (user_id, total, payment_method, installments, address, coupon_code)
      VALUES (${orderData.user.id}, ${orderData.total}, ${orderData.paymentMethod}, ${orderData.installments}, ${orderData.address}, ${orderData.couponCode || null})
      RETURNING *
    `

    const newOrder = orderResult[0]

    // Inserir itens do pedido
    for (const product of orderData.products) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${newOrder.id}, ${product.id}, ${product.quantity}, ${product.price})
      `
    }

    // Buscar pedido completo com itens
    const completeOrder = {
      ...newOrder,
      products: orderData.products,
      user: orderData.user,
    }

    // Enviar email de notificação (se configurado)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendOrderNotification(completeOrder)
    }

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

async function sendOrderNotification(order: any) {
  try {
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const emailContent = `
      🛒 NOVO PEDIDO RECEBIDO!
      
      👤 Cliente: ${order.user.name}
      📧 Email: ${order.user.email}
      📱 Telefone: ${order.user.phone}
      
      🛍️ Produtos:
      ${order.products.map((p: any) => `• ${p.name} (Qtd: ${p.quantity}) - R$ ${p.price.toFixed(2)}`).join("\n")}
      
      💰 Total: R$ ${order.total.toFixed(2)}
      💳 Pagamento: ${order.paymentMethod}
      📦 Parcelas: ${order.installments}x
      📍 Endereço: ${order.address}
      ${order.couponCode ? `🎫 Cupom: ${order.couponCode}` : ""}
      
      ⏰ Data: ${new Date().toLocaleString("pt-BR")}
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "luccasavelar@gmail.com",
      subject: "🚀 Novo Pedido - TechStore",
      text: emailContent,
    })

    console.log("✅ Email de notificação enviado!")
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error)
  }
}
