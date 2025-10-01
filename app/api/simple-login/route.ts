import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório" },
        { status: 400 }
      );
    }

    // Busca usuário apenas pelo email (case insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado. Verifique seu e-mail." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    console.error("Erro no login:", error);

    const err = error as { code?: string; message?: string };

    return NextResponse.json(
      { error: `Erro ao processar login: ${err?.code || ""} ${err?.message || String(error)}` },
      { status: 500 }
    );
  }
}
