import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()

  cookieStore.delete("auth-token")
  cookieStore.delete("fingerprint")

  return NextResponse.json({ message: "Logout realizado com sucesso" })
}
