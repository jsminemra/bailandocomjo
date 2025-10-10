import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, workoutGoal, workoutLocation, experienceLevel } = body;

    if (!email || !workoutGoal || !workoutLocation || !experienceLevel) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar usuário com as respostas do quiz
    const user = await prisma.user.update({
      where: { email },
      data: {
        workoutGoal,
        workoutLocation,
        experienceLevel,
        hasCompletedQuiz: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'Quiz salvo com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        workoutGoal: user.workoutGoal,
        workoutLocation: user.workoutLocation,
        experienceLevel: user.experienceLevel,
        hasCompletedQuiz: user.hasCompletedQuiz
      }
    });

  } catch (error) {
    console.error('Erro ao salvar quiz:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar suas preferências' },
      { status: 500 }
    );
  }
}

// Endpoint para buscar dados do quiz do usuário
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        workoutGoal: true,
        workoutLocation: true,
        experienceLevel: true,
        hasCompletedQuiz: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, user });

  } catch (error) {
    console.error('Erro ao buscar dados do quiz:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}