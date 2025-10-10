import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const localParam = searchParams.get('local');

    console.log('📥 Personalize Workout - Email:', email, 'Local:', localParam);

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        experienceLevel: true,
        workoutLocation: true,
        hasCompletedQuiz: true
      }
    });

    console.log('👤 User found:', user);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const workoutLocation = localParam || user.workoutLocation || 'casa';
    const experienceLevel = user.experienceLevel || 'iniciante';

    console.log('🔍 Buscando treino:', { experienceLevel, workoutLocation });

    let frequency = 4;
    if (experienceLevel === 'iniciante') frequency = 3;
    if (experienceLevel === 'avancado') frequency = 5;

    const template = await prisma.workoutTemplate.findFirst({
      where: { 
        level: experienceLevel, 
        location: workoutLocation, 
        frequency: frequency 
      },
      include: {
        days: {
          include: { 
            exercises: { 
              orderBy: { order: 'asc' } 
            } 
          },
          orderBy: { dayNumber: 'asc' }
        }
      }
    });

    console.log('📋 Template found:', template ? 'SIM' : 'NÃO');

    if (!template) {
      console.log('⚠️ Template não encontrado, buscando fallback...');
      
      const fallback = await prisma.workoutTemplate.findFirst({
        where: { 
          level: experienceLevel, 
          location: workoutLocation 
        },
        include: {
          days: {
            include: { 
              exercises: { 
                orderBy: { order: 'asc' } 
              } 
            },
            orderBy: { dayNumber: 'asc' }
          }
        }
      });

      console.log('📋 Fallback found:', fallback ? 'SIM' : 'NÃO');

      if (!fallback) {
        console.error('❌ Nenhum treino encontrado no banco');
        return NextResponse.json({ 
          error: 'Nenhum treino encontrado',
          details: { experienceLevel, workoutLocation }
        }, { status: 404 });
      }

      console.log('✅ Retornando fallback');
      return NextResponse.json(fallback);
    }

    console.log('✅ Retornando template');
    return NextResponse.json(template);

  } catch (error) {
    console.error('❌ ERRO no personalize-workout:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json({ 
      error: 'Erro ao gerar treino personalizado',
      details: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}