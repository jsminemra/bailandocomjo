import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        hasCompletedQuiz: true,
        experienceLevel: true,
        weeklyFrequency: true,
        workoutGoal: true,
        name: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao verificar quiz:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}