import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Parâmetros da query
    const level = url.searchParams.get('level') || 'iniciante';
    const location = url.searchParams.get('local') || 'casa';
    const frequency = parseInt(url.searchParams.get('frequency') || '5');
    const email = url.searchParams.get('email');

    // Validar parâmetros
    const validLevels = ['iniciante', 'intermediario', 'avancado'];
    const validLocations = ['casa', 'academia'];
    const validFrequencies = [3, 4, 5, 6];

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Nível inválido. Use: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validLocations.includes(location)) {
      return NextResponse.json(
        { error: `Local inválido. Use: ${validLocations.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: `Frequência inválida. Use: ${validFrequencies.join(', ')}` },
        { status: 400 }
      );
    }

    // Se email foi fornecido, verificar se usuário comprou (tem assinatura)
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          subscriptionStatus: true,
        }
      });

      if (!user) {
        return NextResponse.json(
          { 
            error: 'Acesso negado',
            message: 'Você precisa ter uma assinatura ativa para acessar os treinos.'
          },
          { status: 403 }
        );
      }

      // Verificar se tem assinatura ativa (só quem comprou)
      if (user.subscriptionStatus !== 'active') {
        return NextResponse.json(
          { 
            error: 'Acesso negado',
            message: 'Sua assinatura não está ativa. Entre em contato com o suporte.'
          },
          { status: 403 }
        );
      }
    }

    // Buscar treino no banco de dados
    const workout = await prisma.workoutTemplate.findFirst({
      where: {
        level,
        location,
        frequency,
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

    if (!workout) {
      return NextResponse.json(
        {
          error: 'Treino não encontrado',
          message: `Não encontramos treino para ${level} ${frequency}x na ${location}`,
          requested: { level, location, frequency }
        },
        { status: 404 }
      );
    }

    // Formatar resposta
    const response = {
      id: workout.id,
      name: workout.name,
      level: workout.level,
      frequency: workout.frequency,
      location: workout.location,
      description: workout.description,
      totalDays: workout.days.length,
      totalExercises: workout.days.reduce((acc, day) => acc + day.exercises.length, 0),
      days: workout.days.map(day => ({
        id: day.id,
        dayNumber: day.dayNumber,
        dayName: day.dayName,
        totalExercises: day.exercises.length,
        exercises: day.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          muscleGroup: ex.muscleGroup,
          equipment: ex.equipment,
          instructions: ex.instructions,
          videoUrl: ex.videoUrl,
          order: ex.order
        }))
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}