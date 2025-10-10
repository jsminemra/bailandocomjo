import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mapeamento de áreas de foco para grupos musculares
const FOCUS_TO_MUSCLE_GROUPS: Record<string, string[]> = {
  'gluteos': ['gluteos', 'posterior'],
  'pernas': ['pernas', 'quadriceps', 'posterior'],
  'bracos': ['biceps', 'triceps', 'ombros'],
  'abdomen': ['abdomen', 'core'],
  'corpo_todo': []
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const localParam = searchParams.get('local');

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

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const workoutLocation = localParam || user.workoutLocation || 'casa';
    const experienceLevel = user.experienceLevel || 'iniciante';
    const focusArea = 'corpo_todo'; // Valor padrão já que o campo não existe

    let frequency = 4; // intermediário (padrão)
    if (experienceLevel === 'iniciante') frequency = 3;
    if (experienceLevel === 'avancado') frequency = 5;

    const template = await prisma.workoutTemplate.findFirst({
      where: { level: experienceLevel, location: workoutLocation, frequency: frequency },
      include: {
        days: {
          include: { exercises: { orderBy: { order: 'asc' } } },
          orderBy: { dayNumber: 'asc' }
        }
      }
    });

    if (!template) {
      const fallback = await prisma.workoutTemplate.findFirst({
        where: { level: experienceLevel, location: workoutLocation },
        include: {
          days: {
            include: { exercises: { orderBy: { order: 'asc' } } },
            orderBy: { dayNumber: 'asc' }
          }
        }
      });

      if (!fallback) {
        return NextResponse.json({ error: 'Nenhum treino encontrado' }, { status: 404 });
      }

      return NextResponse.json(personalizeWorkout(fallback, focusArea));
    }

    return NextResponse.json(personalizeWorkout(template, focusArea));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao personalizar treino:', errorMessage);
    return NextResponse.json({ error: 'Erro ao gerar treino personalizado' }, { status: 500 });
  }
}

function personalizeWorkout(template: unknown, focusArea: string): unknown {
  if (focusArea === 'corpo_todo') return template;

  const targetMuscles = FOCUS_TO_MUSCLE_GROUPS[focusArea] || [];
  const personalized = JSON.parse(JSON.stringify(template));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalized.days = personalized.days.map((day: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const focusExercises = day.exercises.filter((ex: any) => 
      targetMuscles.some(muscle => ex.muscleGroup.toLowerCase().includes(muscle))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const otherExercises = day.exercises.filter((ex: any) => 
      !targetMuscles.some(muscle => ex.muscleGroup.toLowerCase().includes(muscle))
    );

    if (focusExercises.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const boostedFocusExercises = focusExercises.map((ex: any) => ({
        ...ex,
        sets: ex.sets + 1,
        reps: incrementReps(ex.reps)
      }));

      return {
        ...day,
        exercises: [...boostedFocusExercises, ...otherExercises]
      };
    }

    return day;
  });

  return personalized;
}

function incrementReps(reps: string): string {
  if (reps.includes('-')) {
    const [min, max] = reps.split('-').map(Number);
    return `${min + 2}-${max + 2}`;
  }
  
  const num = parseInt(reps);
  if (!isNaN(num)) {
    return `${num + 2}`;
  }

  return reps;
}