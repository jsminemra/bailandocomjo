import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
