import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const localParam = searchParams.get('local'); // casa ou academia

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        experienceLevel: true,
        workoutLocation: true,
        hasCompletedQuiz: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    if (!user.hasCompletedQuiz || !user.experienceLevel) {
      return NextResponse.json(
        { error: 'Complete o quiz primeiro' },
        { status: 400 }
      );
    }

    // Determinar o local do treino
    // Se vier o parâmetro 'local', usa ele (para alternar casa/academia)
    // Se não, usa o que está no perfil do usuário
    const workoutLocation = localParam || user.workoutLocation || 'casa';
    const experienceLevel = user.experienceLevel;

    // Frequência padrão baseada no nível
    let frequency = 5; // padrão
    if (experienceLevel === 'iniciante') frequency = 4;
    if (experienceLevel === 'avancado') frequency = 6;

    // Buscar template do banco de dados
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
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            dayNumber: 'asc'
          }
        }
      }
    });

    if (!template) {
      // Se não encontrar template exato, buscar um similar
      const fallbackTemplate = await prisma.workoutTemplate.findFirst({
        where: {
          level: experienceLevel,
          location: workoutLocation
        },
        include: {
          days: {
            include: {
              exercises: {
                orderBy: {
                  order: 'asc'
                }
              }
            },
            orderBy: {
              dayNumber: 'asc'
            }
          }
        }
      });

      if (!fallbackTemplate) {
        return NextResponse.json(
          { error: 'Nenhum treino encontrado para o seu perfil' },
          { status: 404 }
        );
      }

      return NextResponse.json(fallbackTemplate);
    }

    return NextResponse.json(template);

  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar treino personalizado' },
      { status: 500 }
    );
  }
}