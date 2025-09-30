import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { workoutDayId, userEmail, startTime } = await req.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail é obrigatório' }, 
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    // Se não encontrar usuário, bloquear acesso (só quem compra pode acessar)
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Acesso negado',
          message: 'Você precisa ter uma assinatura ativa para acessar os treinos.',
          requiresPayment: true
        }, 
        { status: 403 }
      );
    }

    // Validar se tem assinatura ativa (só quem comprou)
    if (user.subscriptionStatus !== 'active') {
      return NextResponse.json(
        { 
          error: 'Acesso negado',
          message: 'Sua assinatura não está ativa. Entre em contato com o suporte.',
          requiresPayment: true
        },
        { status: 403 }
      );
    }

    // Se workoutDayId foi fornecido, buscar informações do dia
    let workoutInfo = null;
    if (workoutDayId) {
      const workoutDay = await prisma.workoutDay.findUnique({
        where: { id: workoutDayId },
        include: {
          exercises: {
            orderBy: { order: 'asc' }
          },
          workoutTemplate: true
        }
      });

      if (workoutDay) {
        workoutInfo = {
          dayId: workoutDay.id,
          dayName: workoutDay.dayName,
          dayNumber: workoutDay.dayNumber,
          templateName: workoutDay.workoutTemplate.name,
          totalExercises: workoutDay.exercises.length,
          exercises: workoutDay.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            muscleGroup: ex.muscleGroup,
            equipment: ex.equipment,
            instructions: ex.instructions,
            videoUrl: ex.videoUrl
          }))
        };
      }
    }

    // Buscar ou criar WorkoutPlan (para manter compatibilidade com sistema antigo)
    let workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        difficulty: user.experienceLevel || 'iniciante'
      }
    });

    if (!workoutPlan) {
      workoutPlan = await prisma.workoutPlan.create({
        data: {
          name: 'Treino Personalizado',
          description: 'Treino baseado no seu perfil',
          duration: 4,
          difficulty: user.experienceLevel || 'iniciante',
          category: user.workoutGoal || 'condicionamento'
        }
      });
    }

    // Criar registro de workout
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        workoutPlanId: workoutPlan.id,
        scheduledDate: startTime ? new Date(startTime) : new Date(),
        status: 'scheduled'
      }
    });

    console.log(`Treino iniciado: ${user.email} - Workout ID: ${workout.id}`);

    return NextResponse.json({
      success: true,
      message: 'Treino iniciado com sucesso',
      workoutId: workout.id,
      userId: user.id,
      workoutPlanId: workoutPlan.id,
      // Incluir informações do WorkoutTemplate se disponível
      ...(workoutInfo && { workoutDay: workoutInfo })
    });

  } catch (error) {
    console.error('Erro ao iniciar treino:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}