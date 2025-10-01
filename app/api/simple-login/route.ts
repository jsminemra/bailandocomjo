import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    // cria cookie de sessão
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
