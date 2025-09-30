import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Por enquanto, vamos salvar para um usuário teste
    // Depois implementaremos com sessão real
    const testEmail = 'teste@hotmart.com';
    
    await prisma.user.update({
      where: { email: testEmail },
      data: {
        hasCompletedQuiz: true,
        workoutGoal: body.workoutGoal,
        experienceLevel: body.experienceLevel,
        weeklyFrequency: body.weeklyFrequency,
        workoutIntensity: body.workoutIntensity,
        sessionDuration: body.sessionDuration,
        limitations: body.limitations.join(',')
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar quiz:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}