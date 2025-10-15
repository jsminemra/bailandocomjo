import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Preencha nome e e-mail." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // Verifica se já existe o usuário
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        hasCompletedQuiz: true,
        workoutGoal: true,
        workoutLocation: true,
        experienceLevel: true,
      },
    });

    if (existingUser) {
      // Usuário existente → apenas retorna
      return NextResponse.json({ ok: true, user: existingUser });
    }

    // Cria novo usuário
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName,
        hasCompletedQuiz: false,
      },
    });

    return NextResponse.json({ ok: true, user: newUser });
  } catch (error) {
    console.error("Erro no simple-login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
